import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import * as channels from '../../channelNames';
import merge from 'deepmerge';
import { AdapterManifest } from './../def_manifest';

export interface AdaptersListItem {
    name: string,
    adapter_id: string
}

export interface AdaptersListProps {
    adapters: AdaptersListItem[]
}

export interface AdaptersListState extends AdaptersListProps {
    mounted: boolean
}

class AdaptersList extends Component<AdaptersListProps, AdaptersListState> {
    static defaultProps: AdaptersListProps = {
        adapters: []
    };

    state = {
        adapters: this.props.adapters,
        mounted: false
    };

    componentDidMount() {
        // this.setState({ mounted: true } as AdaptersListState);
        this.loadAdapters();
    }

    loadAdapters = async () => {
        ipcRenderer.send(channels.getAdaptersList, 'ping');
        ipcRenderer.once(channels.getAdaptersListResp, (event, obj: { adapters: AdapterManifest[] }) => {
            let adaptersList: AdaptersListItem[] = []
            for (let adInd = 0; adInd < obj.adapters.length; adInd++) {
                adaptersList.push({ 'name': obj.adapters[adInd].name, 'adapter_id': obj.adapters[adInd].app_id });
            }
            const newState: AdaptersListState = { adapters: [...obj.adapters.map(a => { return { 'name': a.name, 'adapter_id': a.app_id } })], mounted: true };
            this.setState({ ...newState });
        });
    }

    onAddAdapterClick = () => {
        ipcRenderer.send(channels.addDataAdapter, 'ping');
        ipcRenderer.once(channels.addDataAdapterResp, (event, obj: { newAdapter: AdapterManifest }) => {
            this.loadAdapters();
        });
    }

    onDelAdapterClick = async (adapterItem: AdaptersListItem) => {
        ipcRenderer.send(channels.deleteDataAdapter, adapterItem.adapter_id);
        ipcRenderer.once(channels.deleteDataAdapterResp, (event, obj: { isSuccess: boolean }) => {
            this.loadAdapters();
        });
    }

    onUpdAdapterClick = async (adapterItem: AdaptersListItem) => {
        ipcRenderer.send(channels.updateDataAdapter, adapterItem.adapter_id);
        ipcRenderer.once(channels.updateDataAdapterResp, (event, obj: { adapter: AdapterManifest }) => {
            if (obj.adapter == null) {
                alert(`Update of adapter with id = ${adapterItem.adapter_id}, name=${adapterItem.name} failed...`);
            } else {
                alert(`Update of adapter with id = ${adapterItem.adapter_id}, name=${adapterItem.name} is success!`);
            }
            this.loadAdapters();
        });
    }

    onConfigAdapterClick = async (adapterItem: AdaptersListItem) => {
        ipcRenderer.send(channels.openAdapterConfigWindow, adapterItem.adapter_id);
        ipcRenderer.once(channels.openAdapterConfigWindowResp, (event, resp: { err?: string }) => {
            if (resp.err != undefined) {
                alert(resp.err);
                return;
            }
        });
    }

    render() {
        let adapterComps = [];
        for (let ad_ind = 0; ad_ind < this.state.adapters.length; ad_ind++) {
            const adapterComp = (<tr>
                <td>{this.state.adapters[ad_ind].name}</td>
                <td>{this.state.adapters[ad_ind].adapter_id}</td>
                <td>
                    <button onClick={this.onDelAdapterClick.bind(this, this.state.adapters[ad_ind])}>Delete Adapter</button>
                    <button onClick={this.onUpdAdapterClick.bind(this, this.state.adapters[ad_ind])}>Update Adapter</button>
                    <button onClick={this.onConfigAdapterClick.bind(this, this.state.adapters[ad_ind])}>Configure Adapter</button>
                </td>
            </tr>);
            adapterComps.push(adapterComp);
        }

        return (
            <>
                <table>
                    <tr>
                        <td>Adapter Name</td>
                        <td>Adapter Id</td>
                        <td>Actions</td>
                    </tr>
                    {adapterComps}
                </table>
                <button onClick={this.onAddAdapterClick}>Add Adapter</button>
            </>
        );
    }
}
export default AdaptersList;