'use strict'

import {PureComponent} from 'react'
import '../../../node_modules/react-resizable/css/styles.css';
import React from 'react';
import { Resizable, ResizableBox } from 'react-resizable';
class CMDBUserCenter extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      width: 200,
      height: 200
    }
  }
  onResize = (event, { element, size }) => {
    this.setState({ width: size.width });
  };
  render() {
    return (
      <div>
          <Resizable className="box"  axis="x"  minConstraints={[200,200]} width={this.state.width} onResize={this.onResize}>
            <div className="box" style={{ width: this.state.width + 'px', height: this.state.height + 'px' }}>
              <span className="text">{"Raw use of <Resizable> element. 200x200, no constraints."}</span>
            </div>
          </Resizable>
      </div>
    )
  }
}

export default CMDBUserCenter;