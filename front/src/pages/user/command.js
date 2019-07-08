'use strict'

import {PureComponent} from 'react'
import {
  Layout,Tabs,Button
  } from 'antd';
import { connect } from 'dva';
// 国际化
import { formatMessage } from 'umi/locale'; 
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/theme/material.css';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/keymap/sublime';

import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';

import 'codemirror/theme/mbo.css';
import 'codemirror/theme/mbo.css';
import CMDBBreadcrumb from "../components/Breadcrumb";
import usercss from "./user.less";

const {
  Content
} = Layout;
const { 
  TabPane 
} = Tabs;

@connect(({ login, loading }) => ({ login, loading }))

class CMDBChangePassword extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      value:"# <h1>Ldap Ldif</h1>",
      activeKey:"test1",
      panes:[{title:"test1",key:"test1"},{title:"test2",key:"test2"}]
    }
  }
  onChange = activeKey => {
    this.setState({ activeKey });
  };

  render(){
    let source = {
       app: ["name", "score", "birthDate"],
       version: ["name", "score", "birthDate"],
       dbos: ["name", "population", "size"]
     };
    let {value,panes,activeKey} =this.state
    console.log(CodeMirror.modes)
    return (
      <Layout className={usercss.userbody}>
        <CMDBBreadcrumb route={{'menu.side.users.ldap':"","menu.side.users.ldap.ldif":'/user/command'}} 
            title='menu.side.users.ldap.ldifscript' />
        <Layout style={{margin:"10px 0 0 0"}}>
          <Content className={usercss.ldap_command_content}>
            <Tabs animated
                tabBarGutter={2}
                onChange={this.onChange}
                activeKey={activeKey}
                type="editable-card"
                style={{display:"flex",flexDirection:"column",flex:"auto"}}
                size="small"
                // onEdit={this.onEdit}
              >
                {panes.map(pane => (
                  <TabPane className={usercss.panepadding} tab={pane.title} key={pane.key}>
                  <CodeMirror
                    className={usercss.codemirror2}
                    value={value}
                    options={{
                      mode: 'yaml',
                      theme: "mbo",
                      keyMap: 'sublime',
                      // styleActiveLine: true,
                      lineNumbers: true,
                      hintOptions: {
                        tables: source
                      }
                    }}
                    
                    onChange={(editor, data, value) => {
                    }}
                  />
                  <div style={{width:180,padding:10,display:"flex",flexDirection:"column"}}>
                    <div style={{flex:"auto"}}>1</div>
                    <div style={{height:60,bottom:10}}>
                      <Button block > 执行脚本文件 </Button>

                    </div>
                  </div>
                  </TabPane>
                ))}
              </Tabs>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default CMDBChangePassword;