import { LayoutItem } from './IApp';
import { Component } from 'react';

export interface IDashWidgetContentProps {
    discriminator: string,
    border: string
}

export interface IDashWidgetContentState {
}

export interface IDashWidgetContent extends Component<IDashWidgetContentProps, IDashWidgetContentState> {
    fetchAndSetPntData(): Promise<boolean>
}