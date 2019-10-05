import path from 'path';
const showOpenDialog = require('electron').dialog.showOpenDialog;
import { AdapterManifest } from './def_manifest';
import { readFileAsync, ensureFolderAsync, copyFolderAsync, removeFolderAsync } from '../utils/fileUtils';
import { existsSync, mkdirSync } from 'fs';
import { registerAdapter, getAdapter, getAdapters, initAdapters, unRegisterAdapter } from './adapter_state';
import { ChildProcess, spawn } from 'child_process';

const getExesFolder = (): string => {
    return path.resolve(path.dirname(process.mainModule.filename), 'adapters')
}

const getExtPluginFoldPathFromDialog = async (): Promise<string> => {
    const dialogRes = await showOpenDialog({
        properties: ['openDirectory'],
        title: 'Select New Plugin Folder'
    }) as any;
    let pluginExternFoldPath: string = null;
    // console.log(dialogRes);
    if (dialogRes.canceled == true) {
        return null;
    }
    else if (dialogRes.filePaths.length == 0) {
        return null;
    }
    else {
        pluginExternFoldPath = dialogRes.filePaths[0];
    }
    // console.log(pluginExternFoldPath);
    return pluginExternFoldPath
};

const ensureManifestAttrs = async (manifestJson: AdapterManifest): Promise<AdapterManifest> => {
    // ensure manifest json attributes
    let absentAttrs: string[] = []
    if (manifestJson.app_id == undefined) {
        absentAttrs.push('app_id');
    }
    if (manifestJson.entry == undefined) {
        absentAttrs.push('entry');
    }
    if (manifestJson.name == undefined) {
        absentAttrs.push('name');
    }
    if (manifestJson.is_meas_picker_present == undefined) {
        absentAttrs.push('is_meas_picker_present');
    }
    if (manifestJson.is_adapter_config_ui_present == undefined) {
        absentAttrs.push('is_adapter_config_ui_present');
    }
    if (absentAttrs.length > 0) {
        console.log(`${absentAttrs.join(', ')} are absent in manifest json file`);
        return null;
    }
    return manifestJson;
};

const getManifestFromExternPlugin = async (pluginExternFoldPath: string): Promise<AdapterManifest> => {
    // check if manifest file exists
    const manifestPath = path.join(pluginExternFoldPath, 'manifest.json');
    if (!existsSync(manifestPath)) {
        console.log('manifest file not present');
        return null;
    }
    // read the manifest JSON from file
    let manifestJson = JSON.parse(await readFileAsync(manifestPath) as string) as any as AdapterManifest;
    // console.log(manifestJson);
    return await ensureManifestAttrs(manifestJson);
};

const copyPluginFolder = async (pluginExternFoldPath: string, manifestJson: AdapterManifest): Promise<string> => {
    // copy plugin folder to app plugins directory
    const pluginFolderPath = path.join(getExesFolder(), manifestJson.app_id);
    console.log(`plugin folder path = ${pluginFolderPath}`);
    // // check if pluginFolderPath exists already in the adapter exes Location
    // if (existsSync(pluginFolderPath)) {
    //     console.log('pluginFolderPath already present');
    // }
    try {
        const ensFoldRes = await ensureFolderAsync(pluginFolderPath);
        const foldCopyRes = await copyFolderAsync(pluginExternFoldPath, pluginFolderPath);
        console.log('Plugin Folder copy completed!');
    } catch (err) {
        console.log(err);
        return null
    }
    return pluginFolderPath;
};

const isPluginNamePresent = (pluginName: string): boolean => {
    const adapters = getAdapters();
    let pluginNameExists = false;
    for (const app_id of Object.keys(adapters)) {
        if (adapters[app_id].name == pluginName) {
            pluginNameExists = true;
            break;
        }
    }
    return pluginNameExists;
};

export const registerPlugin = async (): Promise<AdapterManifest> => {
    // get the user selected folder path
    const pluginExtFoldPath = await getExtPluginFoldPathFromDialog();
    if (pluginExtFoldPath == null) {
        return null;
    }
    // read the manifest of the selected folder
    const manifestJson = await getManifestFromExternPlugin(pluginExtFoldPath);
    if (manifestJson == null) {
        return null;
    }
    // check if the plugin name already exists
    const pluginExists = isPluginNamePresent(manifestJson.name);
    if (pluginExists == true) {
        console.log(`plugin name ${manifestJson.name} already exists, hence plugin installation is aborted`);
        return null;
    }
    const pluginFolderPath: string = await copyPluginFolder(pluginExtFoldPath, manifestJson);
    if (pluginFolderPath == null) {
        return null;
    }
    // add the plugin attributes to the plugins app state and the json file for persistence
    await registerAdapter(manifestJson);
    return manifestJson;
};

export const updatePlugin = async (adapterId): Promise<AdapterManifest> => {
    // get the user selected folder path
    const pluginExtFoldPath = await getExtPluginFoldPathFromDialog();
    if (pluginExtFoldPath == null) {
        return null;
    }
    // read the manifest of the selected folder
    const manifestJson = await getManifestFromExternPlugin(pluginExtFoldPath);
    if (manifestJson == null) {
        return null;
    }

    // abort update if adapter id does not match
    if (adapterId != manifestJson.app_id) {
        console.log(`Looks like you are not updating the adapter with id ${adapterId}`);
        return null;
    }

    // abort update if plugin does not exist
    const pluginExists = isPluginNamePresent(manifestJson.name);
    if (pluginExists == false) {
        console.log(`plugin name ${manifestJson.name} does not exist, hence we cant update plugin`);
        return null;
    }
    const pluginFolderPath: string = await copyPluginFolder(pluginExtFoldPath, manifestJson);
    if (pluginFolderPath == null) {
        return null;
    }
    // add the plugin attributes to the plugins app state and the json file for persistence
    await registerAdapter(manifestJson);
    console.log(`successfully updated plugin ${manifestJson.app_id}`);
    return manifestJson;
};

export const unRegisterPlugin = async (adapterId: string): Promise<boolean> => {
    // refresh adapters list from file
    const adapters = await initAdapters();
    // check if adapterId exists in the app registry object
    if (!Object.keys(adapters).includes(adapterId)) {
        console.log(`${adapterId} is not present in adapters registry of this app`);
    } else {
        // remove app_id object from app registry object
        unRegisterAdapter(adapterId);
    }
    // delete the app_id folder
    const pluginFolderPath = path.join(getExesFolder(), adapterId);
    const isSuccess = await removeFolderAsync(pluginFolderPath);
    console.log(`successfully uninstalled plugin ${adapterId}`);
    return isSuccess;
};

const fetchExeData = async (exePath, cmdParams: string[]): Promise<string> => {
    const getIpcRespAsync = (ipc: ChildProcess): Promise<string> => {
        return new Promise((resolve, reject) => {
            let res = "";

            ipc.stderr.once('data', function (data) {
                // console.log(data.toString());
                reject(data.toString());
            });

            ipc.stdout.on('data', function (data) {
                // console.log(data.toString());
                // resolve(`result=` + data.toString());
                res += data.toString();
            });

            ipc.once('close', (code: number) => {
                resolve(res);
                // console.log(`Ipc exe to exit with code: ${code}`);
            });
        });
    }
    // cmdParams.unshift('/c', exePath);
    // console.log(exePath);
    // console.log(cmdParams);
    // const ipc = spawn('cmd.exe', cmdParams);
    const ipc = spawn(exePath, cmdParams);
    let resp: string = null;
    try { resp = await getIpcRespAsync(ipc); }
    catch (ex) {
        console.log(ex);
        resp = null;
    }
    return resp;
};

export const fetchFromAdapter = async (adapterId: string, cmdParams: string[]) => {
    const adapter: AdapterManifest = getAdapter(adapterId);
    // get the exe path of adapter
    const exePath = path.join(getExesFolder(), adapter.app_id, adapter.entry)
    const resp = await fetchExeData(exePath, cmdParams);
    // console.log(resp);
    return resp;
};