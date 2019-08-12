import React, { Component } from 'react';
import './App.css';
import './rgl_styles.css';
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { AppProps, AppState, LayoutItem, Layout } from "./IApp";
import { v4 as uuid } from 'uuid';
import { IDashWidgetProps, DashWidgetProps } from './dash_widget/IDashWidgetState';
import { IDashWidgetContentProps } from './IDashWidgetContent';
import { ITslpProps, ITslpSeriesProps, IDisplayTimeShift, DisplayTimeShift, TslpProps } from './ITimeSeriesLinePlot';
import { DummyMeasurement } from './../measurements/DummyMeasurement';
import { VarTime } from './../variable_time/VariableTime';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class App extends React.Component<AppProps, AppState> {
  static defaultProps = {
    className: "layout",
    rowHeight: 200,
    onLayoutChange: function (currLayout: Layout, allLayouts) { },
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    initialLayout: generateLayout(),
    widgetStates: generateWidgetStates()
  };

  state = {
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    layouts: { lg: this.props.initialLayout },
    widgetStates: this.props.widgetStates
  };

  componentDidMount() {
    this.setState({ mounted: true } as AppState);
  }

  onBreakpointChange = (breakpoint: string) => {
    this.setState({ currentBreakpoint: breakpoint } as AppState);
  };

  onCompactTypeChange = () => {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical" ? null : "horizontal";
    this.setState({ compactType } as AppState);
  };

  onLayoutChange = (layout: Layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
    this.setState({ layouts: layouts } as AppState);
  };

  onNewLayout = () => {
    this.setState({ layouts: { lg: generateLayout() } } as AppState);
  };

  onAddItem = () => {
    this.setState({
      layouts: {
        lg: [...this.state.layouts.lg, {
          i: uuid(),
          x: 0,
          y: Infinity, // puts it at the bottom
          w: 2,
          h: 2,
          static: false
        }]
      }
    } as AppState);
  };

  onRemoveItem = (ind: number) => {
    this.setState({
      layouts: {
        lg: [...this.state.layouts.lg.slice(0, ind), ...this.state.layouts.lg.slice(ind + 1)]
      }
    } as AppState);
  }

  generateDOM = () => {
    // return this.state.layouts.lg.map((l: LayoutItem, i) => {
    //   return (
    //     <div key={l.i} className={l.static ? "static" : ""}>
    //       <div className="dragHandle">
    //         <div style={{ textAlign: 'center' }}>{l.i}</div>
    //         <span
    //           className="removeBtn"
    //           onClick={this.onRemoveItem.bind(this, i)}
    //         >x</span>
    //       </div>
    //       <div className="cellContent">
    //       </div>
    //     </div>
    //   );
    // });
    return this.state.widgetStates.map((ws: IDashWidgetProps, i) => {
      let l: LayoutItem = ws.layout;
      let content = (<div className="cellContent"></div>);
      if (ws.contentProps instanceof TslpProps) {

      }
      return (
        <div key={l.i} className={l.static ? "static" : ""}>
          <div className="dragHandle">
            <div style={{ textAlign: 'center' }}>{l.i}</div>
            <span
              className="removeBtn"
              onClick={this.onRemoveItem.bind(this, i)}
            >x</span>
          </div>
          {content}
        </div>
      );
    });
  };

  render() {
    return (
      <div>
        <div>
          Current Breakpoint: {this.state.currentBreakpoint} ({
            this.props.cols[this.state.currentBreakpoint]
          }{" "}
          columns)
        </div>
        <div>
          Compaction type:{" "}
          {_.capitalize(this.state.compactType) || "No Compaction"}
        </div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>
          Change Compaction Type
        </button>
        <button onClick={this.onAddItem}>Add Widget</button>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
          draggableHandle='.dragHandle'
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

export default App;

function generateLayout(): Layout {
  return [0, 1, 2, 3].map(function (i, ind) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (ind * 2) % 12,
      y: Math.floor(ind / 6),
      w: 2,
      h: 2,
      i: uuid(),
      static: false
    };
  });
}

function generateWidgetStates(): IDashWidgetProps[] {
  return [0, 1, 2, 3].map(function (i, ind) {
    let title: string = uuid()
    let fromVarTime = new VarTime()
    fromVarTime.offsetHrs = -2;

    let seriesProps: ITslpSeriesProps = {
      color: "yellow",
      meas: new DummyMeasurement(),
      fromVarTime: fromVarTime,
      toVarTime: new VarTime(),
      displayTimeShift: new DisplayTimeShift()
    }
    let contentProps: ITslpProps = { series: [seriesProps], title: title };

    let widgetProps = {
      layout: {
        x: (ind * 2) % 12,
        y: Math.floor(ind / 6),
        w: 2,
        h: 2,
        i: title,
        static: false
      },
      contentProps: contentProps
    };

    return widgetProps;
  });
}