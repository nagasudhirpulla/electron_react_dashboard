import { IPrefs } from "./appSettings";

let app_state: { [key: string]: {} } = {};

export const registerAppState = (key: string, obj: {}) => {
    if (!['number', 'string'].includes(typeof key)) {
        return;
    }
    app_state[key] = obj;
}

export const getAppState = (key: string) => {
    if (!['number', 'string'].includes(typeof key)) {
        return null;
    }
    return app_state[key];
}

export const registerPrefsState = (obj: IPrefs) => {
    registerAppState("prefs", obj);
};

export const getPrefsState = (): IPrefs => {
    return getAppState("prefs") as IPrefs;
};