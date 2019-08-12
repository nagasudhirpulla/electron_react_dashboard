import { LayoutItem } from "../IApp";
import { v4 as uuid } from 'uuid';
import { IDashWidgetContent, IDashWidgetContentState } from "../IDashWidgetContent";
import { TslpSeriesState } from './../ITimeSeriesLinePlot';

export interface IDashWidgetState {
    layout: LayoutItem,
    contentState: IDashWidgetContentState
}

export class DashWidgetState implements IDashWidgetState {
    contentState: IDashWidgetContentState;
    layout: LayoutItem = {
        x: 0, y: 0, w: 2, h: 2, i: uuid(), static: false
    }
}