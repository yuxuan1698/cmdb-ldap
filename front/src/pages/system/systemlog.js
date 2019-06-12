
'use strict'

import {PureComponent} from 'react'
import CMDBBreadcrumb from "../components/Breadcrumb";
import {Layout } from 'antd';

// import css from './index.less'

class CMDBSystemSetting extends PureComponent {
  constructor(props){
    super(props)
    // this.tabPosition
  }
  
  render(){
    return (
      <Layout >
        <CMDBBreadcrumb route={{breadcrumb_system_setting:"",breadcrumb_system_logs:'/user'}} title='breadcrumb_system_logs' />
      </Layout>
      )
  }
}

export default CMDBSystemSetting;