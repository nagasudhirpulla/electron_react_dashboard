import React, { Component } from 'react';
import './App.css';
import './rgl_styles.css';
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { AppProps, AppState, LayoutItem } from "./IApp";
import { v4 as uuid } from 'uuid';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class App extends React.Component<AppProps, AppState> {
  static defaultProps = {
    className: "layout",
    rowHeight: 200,
    onLayoutChange: function () { },
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    initialLayout: generateLayout()
  };

  state = {
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    layouts: { lg: this.props.initialLayout }
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

  onLayoutChange = (layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
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
    return this.state.layouts.lg.map((l: LayoutItem, i) => {
      return (
        <div key={l.i} className={l.static ? "static" : ""}>
          <div className="dragHandle">
            <span
              className="removeBtn"
              onClick={this.onRemoveItem.bind(this, i)}
            >x</span>
          </div>
          <div className="cellContent">
            <div style={{ marginTop: "20px", textAlign: 'center' }}>{l.i}</div>
          </div>
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

function generateLayout(): LayoutItem[] {
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