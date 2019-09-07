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
    static defaultProps = {
        prefs: {
            pmu: {
                soap: {
                    host: 'host',
                    port: 123,
                    username: 'uname',
                    password: 'pass'
                }
            },
            wbes: {
                host: 'ced.wrldc.in'
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
        const settings = await getAppSettings(require('electron').remote.app.getAppPath());
        const newState: PrefEditorState = merge(this.state, { prefs: settings, mounted: true }) as PrefEditorState;
        this.setState({ ...newState });
    }

    onSetPrefs = (prefs: IPrefs) => {
        console.log(JSON.stringify(prefs));
        ipcRenderer.send(channels.setSettings, prefs);
        // change prefs in the json file by calling the main thread
        ipcRenderer.on(channels.setSettingsResp, async (event, isSaved: boolean) => {
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