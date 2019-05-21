'use strict'

import {PureComponent} from 'react'
import CMDBBreadcrumb from "../components/Breadcrumb";
import {Layout } from 'antd';
// import css from './index.less'
class CMDBSystemSetting extends PureComponent {
  constructor(props){
    super(props)
  }
  
  render(){
    return (
      <Layout >
        <CMDBBreadcrumb route={{'系统设置':"",'基本设置':'/system/setting'}} title='系统基本设置'  />
      </Layout>
      )
  }
}

export default CMDBSystemSetting;