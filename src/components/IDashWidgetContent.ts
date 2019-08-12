import { LayoutItem } from './IApp';
import { Component } from 'react';

export interface IDashWidgetContentProps {
}

export interface IDashWidgetContentState {
}

export interface IDashWidgetContent extends Component<IDashWidgetContentProps, IDashWidgetContentState> {
    fetchAndSetPntData(): boolean
}