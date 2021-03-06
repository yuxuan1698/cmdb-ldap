'use strict'

import {PureComponent} from 'react'
import { Layout, Tree, Input, Button, Icon, Empty, Spin,Modal } from 'antd';
import {connect} from 'dva';
import { Resizable } from 'react-resizable';
import { ContextMenuTrigger, ContextMenu,MenuItem } from 'react-contextmenu';
import PropTypes from 'prop-types';
import usercss from "./user.less";
import CMDBBreadcrumb from "../components/Breadcrumb";
import dynamic from 'umi/dynamic';
import {formatMessage} from 'umi/locale';

const {
   Content, Sider,Footer
} = Layout;
const ButtonGroup = Button.Group;
const { TreeNode,DirectoryTree } = Tree;
const {Search} = Input;

const CMDBLDAPManager = dynamic({
  loader: () => import('./components/ldapManager'),
  loading: (e) => {
    return null
  },
})

@connect(({ldap,loading})=>({loading,groups:ldap.groups}))
class CMDBLdapGroups extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      width:250,
      searchValue:"",
      expandedKeys:[],
      selectedKeys:[],
      loadedKeys:[],
      autoExpandParent: true,
      selectdata:"",
      loadedData:{},
      classobjects:"",
      isNewDn:false,
    }
  }
  renderTreeNodes = (data,searchValue) => data.filter(i=>{
    if(i.children) return true
    if(i.title.indexOf(searchValue)>-1) return true
    return false
  }).map((item) => {
    let title=<span>{item.title}</span>
    if(searchValue){
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      if(index > -1){
        title=(<span>
              {beforeStr}
                <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
          </span>)
      }
    }
    return (
      <TreeNode  
        isLeaf = {
          item.isLeaf
        }
        icon={item.isLeaf?<Icon  type='bars' />:""}  
        disabled={this.state.isNewDn} 
        title={title} key={item.key} dataRef={item}>
        {item.children?this.renderTreeNodes(item.children,searchValue):""}
      </TreeNode>
    );
  })
  handleRightMenu=()=>{
    return <ContextMenu id="ldap_control_menu" >
      < MenuItem onClick = {
        this.handleNewDNItem.bind(this)
      } >
         <Icon style={{margin:"0 7px 0 -8px"}}  type = "file-add"
         theme = "twoTone" / > {formatMessage({id:'ldapmanager_add_dn'})}
        </MenuItem>
        < MenuItem onClick = {
          this.handleRemoveDn.bind(this)
        } >
          < Icon style={{margin:"0 7px 0 -8px"}} type = "delete"
          theme = "twoTone" / > {formatMessage({id:'ldapmanager_del_dn'})}
        </MenuItem>
        <MenuItem divider />
        < MenuItem onClick = {
          this.handleFlushAndReset.bind(this)
        } >
           < Icon style={{margin:"0 7px 0 -8px",color:"#1590ff"}} 
            type = "reload" / > {formatMessage({id:'ldapmanager_flush_dn'})}
        </MenuItem>
        <MenuItem divider />
        < MenuItem >
   	      < Icon style={{margin:"0 7px 0 -8px"}} type = "edit"
   	      theme = "twoTone" / > 
           {formatMessage({id:'ldapmanager_rename_dn'})}
        </MenuItem>
    </ContextMenu>
  }
  onLoadData = treeNode => {
    const {dispatch} =this.props
    return new Promise((resolve)=>{
      if (treeNode.props.children) {
        resolve();
        return;
      }
      const curkey=treeNode.props.dataRef.key
      dispatch({'type':'ldap/getLDAPGroupsSecendList',payload:`${curkey}/`,callback:(data)=>{
        let list=[]
        let loadedobject={}
        if(data.hasOwnProperty('notsubdir') && data.hasOwnProperty('data') && data.data instanceof Array){
          treeNode.props.dataRef.isLeaf=true
          data.data.map(i=>{
            loadedobject[i[1]]=i[0]
            return i
          })
          this.setState({
            treedata: [...this.props.groups.treedata],
            loadedData:Object.assign(this.state.loadedData,loadedobject),
            loadedKeys: this.state.loadedKeys.concat(curkey)
          });
          resolve()
        }else{
          Object.values(data).map(i=>{
            const tt=i[1]
            loadedobject[tt]=i[0]
            list.push({
              'title':tt.split(',')[0].split('=')[1],
              'key':`${tt}`,
              'isLeaf': i[0].hasOwnProperty('hasSubordinates') ?
                (i[0]['hasSubordinates'][0] === "TRUE" ? false : true) :
                false
            })
            return i
          })
          treeNode.props.dataRef.children = list
          setTimeout(() => {
            this.setState({
              treedata: [...this.props.groups.treedata],
              loadedData:Object.assign(this.state.loadedData,loadedobject),
              loadedKeys: this.state.loadedKeys.concat(curkey)
            });
            resolve();
          }, 100);
        }
      }})
    })
  }
  onResize=(event, { size })=>{
    this.setState({ width: size.width });
  }
  handleGetobjectClass=()=>{
    const {
      dispatch
    } = this.props

    if (this.state.classobjects === "") {
      dispatch({
        type: 'users/getLDAPClassList',
        callback: (data) => {
          this.setState({
            classobjects: data,
          });
        }
      })
    }
  }
  handleUpdateLocalDn=(value,newdn)=>{
    let {selectedKeys,loadedData,loadedKeys}=this.state
    if(loadedData.hasOwnProperty(selectedKeys)){
      let nextState={
        selectdata: value,
      }
      // 如果DN变更，就删除之前的DN,添加新的dn,数据更新
      if(newdn){
        delete loadedData[selectedKeys]
        loadedKeys.splice(loadedKeys.findIndex(i=>i===selectedKeys),0,newdn)
        nextState['loadedData']=Object.assign(loadedData,{[newdn]:value})
        nextState['selectedKeys']=[newdn]
      }else{
        nextState['loadedData']=Object.assign(loadedData,{[selectedKeys]:value})
      }
      this.setState(nextState)
    }
  }
  handleOnSelect=(selectdn)=>{
    const { treeobject }=this.props.groups
    const { loadedData,isNewDn }=this.state
    if(isNewDn) return false
    let currState = {
      selectedKeys: selectdn,
      isNewDn:false
    }
    if (treeobject.hasOwnProperty(selectdn)){
      currState=Object.assign(currState,{selectdata: Object.assign(treeobject[selectdn])})
    }
    if (loadedData.hasOwnProperty(selectdn)){
      currState=Object.assign(currState,{selectdata: Object.assign(loadedData[selectdn])})
    }
    this.setState(currState)
    this.handleGetobjectClass()
  }
  handleOnChange = (value) => {
    this.setState({
      searchValue: value,
      autoExpandParent: true,
    });
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  handleNewDNItem=()=>{
    this.setState({
      selectdata:{},
      isNewDn:true
    })
    this.handleGetobjectClass()
  }
  handleRemoveDn=()=>{
    const {selectedKeys}=this.state
    const {dispatch}=this.props
    if(selectedKeys){
      Modal.confirm({
        title:formatMessage({id:'ldapmanager_del_tips'}),
        content:formatMessage({id:'ldapmanager_del_tips_content'},{selectedKeys}),
        onOk: ()=>{
          dispatch({
            type: 'ldap/deleteEntryDn',
            payload: selectedKeys
          })
          this.setState({
            selectedKeys:[],
            selectdata:""
          })
        }
      })
    }
  }
  handleFlushAndReset=()=>{
    this.setState({
      expandedKeys:[],
      autoExpandParent:false,
      selectedKeys:[],
      selectdata:"",
      loadedKeys:[],
      searchValue:"",
      isNewDn:false,
    })
  }
  handleRightButtonEvent=({event,node})=>{
    this.setState({selectedKeys:[node.props.eventKey]})
  }
  render(){
    const { 
      searchValue, 
      expandedKeys,
      selectedKeys,
      loadedKeys, 
      autoExpandParent,
      width,
      classobjects,
      selectdata,
      isNewDn
    } = this.state
    const {treedata}=this.props.groups
    const {loading}=this.props

    return (
    <Layout className={usercss.userbody}>
      <CMDBBreadcrumb route={{'menu.side.users.ldap':"",breadcrumb_ldap_manager:'/user'}} title='breadcrumb_ldap_manager' />
      <Layout style={{margin:"10px 0 0 0"}}>
        <Resizable axis="x"  minConstraints={[220,220]}
            maxConstraints={[520, 520]}
            height={100}
            width={width} onResize={this.onResize} >
          <Sider width={width} theme="light" >
            <Layout style={{height:"100%",padding:5,boxShadow:"0px 0px 3px #dcd8d8"}} >
              <Search style={{ marginBottom: 8 }} placeholder="Search(Key Press)" onSearch={this.handleOnChange.bind(this)}  />
              <Content className={usercss.ldap_content_box} >
                <Spin tip={isNewDn?formatMessage({id:'ldapmanager_add_not_opration'}):"Loading..." }
                  wrapperClassName={usercss.tree_not_control_div}
                  indicator={isNewDn?<Icon type="message" theme="twoTone" />:null} 
                  size='large'
                  spinning={Boolean(loading.effects['ldap/getLDAPGroupsList']||isNewDn)}>
                  <ContextMenuTrigger id='ldap_control_menu'  disabled={this.state.isNewDn} >
                    <DirectoryTree loadData={this.onLoadData} 
                      expandedKeys={expandedKeys}
                      disabled={this.state.isNewDn}
                      autoExpandParent={autoExpandParent}
                      selectedKeys={selectedKeys}
                      loadedKeys={loadedKeys}
                      onExpand={this.onExpand.bind(this)}
                      onRightClick={this.handleRightButtonEvent.bind(this)}
                      onSelect={this.handleOnSelect.bind(this)}>
                      {this.renderTreeNodes(treedata,searchValue)}
                    </DirectoryTree>
                  </ContextMenuTrigger>
                  {this.handleRightMenu()}
                  </Spin>
              </Content>
              <Footer style={{padding:0,}}>
                <ButtonGroup size="small" >
                    <Button title={formatMessage({id:'ldapmanager_add'})}
                      className={usercss.ldap_button_group} 
                      icon='plus' 
                      onClick={this.handleNewDNItem.bind(this)}/>
                    < Button title = {formatMessage({id:'ldapmanager_del'})}
                    disabled = {
                      selectedKeys.length>0 ? false : true
                    }
                      onClick={this.handleRemoveDn.bind(this)}
                      className={usercss.ldap_button_group} icon='minus' />
                    <Button title={formatMessage({id:'ldapmanager_flush'})} 
                      onClick={this.handleFlushAndReset.bind(this)} 
                      className={usercss.ldap_button_group} icon='reload' />
                </ButtonGroup>
              </Footer>
            </Layout>
          </Sider>
        </Resizable>
        <Content className={usercss.right_content_class}>
          {(classobjects && selectdata)?<CMDBLDAPManager 
            selectdata={selectdata}
            isNewDn={isNewDn}
            currentDn = { selectedKeys.length>0?selectedKeys[0]:"" }
            handleUpdateLocalDn={this.handleUpdateLocalDn.bind(this)}
            handleNewDNItem={this.handleNewDNItem.bind(this)}
            handleFlushAndReset={this.handleFlushAndReset.bind(this)}
            classobjects={classobjects} />:<Empty className={usercss.right_empty_center} />}
        </Content>
      </Layout>
    </Layout>
    )
  }
}

CMDBLdapGroups.propTypes = {
  groups: PropTypes.object
};

export default CMDBLdapGroups;