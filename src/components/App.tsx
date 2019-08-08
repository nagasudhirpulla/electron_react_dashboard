import React, { Component } from 'react';
import './App.css';
interface MyProps {}
interface MyState {}

class App extends Component<MyProps, MyState> {
  render() {
    return (
      <div>
        <p>This is the App Component</p>
      </div>
    );
  }
}

export default App;