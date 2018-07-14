import React, { Component } from 'react';
import Flowchart from '../../components/Flowchart/index';

const style = ({
  border: '1px solid black',
  height: '97vh',
  overflow: 'hidden'
});

class App extends Component {
  render() {
    return (
      <div style={style}>
        <Flowchart ui={{}} scene={{}}/>
      </div>
    );
  }
}

export default App;
