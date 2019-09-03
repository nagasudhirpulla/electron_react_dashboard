import { existsSync } from 'fs';
import { join } from 'path';
import { initUtils } from './utils';
import { writeFileAsync, readFileAsync } from './utils/fileUtils'
import { PmuMeasFetcher } from './Fetchers/PmuMeasFetcher'

export const appSettingsFilename = "appSettings.json";
export const pmuMeasListFilename = "pmu_meas_list.json";
export const defaultAppSettings = {
    pmu: {
        soap: {
            host: 'hostname',
            port: 123,
            username: 'uname',
            password: 'pass'
        }
    },
    wbes: {
        utils: { ...initUtils }
    }
};
export const defaultPmuMeasList = [[2, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VRM", 15135, "WR1PGKOTRA_PG112"], [3, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VRA", 15135, "WR1PGKOTRA_PG112"], [4, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VYM", 15135, "WR1PGKOTRA_PG112"], [5, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VYA", 15135, "WR1PGKOTRA_PG112"], [6, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VBM", 15135, "WR1PGKOTRA_PG112"], [7, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VBA", 15135, "WR1PGKOTRA_PG112"], [8, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VPM", 15135, "WR1PGKOTRA_PG112"], [9, "KOTRA_PG", "L", "400ATHN4KOTRA1", "VPA", 15135, "WR1PGKOTRA_PG112"], [10, "KOTRA_PG", "L", "400ATHN4KOTRA1", "HZ", 15135, "WR1PGKOTRA_PG112"], [11, "KOTRA_PG", "L", "400ATHN4KOTRA1", "DF", 15135, "WR1PGKOTRA_PG112"], [12, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IRM", 15135, "WR1PGKOTRA_PG112"], [13, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IRA", 15135, "WR1PGKOTRA_PG112"], [14, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IYM", 15135, "WR1PGKOTRA_PG112"], [15, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IYA", 15135, "WR1PGKOTRA_PG112"], [16, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IBM", 15135, "WR1PGKOTRA_PG112"], [17, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IBA", 15135, "WR1PGKOTRA_PG112"], [18, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IPM", 15135, "WR1PGKOTRA_PG112"], [19, "KOTRA_PG", "L", "400ATHN4KOTRA1", "IPA", 15135, "WR1PGKOTRA_PG112"], [20, "KOTRA_PG", "L", "400ATHN4KOTRA1", "MW", 15135, "WR1PGKOTRA_PG112"], [21, "KOTRA_PG", "L", "400ATHN4KOTRA1", "MX", 15135, "WR1PGKOTRA_PG112"], [8439, "KOTRA_PG", "L", "400ATHN4KOTRA1", "M3", 15134, "WR1PGKOTRA_PG012"], [2589, "KOTRA_PG", "L", "400KOTRASPGCL2", "VRM", 15126, "WR1PGKOTRA_PG109"], [2590, "KOTRA_PG", "L", "400KOTRASPGCL2", "VRA", 15126, "WR1PGKOTRA_PG109"], [2591, "KOTRA_PG", "L", "400KOTRASPGCL2", "VYM", 15126, "WR1PGKOTRA_PG109"], [2592, "KOTRA_PG", "L", "400KOTRASPGCL2", "VYA", 15126, "WR1PGKOTRA_PG109"], [2593, "KOTRA_PG", "L", "400KOTRASPGCL2", "VBM", 15126, "WR1PGKOTRA_PG109"], [2594, "KOTRA_PG", "L", "400KOTRASPGCL2", "VBA", 15126, "WR1PGKOTRA_PG109"], [2595, "KOTRA_PG", "L", "400KOTRASPGCL2", "VPM", 15126, "WR1PGKOTRA_PG109"], [2596, "KOTRA_PG", "L", "400KOTRASPGCL2", "VPA", 15126, "WR1PGKOTRA_PG109"], [2597, "KOTRA_PG", "L", "400KOTRASPGCL2", "HZ", 15126, "WR1PGKOTRA_PG109"], [2598, "KOTRA_PG", "L", "400KOTRASPGCL2", "DF", 15126, "WR1PGKOTRA_PG109"]];

export const getAppSettingsJSON = async (appDirectory: string) => {
    const settingsFilePath = join(appDirectory, appSettingsFilename);
    if (!existsSync(settingsFilePath)) {
        // create the file with default json
        const isSaved = await writeFileAsync(settingsFilePath, JSON.stringify(defaultAppSettings));
        if (isSaved) {
            console.log(`Successfully saved appSettings to ${settingsFilePath}`);
        } else {
            console.log(`Could not save appSettings to ${settingsFilePath}`);
        }
    }
    const appSettingsObj = JSON.parse((await readFileAsync(settingsFilePath)).toString());
    return appSettingsObj;
}

export const getPmuMeasList = async (appDirectory: string): Promise<[number, string, string, string, string, number, string][]> => {
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

const setPmuMeasList = async (appDirectory: string, measList: [number, string, string, string, string, number, string][]): Promise<boolean> => {
    const pmuMeasListFilePath = join(appDirectory, pmuMeasListFilename);
    const isSaved = await writeFileAsync(pmuMeasListFilePath, JSON.stringify(measList));
    if (isSaved) {
        console.log(`Successfully saved pmu meas list to ${pmuMeasListFilePath}`);
    } else {
        console.log(`Could not save pmu meas list to ${pmuMeasListFilePath}`);
    }
    return isSaved;
};

export const refreshPmuMeasList = async (appDirectory: string): Promise<boolean> => {
    let fetcher = new PmuMeasFetcher();
    // todo set fetcher params from app settings
    const measList: [number, string, string, string, string, number, string][] = await fetcher.getMeasIds();
    const pmuMeasListFilePath = join(appDirectory, pmuMeasListFilename);
    const isSaved = await setPmuMeasList(pmuMeasListFilePath, measList);
    return isSaved;
}