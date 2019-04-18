import { Component } from 'react';
import {
  Layout
} from 'antd';
import CMDBLanguage from './Language';
const {Header} =Layout;

class CMDBHeader extends Component {
  render(){
    // let {children}=this.props
    return (
        <Header>
          <div style={{float:"right",marginRight:10}}>
          <CMDBLanguage />
          </div>
        </Header>
        
      )
  }
  }
export default CMDBHeader