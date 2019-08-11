export interface LayoutItem {
    x: number,
    y: number,
    w: number,
    h: number,
    i: string,
    static: boolean
}

export interface Layout extends Array<LayoutItem>{}

export interface AppProps {
    className: string,
    rowHeight: number,
    onLayoutChange: (currLayout: Layout, allLayouts: any) => {},
    cols: { lg: number, md: number, sm: number, xs: number, xxs: number },
    initialLayout: Layout
}

export interface AppState {
    currentBreakpoint: string,
    compactType: string,
    mounted: boolean,
    layouts: { lg: Layout }
}