import React, { Component } from 'react';
import { IPrefs } from '../../appSettings'
import { ipcRenderer } from 'electron';
import * as channels from '../../channelNames';
import { FormikPrefsEditForm } from './PrefsEditForm'
import { getAppSettings } from '../../appSettings';


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
                host: 'scheduling.wrldc.in'
            }
        }
    };

    state = {
        prefs: this.props.prefs,
        mounted: false
    };

    async componentDidMount() {
        this.setState({ mounted: true } as PrefEditorState);

        const settings = await getAppSettings(require('electron').remote.app.getAppPath());
        // ipcRenderer.send(channels.getSettings, 'ping');
        // ipcRenderer.on(channels.getSettingsResp, async (event, settings: IPrefs) => {
        //     // console.log(`App settings fetched at startup = ${JSON.stringify(settings)}`) // prints "pong"
        //     this.setState({ prefs: settings } as PrefEditorState);
        // });
        this.setState({ prefs: settings } as PrefEditorState);
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
                <FormikPrefsEditForm {...{ prefs: this.state.prefs, onFormSubmit: this.onSetPrefs }} />
            </>
        );
    }
}
export default PreferencesEditor;