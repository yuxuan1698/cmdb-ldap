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
import 'codemirror/addon/edit/closebrackets';
// 快捷键
import 'codemirror/keymap/sublime';
// 模式
import 'codemirror/mode/yaml/yaml';
import 'codemirror/addon/mode/overlay';
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

// require('ldaplint')

const {
  Content
} = Layout;
const { 
  TabPane 
} = Tabs;

@connect(({ login, loading }) => ({ login, loading }))
// @experimentalDecorators

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
    console.log(cm)
    const hintOptions = {
      tables: {
        table_name: ['column1', 'column2', 'column3', 'etc'],
        another_table: ['columnA', 'columnB']
      }, 
      disableKeywords: true,
      completeSingle: false,
      completeOnSingleClick: false
    };
    cm.showHint(cm, cm, hintOptions); 
  }
  render(){
    let source = {
       app: ["name", "score", "birthDate"],
       version: ["name", "score", "birthDate"],
       dbos: ["name", "population", "size"]
     };
    let {value,panes,activeKey} =this.state
    let options={
      mode: 'ldap',
      theme: "eclipse",
      keyMap: 'sublime',
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
                    defineMode={{name: 'ldap',fn: (e,c)=>{
                      var cons = ['true', 'false', 'on', 'off', 'yes', 'no'];
                      var keywordRegex = new RegExp("\\b(("+cons.join(")|(")+"))$", 'i');
                      console.log(e)
                      console.log(c)
                      return {
                        token: function(stream, state) {
                          var ch = stream.peek();
                          var esc = state.escaped;
                          state.escaped = false;
                          /* comments */
                          if (ch == "#" && (stream.pos == 0 || /\s/.test(stream.string.charAt(stream.pos - 1)))) {
                            stream.skipToEnd();
                            return "comment";
                          }

                          if (stream.match(/^('([^']|\\.)*'?|"([^"]|\\.)*"?)/))
                            return "string";

                          if (state.literal && stream.indentation() > state.keyCol) {
                            stream.skipToEnd(); return "string";
                          } else if (state.literal) { state.literal = false; }
                          if (stream.sol()) {
                            state.keyCol = 0;
                            state.pair = false;
                            state.pairStart = false;
                            /* document start */
                            if(stream.match(/---/)) { return "def"; }
                            /* document end */
                            if (stream.match(/\.\.\./)) { return "def"; }
                            /* array list item */
                            if (stream.match(/\s*-\s+/)) { return 'meta'; }
                          }
                          /* inline pairs/lists */
                          if (stream.match(/^(\{|\}|\[|\])/)) {
                            if (ch == '{')
                              state.inlinePairs++;
                            else if (ch == '}')
                              state.inlinePairs--;
                            else if (ch == '[')
                              state.inlineList++;
                            else
                              state.inlineList--;
                            return 'meta';
                          }

                          /* list seperator */
                          if (state.inlineList > 0 && !esc && ch == ',') {
                            stream.next();
                            return 'meta';
                          }
                          /* pairs seperator */
                          if (state.inlinePairs > 0 && !esc && ch == ',') {
                            state.keyCol = 0;
                            state.pair = false;
                            state.pairStart = false;
                            stream.next();
                            return 'meta';
                          }

                          /* start of value of a pair */
                          if (state.pairStart) {
                            /* block literals */
                            if (stream.match(/^\s*(\||\>)\s*/)) { state.literal = true; return 'meta'; };
                            /* references */
                            if (stream.match(/^\s*(\&|\*)[a-z0-9\._-]+\b/i)) { return 'variable-2'; }
                            /* numbers */
                            if (state.inlinePairs == 0 && stream.match(/^\s*-?[0-9\.\,]+\s?$/)) { return 'number'; }
                            if (state.inlinePairs > 0 && stream.match(/^\s*-?[0-9\.\,]+\s?(?=(,|}))/)) { return 'number'; }
                            /* keywords */
                            if (stream.match(keywordRegex)) { return 'keyword'; }
                          }

                          /* pairs (associative arrays) -> key */
                          if (!state.pair && stream.match(/^\s*(?:[,\[\]{}&*!|>'"%@`][^\s'":]|[^,\[\]{}#&*!|>'"%@`])[^#]*?(?=\s*:($|\s))/)) {
                            state.pair = true;
                            state.keyCol = stream.indentation();
                            return "atom";
                          }
                          if (state.pair && stream.match(/::/)) { 
                            console.log(stream)
                            state.pairStart = true; return 'meta'; 
                          }

                          /* nothing found, continue */
                          state.pairStart = false;
                          state.escaped = (ch == '\\');
                          stream.next();
                          return null;
                        },
                        startState: function() {
                          return {
                            pair: false,
                            pairStart: false,
                            keyCol: 0,
                            inlinePairs: 0,
                            inlineList: 0,
                            literal: false,
                            escaped: false
                          };
                        },
                        lineComment: "#",
                        fold: "indent"
                      };
                    }}}
                    className={usercss.codemirror2}
                    value={value}
                    // options={{overlayMode:true}}
                    options={options}
                    onChange={this.codeMirrorOnChange}
                  />
                  <div style={{padding:10}}>
                    {/* <div style={{flex:"auto"}}>1</div> */}
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