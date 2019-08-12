import { LayoutItem } from "../IApp";
import { v4 as uuid } from 'uuid';
import { IDashWidgetContentState } from "../IDashWidgetContent";
import { IDashWidgetContentProps } from './../IDashWidgetContent';

export interface IDashWidgetProps {
    layout: LayoutItem,
    contentProps: IDashWidgetContentProps
}

export class DashWidgetProps implements IDashWidgetProps {
    contentProps: IDashWidgetContentProps;
    layout: LayoutItem = {
        x: 0, y: 0, w: 2, h: 2, i: uuid(), static: false
    }
}