import { Component } from 'react';
import {
  Layout
} from 'antd'
import CMDBHeader from './Header';
const {Content} =Layout
class CMDBContent extends Component {
  render(){
    let {children}=this.props
    return (
        <Layout>
            <CMDBHeader />
            <Content>
                {children}
            </Content>
        </Layout>
      )
  }
  }
export default CMDBContent