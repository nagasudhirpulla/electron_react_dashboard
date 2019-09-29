export interface AdapterManifest{
    "entry": string,
    "name": string,
    "app_id": string,
    "out_types": string[],
    "single_meas": boolean,
    "multi_meas": boolean,
    "quality_option": boolean,
    "is_meas_picker_present": boolean,
    "is_adapter_config_ui_present": boolean
}

export const defManifest = {
    "entry": "app.exe",
    "name": "CustomData",
    "app_id": "app_id",
    "out_types": [
        "timeseries"
    ],
    "single_meas": true,
    "multi_meas": true,
    "quality_option": true,
    "is_meas_picker_present": true,
    "is_adapter_config_ui_present": true
};