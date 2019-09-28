import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import * as channels from '../../channelNames';
import merge from 'deepmerge';

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

    async loadAdapters() {
        ipcRenderer.send(channels.getAdaptersList, 'ping');
        ipcRenderer.on(channels.getAdaptersListResp, (event, adapters: AdaptersListItem[]) => {
            const newState: AdaptersListState = merge(this.state, { adapters: [...adapters], mounted: true });
            this.setState({ ...newState });
        });
    }    

    render() {
        return (
            <>
            </>
        );
    }
}
export default AdaptersList;