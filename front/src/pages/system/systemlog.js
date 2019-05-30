
'use strict'

import {PureComponent} from 'react'
import CMDBBreadcrumb from "../components/Breadcrumb";
import {Layout,Select,Tabs,Icon,Switch } from 'antd';
import CMDBLDAPSettingContent from "./components/ldapsetting"
import CMDBEmailSettingContent from "./components/emailsetting"
// import css from './index.less'
const { TabPane } = Tabs;
const { Option } = Select;

class CMDBSystemSetting extends PureComponent {
  constructor(props){
    super(props)
    // this.tabPosition
  }
  
  render(){
    return (
      <Layout >
        <CMDBBreadcrumb route={{'系统设置':"",'系统日志':'/system/systemlog'}} title='系统日志'  />
        
      </Layout>
      )
  }
}

export default CMDBSystemSetting;