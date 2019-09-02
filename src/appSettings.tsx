import { existsSync } from 'fs';
import { join } from 'path';
import { initUtils } from './utils';
import { writeFileAsync, readFileAsync } from './utils/fileUtils'

export const appSettingsFilename = "appSettings.json";
export const defaultAppSettings = {
    pmu: {
        soap: {
            host: 'hostname',
            port: 123,
            username: 'uname',
            password: 'pass'
        },
        measList: []
    },
    wbes: {
        utils: { ...initUtils }
    }
};

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

