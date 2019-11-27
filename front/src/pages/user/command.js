'use strict'

import {PureComponent} from 'react'
import {
  Layout,Tabs,Button,Select,Icon,message
  } from 'antd';
import { connect } from 'dva';
import { Store } from "cmdbstore";
import { ContextMenuTrigger, ContextMenu,MenuItem } from 'react-contextmenu';
// 国际化
import { formatMessage } from 'umi/locale'; 
import jsyaml from 'js-yaml'
import {UnControlled as CodeMirrorComponent} from 'react-codemirror2'
import {Base64} from 'js-base64'
import copy from 'copy-to-clipboard';
import * as CodeMirror from 'codemirror';
import ldaplint from 'ldaplint'
import themesvg from 'svgicon/theme.svg'
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/fold/foldgutter.css';

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

// import 'codemirror/addon/fold/foldcode';
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
const themeAll=["ambiance","blackboard",
        "cobalt","eclipse","elegant","erlang-dark",
        "lesser-dark","monokai","neat","night" ,
        "rubyblue","twilight","vibrant-ink",
        "xq-dark","idea"
      ]
const defaultValue=`# !DATE ${new Date().toLocaleString()}
# !CMDB LDAP 脚本 ldif
`
@connect(({ ldap,users, loading }) => ({ userlist:users.userlist,classObjects:ldap.classObjects, loading }))
class CMDBCommand extends PureComponent {
  constructor(props){
    super(props)
    const initTheme= Store.getLocal('ldap_theme') ||"eclipse"
    this.state={
      values:{ldif0:defaultValue},
      activeKey:"ldif0",
      panes:[{title:"ldif0",key:"ldif0"}],
      hintField:[],
      hintType:["add","delete","modify","moddn"],
      hintObjects:[],
      addPaneIndex: 1,
      theme:initTheme,
      fullScreen: false,
      rightMenuControl: {
        copy: false,
        cut: false,
        paste: false,
        encode: false,
        decode: false
      },
      curCm: {},
      curLinePos:"",
      selectWord:""
    }
    require(`codemirror/theme/${initTheme}.css`)
  }
  initHintStatus=(data)=>{
    let classObjects=data||this.props.classObjects
    let hints={
      hintObjects:Object.keys(classObjects)
    }
    let tmpField=["dn","ou","changetype","replace","newrdn","deleteoldrdn","newsuperior","add","delete","modify","moddn","version"]
    Object.values(classObjects).map(i=>{
      i.map(s=>Object.values(s).map(k=>tmpField=tmpField.concat(k)))
      return i
    })
    hints['hintField']=Array.from(new Set(tmpField))
    this.setState(hints)
  }
  onChange = activeKey => {
    this.setState({ 
      activeKey,
    });
  };
  handleOnAddOrDelTag=(targetKey, action)=>{
    let {panes,addPaneIndex,values}=this.state
    switch(action){
      case "remove":
        if(panes.length>1){
          let newpanes=panes.filter(i=>i.key!==targetKey)
          delete values[targetKey]
          this.setState({
            panes: newpanes,
            activeKey:newpanes[0].key
          })
        }
        break;
      case "add":
        panes.push({key:`ldif_console_${addPaneIndex}`,title: `ldif${addPaneIndex}`})
        this.setState({
          panes,
          addPaneIndex:addPaneIndex+1,
          values: Object.assign(values,{[`ldif_console_${addPaneIndex}`]: defaultValue})
        })
        break;
      default:
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
    let {userlist,dispatch}=this.props
    if(Object.keys(userlist).length===0){
      dispatch({type:"users/getUserList"})
    }
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
      if(/^\s*objectClass:/.test(curLine)){
        list=hintObjects.filter(i=>i.toLowerCase().indexOf(curWord)>=0)
      }else if(/^\s*changetype:/.test(curLine)){
        list=hintType.filter(i=>i.toLowerCase().indexOf(curWord)>=0)
      }else if(/^\s*deleteoldrdn:/.test(curLine)){
        list=["1"].filter(i=>i.toLowerCase().indexOf(curWord)>=0)
      }else if(/^\s*manager:|^\s*uniqueMember:|^\s*member:|^\s*seeAlso:/.test(curLine)){
        let userdnlist=[]
        let {userlist}=this.props
        Object.values(userlist).map(i=>userdnlist.push(i[0]))
        list=userdnlist.concat(list).filter(i=>i.toLowerCase().indexOf(curWord)>=0)
      }
      return {
        list,
        from: CodeMirror.Pos(cur.line, start), 
        to: CodeMirror.Pos(cur.line, end)
      };
    });
  }
  codeMirrorOnChange=(cm, data,value)=>{
    let {values,activeKey} =this.state
    // if (data.origin === "+input" || data.origin=== "paste"){
    if(![undefined,'paste','complete'].includes(data.origin)) CodeMirror.showHint(cm, CodeMirror.hint.ldapHint,{completeSingle:false}); 
    this.setState({values: Object.assign(values,{[activeKey]:cm.getValue()})})
    // }
  }
  handleChangeCodeTheme=(theme)=>{
    require(`codemirror/theme/${theme}.css`)
    this.setState({theme})
    Store.setLocal('ldap_theme',theme)
  }
  handleContextMenu=(cm,event)=>{
    let cur = cm.getCursor();
    let curLine = cm.getLine(cur.line);
    let selectWord=cm.getSelection()
    let menuState={
      copy: false,
      cut: false,
      paste: false,
      encode: false,
      decode: false
    }
    cm.focus()
    if(selectWord!==""){
      menuState['copy']=true
      menuState['cut']=true
    }
    if(/^\s*\w+::?\s*[\{\w\u4e00-\u9fa5]+/.test(curLine)){
      if(/^\s*\w+::/.test(curLine)){
        menuState['decode']=true
        menuState['encode']=false
      }else{
        menuState['decode']=false
        menuState['encode']=true
      }
    }
    let curState={
      curCm: cm,
      selectWord,
      rightMenuControl:menuState,
      curLinePos: cur
    }
    setTimeout(()=>{
      this.setState(curState)
    },100)
    event.preventDefault()
  }
  handleBase64=(type)=>{
    type=type || 'encode'
    let {curCm,curLinePos}=this.state
    let curWord=curCm.getLine(curLinePos.line)
    if(curWord!==""){
      let newCurWord=""
      if(type==='decode'){
        newCurWord=curWord.replace(/^(\s*\w+:):\s*(.*)/,(v1,v2,v3)=> `${v2} ${Base64.decode(v3)}`)
      }else{
        newCurWord=curWord.replace(/^(\s*\w+:)\s*(.*)/,(v1,v2,v3)=> `${v2}: ${Base64.encode(v3.replace(/(^\s*)|(\s*$)/g, ""))}`)
      }
      curCm.replaceRange(
        newCurWord,
        CodeMirror.Pos(curLinePos.line,0),
        CodeMirror.Pos(curLinePos.line,curWord.length)
      )
      curCm.focus()
    }
  }
  handleRightMenu=()=>{
    let {fullScreen}=this.state
    return <ContextMenu id="ldap_ldif_control_menu" >
          <MenuItem disabled={!Boolean(this.state.rightMenuControl.copy)} onClick={()=>{
            let {selectWord}=this.state
            if(selectWord!==""){
              copy(selectWord)
            }}}>
            <Icon style={{margin:"0 6px 0 -8px"}}  type = "copy" /> 
              {formatMessage({id:'ldap_ldif_menu_copy'})}
          </MenuItem>
        < MenuItem disabled={!Boolean(this.state.rightMenuControl.cut)} onClick={()=>{
        }}>
          <Icon style={{margin:"0 6px 0 -8px"}} type="scissor" /> 
          {formatMessage({id:'ldap_ldif_menu_cut'})}
        </MenuItem>
        <MenuItem divider />
        <MenuItem disabled={!Boolean(this.state.rightMenuControl.paste)}>
          <Icon style={{margin:"0 6px 0 -8px"}} type="file-sync" /> 
            {formatMessage({id:'ldap_ldif_menu_paste'})}
        </MenuItem>
        <MenuItem divider />
        <MenuItem disabled={!Boolean(this.state.rightMenuControl.encode)} onClick={this.handleBase64} >
          <Icon style={{margin:"0 6px 0 -8px"}} type="swap-right" /> 
           {formatMessage({id:'ldap_ldif_menu_encode_base64'})}
        </MenuItem>
        <MenuItem disabled={!Boolean(this.state.rightMenuControl.decode)} onClick={this.handleBase64.bind(this,'decode')} >
          <Icon style={{margin:"0 6px 0 -8px"}} type="swap-left" /> 
           {formatMessage({id:'ldap_ldif_menu_decode_base64'})}
        </MenuItem>
        <MenuItem divider />
        <MenuItem onClick={()=>{
          // curCm.setOption("fullScreen", !fullScreen);
          this.setState({fullScreen: !fullScreen})
        }} >
          <Icon style={{margin:"0 6px 0 -8px"}} type={fullScreen?"fullscreen-exit":"fullscreen"} /> 
           {formatMessage({id: fullScreen?'ldap_ldif_menu_exitfull_screen':'ldap_ldif_menu_full_screen'})}
        </MenuItem>
    </ContextMenu>
  }
  handleSubmitCodeMirror=()=>{
    let {values,activeKey,curCm}=this.state
    let {dispatch}=this.props
    let selectWord=curCm.getSelection()
    let ldif=""
    if(selectWord!==""){
      ldif=selectWord
    }else{
      ldif=values[activeKey].split('\n').filter(i=>!/^\s*[#-]/.test(i)).join('\n')
    }
    dispatch({type:'ldap/postLDAPLDIFScripts',payload: {ldif},callback:(data)=>{
      message.info("脚本执行成功！")
    }})
  }
  render(){
    let {values,panes,activeKey,theme,fullScreen} =this.state
    let ismac = CodeMirror.keyMap.default === CodeMirror.keyMap.macDefault;
    let options={
      mode: 'ldap',
      theme: theme,
      keyMap: 'sublime',
      autofocus:true,
      lineWrapping:true,
      lineNumbers: true,
      styleActiveLine:true,
      foldGutter: true,
      autoCloseBrackets:true,
      continueComments: true,
      highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
      lint: true,
      fullScreen,
      matchBrackets:true,
      gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      extraKeys:{
        "F12": (cm)=> {
          this.setState({fullScreen: !fullScreen})
        },
        "Esc": (cm)=> {
          if (fullScreen) this.setState({fullScreen: !fullScreen})
        },
        [(ismac ? "Cmd" : "Ctrl") + "-R"]: (cm)=> {
          this.handleSubmitCodeMirror()
        },
      },
    }
    const {loading}= this.props
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
                  <span className={usercss.ldif_tabbar}>
                    <span className={usercss.ldif_tabbar_item}><Icon component={themesvg} className={usercss.ldif_tabbar_icon} />切换主题</span>
                    <Select size="small"
                      style={{width:140}}
                      onChange={this.handleChangeCodeTheme} 
                      defaultValue={theme}>
                      {themeAll.map(i=><Option key={i} value={i}>{i}</Option>)}
                    </Select>
                  </span>
                }
                onChange={this.onChange}
                activeKey={activeKey}
                type="editable-card"
                style={{display:"flex",flexDirection:"column",flex:"auto"}}
                onEdit={this.handleOnAddOrDelTag} >
                {panes.map(pane => (
                  <TabPane className={usercss.panepadding} tab={pane.title} key={pane.key}>
                    <ContextMenuTrigger id='ldap_ldif_control_menu' >
                      <CodeMirrorComponent
                        defineMode={{name: 'ldap',fn: ldaplint }}
                        className={usercss.codemirror2}
                        editorDidMount={(cm)=>this.setState({curCm: cm})}
                        value={values[activeKey]}
                        options={options}
                        onChange={this.codeMirrorOnChange}
                        onContextMenu={this.handleContextMenu}
                      />
                    </ContextMenuTrigger>
                  <div className={usercss.run_ldif_script_button}>
                    <div style={{float:"right"}}>
                      <Button size="large" block 
                        disabled={Boolean(loading.effects['ldap/postLDAPLDIFScripts'])}
                        onClick={this.handleSubmitCodeMirror} >
                        <Icon type="right-square" theme="filled" /> 执行脚本文件 
                      </Button>
                    </div>
                  </div>
                  </TabPane>
                ))}
              </Tabs>
              {this.handleRightMenu()}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default CMDBCommand;