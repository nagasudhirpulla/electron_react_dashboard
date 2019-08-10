export interface LayoutItem {
    x: number,
    y: number,
    w: number,
    h: number,
    i: string,
    static: boolean
}

export interface AppProps {
    className: string,
    rowHeight: number,
    onLayoutChange: (a1: any, a2: any) => {},
    cols: { lg: number, md: number, sm: number, xs: number, xxs: number },
    initialLayout: LayoutItem[]
}

export interface AppState {
    currentBreakpoint: string,
    compactType: string,
    mounted: boolean,
    layouts: { lg: LayoutItem[] }
}