import { AdapterManifest } from "./def_manifest";
import path from 'path';
import { existsSync } from 'fs';
import { writeFileAsync, readFileAsync } from "../utils/fileUtils";


let adapters_list: { [key: string]: AdapterManifest } = {};
const adaptersListFilename: string = 'adapter_register.json';

export const persistAdapters = async () => {
    writeFileAsync(getAdapterRepoFilePath(), JSON.stringify(adapters_list, null, 4));
    console.log(`Adapters Register created`);
};

export const initAdapters = async () => {
    const filePath = getAdapterRepoFilePath();
    if (!existsSync(filePath)) {
        console.log(`${filePath} file not present`);
        persistAdapters();
    } else {
        adapters_list = JSON.parse(await readFileAsync(filePath) as string);
    }
    return adapters_list;
};

export const registerAdapter = async (manifestObj: AdapterManifest) => {
    adapters_list[manifestObj.app_id] = manifestObj;
    await persistAdapters();
};

export const unRegisterAdapter = async (adapterId: string) => {
    delete adapters_list[adapterId];
    await persistAdapters();
};

export const getAdapter = (key: string) => {
    if (!['number', 'string'].includes(typeof key)) {
        return null;
    }
    return adapters_list[key];
};

export const getAdapters = () => {
    return adapters_list;
};

export const getAdapterRepoFilePath = (): string => {
    const filePath: string = path.resolve(path.dirname(process.mainModule.filename), adaptersListFilename);
    return filePath;
}