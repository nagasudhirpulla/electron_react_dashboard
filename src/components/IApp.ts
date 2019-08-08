export interface LayoutProps {
    x: number,
    y: number,
    w: number,
    h: number,
    i: string,
    static: boolean
}

export interface MyProps {
    className: "layout",
    rowHeight: number,
    onLayoutChange: (a1: any, a2: any) => {},
    cols: { lg: number, md: number, sm: number, xs: number, xxs: number },
    initialLayout: () => LayoutProps[]
}

export interface MyState {
    currentBreakpoint: string,
    compactType: string,
    mounted: boolean,
    layouts: { lg: () => LayoutProps[] }
}