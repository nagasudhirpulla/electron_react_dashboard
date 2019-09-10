import React, { Component } from 'react';
import { IPrefs } from '../../appSettings'
import { ipcRenderer } from 'electron';
import * as channels from '../../channelNames';
import { FormikPrefsEditForm } from './PrefsEditForm'
import { getAppSettings } from '../../appSettings';
import merge from 'deepmerge';

export interface PrefEditorProps {
    prefs: IPrefs
}

export interface PrefEditorState extends PrefEditorProps {
    mounted: boolean
}

class PreferencesEditor extends Component<PrefEditorProps, PrefEditorState> {
    static defaultProps: PrefEditorProps = {
        prefs: {
            pmu: {
                soap: {
                    host: 'hostname',
                    port: 123,
                    path: '/etera/xyz',
                    username: 'uname',
                    password: 'pass',
                    refMeasId: 2127
                },
                api: {
                    host: "172.16.184.35",
                    port: 50100,
                    path: "/api/meas_data",
                }
            },
            wbes: {
                host: 'scheduling.wrldc.in'
            },
            scada: {
                api: {
                    host: "localhost",
                    port: 62448,
                    path: "",
                }
            }
        }
    };

    state = {
        prefs: this.props.prefs,
        mounted: false
    };

    componentDidMount() {
        // this.setState({ mounted: true } as PrefEditorState);
        this.loadSettings();
    }

    async loadSettings() {
        // const settings = await getAppSettings(require('electron').remote.app.getAppPath());
        // const newState: PrefEditorState = merge(this.state, { prefs: settings, mounted: true }) as PrefEditorState;
        // this.setState({ ...newState });
        ipcRenderer.send(channels.getSettings, 'ping');
        ipcRenderer.on(channels.getSettingsResp, (event, prefs: IPrefs) => {
            const newState: PrefEditorState = merge(this.state, { prefs: { ...prefs }, mounted: true }) as PrefEditorState;
            this.setState({ ...newState });
        });
    }

    onSetPrefs = (prefs: IPrefs) => {
        // console.log(JSON.stringify(prefs));
        ipcRenderer.send(channels.setSettings, prefs);
        // change prefs in the json file by calling the main thread
        ipcRenderer.on(channels.setSettingsResp, (event, isSaved: boolean) => {
            if (isSaved) {
                alert("Successfully saved user preferences!");
            } else {
                alert("Unable to update user preferences...");
            }
        });
    }

    render() {
        return (
            <>
                {this.state.mounted &&
                    <FormikPrefsEditForm {...{ prefs: this.state.prefs, onFormSubmit: this.onSetPrefs }} />
                }
            </>
        );
    }
}
export default PreferencesEditor;