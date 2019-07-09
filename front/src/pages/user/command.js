'use strict'

import {PureComponent} from 'react'
import {
  Layout,Tabs,Button
  } from 'antd';
import { connect } from 'dva';
// 国际化
import { formatMessage } from 'umi/locale'; 
import jsyaml from 'js-yaml'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/idea.css';

// import 'codemirror/addon/display/autorefresh';
// import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/yaml-lint';
// import 'codemirror/addon/lint/javascript-lint';
// 自动关闭tag
// import 'codemirror/addon/edit/closebrackets';
// 快捷键
import 'codemirror/keymap/sublime';
// 模式
import 'codemirror/mode/yaml/yaml';
// import 'codemirror/mode/javascript/javascript';
// 允许注释
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/comment/continuecomment';
// 活动行，颜色显示
import 'codemirror/addon/selection/active-line';
// 查找
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/dialog/dialog';
// 全屏
import 'codemirror/addon/display/fullscreen';

// import 'codemirror/mode/sql/sql';
// 显示联想
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/anyword-hint.js';



import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/brace-fold';

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
  componentWillMount=()=>{
    window.jsyaml=jsyaml
  }
  // componentDidMount(){
  //   this.codeEditor = this.refs['CodeMirror'].getCodeMirror();
  // }
  codeMirrorOnChange=(editor, data, value)=>{
    // if (data.origin == "+input"){
    //   var text = data.text;
    //   editor.showHint()
    //   // if (data.origin !== 'complete' && /\w|\./g.test(data.text[0])) {
    //   // }
    // }
  }
  autoComplete = cm => {
    console.log(this.codeMirrorref)
    const codeMirror = this.codeMirrorref.getCodeMirrorInstance();
    
    // hint options for specific plugin & general show-hint
    // 'tables' is sql-hint specific
    // 'disableKeywords' is also sql-hint specific, and undocumented but referenced in sql-hint plugin
    // Other general hint config, like 'completeSingle' and 'completeOnSingleClick' 
    // should be specified here and will be honored
    const hintOptions = {
      tables: {
        table_name: ['column1', 'column2', 'column3', 'etc'],
        another_table: ['columnA', 'columnB']
      }, 
      disableKeywords: true,
      completeSingle: false,
      completeOnSingleClick: false
    };
    codeMirror.showHint(cm, codeMirror.hint.yaml, hintOptions); 
  }
  render(){
    let source = {
       app: ["name", "score", "birthDate"],
       version: ["name", "score", "birthDate"],
       dbos: ["name", "population", "size"]
     };
    let {value,panes,activeKey} =this.state
    let options={
      mode: 'yaml',
      theme: "idea",
      keyMap: 'sublime',
      lineWrapping:true,
      lineNumbers: true,
      autofocus:true,
      styleActiveLine:true,
      foldGutter: true,
      // autoCloseBrackets:true,
      highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
      lint: true,
      matchBrackets:true,
      gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      extraKeys:{
        "F12": (cm)=> {
          cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        "Esc": (cm)=> {
          if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        },
        "Tab": this.autoComplete
      },
    }
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
                // onEdit={this.onEdit}
              >
                {panes.map(pane => (
                  <TabPane className={usercss.panepadding} tab={pane.title} key={pane.key}>
                  <CodeMirror
                    ref={ref=>this.codeMirrorref=ref}
                    className={usercss.codemirror2}
                    value={value}
                    options={options}
                    onChange={this.codeMirrorOnChange}
                  />
                  <div style={{padding:10,display:"flex",flexDirection:"row"}}>
                    <div style={{flex:"auto"}}>1</div>
                    <div>
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