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
        <CMDBBreadcrumb route={{'系统设置':"",'基本设置':'/system/setting'}} title='系统基本设置'  />
        <Tabs  
          // renderTabBar={<div><Icon type="setting" theme="filled" />基本设置</div>}
          tabBarStyle={{width:130,backgroundColor: "#f1f1f1",padding:"15px 0 0 0px"}} 
          tabPosition="left" 
          style={{height:"100%",marginTop:10,padding:10,boxShadow:"#dcd8d8 0px 0px 3px",backgroundColor:"#fff"}}>
          <TabPane tab={<div><Icon type="setting" theme="filled" />基本设置</div>} key="1">
            Content of Tab 1
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