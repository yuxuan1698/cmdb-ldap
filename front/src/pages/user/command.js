'use strict'

import {PureComponent} from 'react'
import {
  Layout,Tabs,Button,Select,Icon
  } from 'antd';
import { connect } from 'dva';
// 国际化
import { formatMessage } from 'umi/locale'; 
import jsyaml from 'js-yaml'
import {UnControlled as CodeMirrorComponent} from 'react-codemirror2'
import * as CodeMirror from 'codemirror';
import ldaplint from 'ldaplint'
import themesvg from 'svgicon/theme.svg'
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/theme/eclipse.css';


import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/yaml-lint';
// import 'codemirror/addon/lint/javascript-lint';
// 自动关闭tag
import 'codemirror/addon/edit/closebrackets';
// 快捷键
import 'codemirror/keymap/sublime';
// 模式
import 'codemirror/mode/yaml/yaml';
import 'codemirror/addon/mode/overlay';
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

// 显示联想
import 'codemirror/addon/hint/show-hint';
// import 'codemirror/addon/hint/anyword-hint.js';

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
const { Option } = Select;

@connect(({ ldap, loading }) => ({ classObjects:ldap.classObjects, loading }))
class CMDBChangePassword extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      value:`# !DATE ${new Date().toLocaleString()}
# !CMDB LDAP 脚本 ldif
`,
      activeKey:"ldif1",
      panes:[{title:"ldif1",key:"ldif1"}],
      hintField:[],
      hintType:["add","delete","modify","moddn"],
      hintObjects:[],
      addPaneIndex: 1,
      theme:"eclipse"
    }
  }
  initHintStatus=(data)=>{
    let classObjects=data||this.props.classObjects
    let hints={
      hintObjects:Object.keys(classObjects)
    }
    let tmpField=["dn","ou","changetype","replace","newrdn","deleteoldrdn","newsuperior","add","delete","modify","moddn"]
    Object.values(classObjects).map(i=>{
      i.map(s=>Object.values(s).map(k=>tmpField=tmpField.concat(k)))
    })
    hints['hintField']=Array.from(new Set(tmpField))
    this.setState(hints)
  }
  onChange = activeKey => {
    this.setState({ activeKey });
  };
  handleOnAddOrDelTag=(targetKey, action)=>{
    let {panes,addPaneIndex}=this.state
    switch(action){
      case "remove":
        if(panes.length>1){
          let newpanes=panes.filter(i=>i.key!==targetKey)
          this.setState({panes: newpanes,activeKey:newpanes[0].key})
        }
        break;
      case "add":
        panes.push({key:`ldif_console_${addPaneIndex}`,title: `ldif${addPaneIndex}`})
        this.setState({
          panes,
          addPaneIndex:addPaneIndex+1
        })
        break;
    }
  }
  handleGetObjectClass=()=>{
    let {dispatch,classObjects}=this.props
    let {hintField,hintObjects}=this.state
    if(Object.keys(classObjects).length=== 0){
      dispatch({type:'ldap/getLDAPObjectClassList',callback:(data)=>{
        return this.initHintStatus(data)
      }})
    }
    if(hintField.length===0 || hintObjects.length===0){
      return this.initHintStatus(classObjects)
    }
  }
  componentWillMount=()=>{
    window.jsyaml=jsyaml
    this.handleGetObjectClass()
    CodeMirror.registerHelper('hint', 'ldapHint', (editor)=> {
      let cur = editor.getCursor();
      let curLine = editor.getLine(cur.line);
      let start = cur.ch;
      let end = start;
      let {hintField,hintObjects,hintType}=this.state
      while (end < curLine.length && /[\w$]/.test(curLine.charAt(end))) ++end;
      while (start && /[\w$]/.test(curLine.charAt(start - 1))) --start;
      let curWord = curLine.slice(start, end).toLowerCase();
      let list=hintField.filter(i=>i.toLowerCase().indexOf(curWord)>=0)
      if(/^\s*objectClass/.test(curLine)){
        list=hintObjects.filter(i=>i.toLowerCase().indexOf(curWord)>=0)
      }else if(/^\s*changetype/.test(curLine)){
        list=hintType.filter(i=>i.toLowerCase().indexOf(curWord)>=0)
      }
      return {
        list,
        from: CodeMirror.Pos(cur.line, start), 
        to: CodeMirror.Pos(cur.line, end)
      };
    });
  }
  codeMirrorOnChange=(editor, data)=>{
    if (data.origin == "+input"){
      CodeMirror.showHint(editor, CodeMirror.hint.ldapHint); 
    }
  }
  handleChangeCodeTheme=(theme)=>{
    require(`codemirror/theme/${theme}.css`)
    this.setState({theme})
  }
  render(){
    let {value,panes,activeKey,theme} =this.state
    let options={
      mode: 'ldap',
      theme: theme,
      keyMap: 'sublime',
      autofocus:true,
      lineWrapping:true,
      lineNumbers: true,
      autofocus:true,
      styleActiveLine:true,
      foldGutter: true,
      autoCloseBrackets:true,
      continueComments: true,
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
                tabBarStyle={{height:30}}
                tabBarExtraContent={
                  <span style={{float:"left",marginTop:"-2px",marginRight:10}}>
                    <span style={{marginRight:5}}><Icon component={themesvg} />切换主题</span>
                    <Select size="small"
                      style={{width:120}}
                      onChange={this.handleChangeCodeTheme} 
                      defaultValue={theme}>
                      <Option value="eclipse">eclipse</Option>
                      <Option value = "ambiance" > ambiance </Option>
                      <Option value = "blackboard" > blackboard </Option>
                      <Option value = "cobalt" > cobalt </Option>
                      <Option value = "eclipse" > eclipse </Option>
                      <Option value = "elegant" > elegant </Option>
                      <Option value = "erlang-dark" > erlang - dark </Option>
                      <Option value = "lesser-dark" > lesser - dark </Option>
                      <Option value = "monokai" > monokai </Option>
                      <Option value = "neat" > neat </Option>
                      <Option value = "night" > night </Option>
                      <Option value = "rubyblue" > rubyblue </Option>
                      <Option value = "twilight" > twilight </Option>
                      <Option value = "vibrant-ink" > vibrant - ink </Option>
                      <Option value = "xq-dark" > xq - dark </Option>
                      <Option value="idea">idea</Option>
                    </Select>
                  </span>
                }
                onChange={this.onChange}
                activeKey={activeKey}
                type="editable-card"
                style={{display:"flex",flexDirection:"column",flex:"auto"}}
                onEdit={this.handleOnAddOrDelTag}
              >
                {panes.map(pane => (
                  <TabPane className={usercss.panepadding} tab={pane.title} key={pane.key}>
                  <CodeMirrorComponent
                    defineMode={{name: 'ldap',fn: ldaplint }}
                    className={usercss.codemirror2}
                    value={value}
                    options={options}
                    onChange={this.codeMirrorOnChange}
                  />
                  <div style={{padding:10}}>
                    <div style={{float:"right"}}>
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