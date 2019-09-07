import { existsSync } from 'fs';
import { join } from 'path';
import { initUtils } from './utils';
import { writeFileAsync, readFileAsync } from './utils/fileUtils'
import { PmuMeasFetcher, IPmuMeasItem } from './Fetchers/PmuMeasFetcher'
import merge from 'deepmerge';
import { registerPrefsState, registerPmuMeasListState } from './appState';

export interface IPrefs {
    pmu: {
        soap: {
            host: string,
            port: number,
            path: string,
            username: string,
            password: string
        }
    },
    wbes: {
        host: string
    }
}

export const appSettingsFilename = "appSettings.json";
export const pmuMeasListFilename = "pmu_meas_list.json";
export const defaultPrefs: IPrefs = {
    pmu: {
        soap: {
            host: 'hostname',
            port: 123,
            path: '/etera/xyz',
            username: 'uname',
            password: 'pass'
        }
    },
    wbes: {
        host: 'scheduling.wrldc.in'
    }
};

export const defaultPmuMeasList = [[2, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VRM", 15135, "WR1PGKOTRA_PG112"], [3, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VRA", 15135, "WR1PGKOTRA_PG112"], [4, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VYM", 15135, "WR1PGKOTRA_PG112"], [5, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VYA", 15135, "WR1PGKOTRA_PG112"], [6, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VBM", 15135, "WR1PGKOTRA_PG112"], [7, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VBA", 15135, "WR1PGKOTRA_PG112"], [8, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VPM", 15135, "WR1PGKOTRA_PG112"], [9, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VPA", 15135, "WR1PGKOTRA_PG112"], [10, "KOTRA_PG", "L", "400ATHN4KOTRA1", "HZ", 15135, "WR1PGKOTRA_PG112"], [11, "KOTRA_PG", "L", "400ATHN4KOTRA1", "DF", 15135, "WR1PGKOTRA_PG112"], [12, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IRM", 15135, "WR1PGKOTRA_PG112"], [13, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IRA", 15135, "WR1PGKOTRA_PG112"], [14, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IYM", 15135, "WR1PGKOTRA_PG112"], [15, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IYA", 15135, "WR1PGKOTRA_PG112"], [16, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IBM", 15135, "WR1PGKOTRA_PG112"], [17, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IBA", 15135, "WR1PGKOTRA_PG112"], [18, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IPM", 15135, "WR1PGKOTRA_PG112"], [19, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IPA", 15135, "WR1PGKOTRA_PG112"], [20, "KOTRA_PG", "L", "400ATHN4KOTRA1", "MW", 15135, "WR1PGKOTRA_PG112"], [21, "KOTRA_PG", "L", "400ATHN4KOTRA1", "MX", 15135, "WR1PGKOTRA_PG112"], [8439, "KOTRA_PG", "L", "400ATHN4KOTRA1", "M3", 15134, "WR1PGKOTRA_PG012"], [2589, "KOTRA_PG", "L", "400KOTRASPGCL2", "VRM", 15126, "WR1PGKOTRA_PG109"], [2590, "KOTRA_PG", "L", "400KOTRASPGCL2", "VRA", 15126, "WR1PGKOTRA_PG109"], [2591, "KOTRA_PG", "L", "400KOTRASPGCL2", "VYM", 15126, "WR1PGKOTRA_PG109"], [2592, "KOTRA_PG", "L", "400KOTRASPGCL2", "VYA", 15126, "WR1PGKOTRA_PG109"], [2593, "KOTRA_PG", "L", "400KOTRASPGCL2", "VBM", 15126, "WR1PGKOTRA_PG109"], [2594, "KOTRA_PG", "L", "400KOTRASPGCL2", "VBA", 15126, "WR1PGKOTRA_PG109"], [2595, "KOTRA_PG", "L", "400KOTRASPGCL2", "VPM", 15126, "WR1PGKOTRA_PG109"], [2596, "KOTRA_PG", "L", "400KOTRASPGCL2", "VPA", 15126, "WR1PGKOTRA_PG109"], [2597, "KOTRA_PG", "L", "400KOTRASPGCL2", "HZ", 15126, "WR1PGKOTRA_PG109"], [2598, "KOTRA_PG", "L", "400KOTRASPGCL2", "DF", 15126, "WR1PGKOTRA_PG109"]];

export const getAppSettings = async (appDirectory: string): Promise<IPrefs> => {
    const settingsFilePath = join(appDirectory, appSettingsFilename);
    if (!existsSync(settingsFilePath)) {
        // create the file with default json
        const isSaved = await writeFileAsync(settingsFilePath, JSON.stringify(defaultPrefs));
        if (isSaved) {
            console.log(`Successfully saved appSettings to ${settingsFilePath}`);
        } else {
            console.log(`Could not save appSettings to ${settingsFilePath}`);
        }
    }
    const appSettingsObj = merge(defaultPrefs, JSON.parse((await readFileAsync(settingsFilePath)).toString()));
    return appSettingsObj;
}

export const initPrefsState = async (appDirectory: string) => {
    registerPrefsState(await getAppSettings(appDirectory));
};

export const setAppSettings = async (appDirectory: string, settings: IPrefs): Promise<boolean> => {
    const settingsFilePath = join(appDirectory, appSettingsFilename);
    const isSaved = await writeFileAsync(settingsFilePath, JSON.stringify(settings));
    if (isSaved) {
        //console.log(`Successfully saved appSettings to ${settingsFilePath}`);
        // todo explore if we can listen for changes in settings file  
        // and call initPrefs for updating prefs state instead of updating prefs here
        registerPrefsState(settings);
    } else {
        // console.log(`Could not save appSettings to ${settingsFilePath}`);
    }
    return isSaved;
}

export const getPmuMeasList = async (appDirectory: string): Promise<IPmuMeasItem[]> => {
    const pmuMeasListFilePath = join(appDirectory, pmuMeasListFilename);
    if (!existsSync(pmuMeasListFilePath)) {
        // create the file with default json
        const isSaved = await writeFileAsync(pmuMeasListFilePath, JSON.stringify(defaultPmuMeasList));
        if (isSaved) {
            console.log(`Successfully saved pmu meas list to ${pmuMeasListFilePath}`);
        } else {
            console.log(`Could not save pmu meas list to ${pmuMeasListFilePath}`);
        }
    }
    const pmuMeasListArr = JSON.parse((await readFileAsync(pmuMeasListFilePath)).toString());
    return pmuMeasListArr;
};

export const initPmuMeasListState = async (appDirectory: string) => {
    registerPmuMeasListState(await getPmuMeasList(appDirectory));
};

const setPmuMeasList = async (appDirectory: string, measList: IPmuMeasItem[]): Promise<boolean> => {
    const pmuMeasListFilePath = join(appDirectory, pmuMeasListFilename);
    const isSaved = await writeFileAsync(pmuMeasListFilePath, JSON.stringify(measList));
    if (isSaved) {
        console.log(`Successfully saved pmu meas list to ${pmuMeasListFilePath}`);
        // todo explore if we can listen for changes in meas list file  
        // and call initPmuMeasListState for updating meas list state instead of updating meas list here
        registerPmuMeasListState(measList);
    } else {
        console.log(`Could not save pmu meas list to ${pmuMeasListFilePath}`);
    }
    return isSaved;
};

export const refreshPmuMeasList = async (appDirectory: string): Promise<boolean> => {
    let fetcher = new PmuMeasFetcher();
    // set fetcher params from app settings
    const prefs = await getAppSettings(appDirectory);
    fetcher.hostname = prefs.pmu.soap.host;
    fetcher.port = prefs.pmu.soap.port;
    fetcher.path = prefs.pmu.soap.path;
    fetcher.username = prefs.pmu.soap.username;
    fetcher.password = prefs.pmu.soap.password;
    const measList: IPmuMeasItem[] = await fetcher.getMeasIds();
    const isSaved = await setPmuMeasList(appDirectory, measList);
    return isSaved;
}