import { LayoutItem } from "../IApp";
import { v4 as uuid } from 'uuid';
import { IDashWidgetContentState } from "../IDashWidgetContent";
import { IDashWidgetContentProps } from './../IDashWidgetContent';
import { ILayoutItemDict } from "../../IDictionary";

export interface IDashWidgetProps {
    layouts: ILayoutItemDict,
    contentProps: IDashWidgetContentProps
}

export class DashWidgetProps implements IDashWidgetProps {
    contentProps: IDashWidgetContentProps;
    layouts: ILayoutItemDict = {
        lg: {
            x: 0, y: 0, w: 2, h: 2, i: uuid(), static: false
        }
    }
}