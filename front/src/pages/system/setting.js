'use strict'

import {PureComponent} from 'react'
import CMDBBreadcrumb from "../components/Breadcrumb";
import {Layout,Tabs,Icon } from 'antd';
import CMDBLDAPSettingContent from "./components/ldapsetting"
import CMDBEmailSettingContent from "./components/emailsetting"
import CMDBBaseSettingContent from "./components/basesetting"
// import css from './index.less'
const { TabPane } = Tabs;

class CMDBSystemSetting extends PureComponent {
  constructor(props){
    super(props)
    this.state={}
    // this.tabPosition
  }
  
  render(){
    return (
      <Layout >
        <CMDBBreadcrumb route={{breadcrumb_system_setting:"",breadcrumb_system_basesetting:'/system/setting'}} title='breadcrumb_system_basesetting' />
        <Tabs  
          tabPosition="top" 
          style={{height:"100%",marginTop:10,padding:15,boxShadow:"#dcd8d8 0px 0px 3px",backgroundColor:"#fff"}}
          >
          <TabPane tab={<div><Icon type="setting" theme="filled" />基本设置</div>} key="1">
            <CMDBBaseSettingContent />
          </TabPane>
          <TabPane tab={<div><Icon type="idcard" theme="filled" />LDAP设置</div>} key="2">
            <CMDBLDAPSettingContent />
          </TabPane>
          <TabPane tab={<div><Icon type="mail" theme="filled" />邮件设置</div>}  key="3">
            <CMDBEmailSettingContent />
          </TabPane>
          <TabPane tab={<div><Icon type="dingtalk-circle" theme="filled" />钉钉设置</div>}  key="4">
            Content of Tab 3
          </TabPane>
          <TabPane tab={<div><Icon type="control" theme="filled"/>扩展设置</div>} key="5">
            Content of Tab 4
          </TabPane>
        </Tabs>
      </Layout>
      )
  }
}

export default CMDBSystemSetting;