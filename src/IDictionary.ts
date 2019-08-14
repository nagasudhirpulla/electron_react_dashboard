import { LayoutItem, Layout } from "./components/IApp";

export interface IDictionary<TValue> {
    [id: string]: TValue;
}

export interface ILayoutItemDict extends IDictionary<LayoutItem> {

}

export interface ILayoutDict extends IDictionary<Layout> {

}

