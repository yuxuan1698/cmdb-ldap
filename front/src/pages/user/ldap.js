'use strict'

import {PureComponent} from 'react'
import { Layout, Tree, Input, Button, Icon, Empty, Spin } from 'antd';
import {connect} from 'dva';
import { Resizable } from 'react-resizable';
import { ContextMenuTrigger, ContextMenu,MenuItem } from 'react-contextmenu';
import PropTypes from 'prop-types';
import usercss from "./user.less";
import CMDBBreadcrumb from "../components/Breadcrumb";
import CMDBLDAPManager from "../components/ldapManager"

const {
   Content, Sider,Footer
} = Layout;
const ButtonGroup = Button.Group;
const { TreeNode,DirectoryTree } = Tree;
const {Search} = Input;

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

    if (item.children) {
      return (
        <TreeNode title={title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children,searchValue)}
        </TreeNode>
      );
    }
    return <TreeNode icon={item.isLeaf?<Icon  type='bars' />:""}  key={item.key} title={title}  dataRef={item} />;
  })
  handleRightMenu=()=>{
    let menu = (<ContextMenu id="ldap_control_menu" >
      <MenuItem data={{foo: 'bar'}} >
          新建节点(Entry)
        </MenuItem>
        <MenuItem data={{foo: 'bar'}} >
          删除节点(Entry)
        </MenuItem>
        <MenuItem divider />
        <MenuItem data={{foo: 'bar'}} >
   	      重命名节点(Entry)
        </MenuItem>
    </ContextMenu>)
    return menu
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
          })
          this.setState({
            treedata: [...this.props.groups.treedata],
            loadedData:Object.assign(this.state.loadedData,loadedobject),
            loadedKeys: this.state.loadedKeys.concat(curkey)
          });
          resolve()
        }else{
          Object.keys(data).map(i=>{
            const tt=data[i][1]
            loadedobject[tt]=data[i][0]
            list.push({
              'title':tt.split(',')[0].split('=')[1],
              'key':`${tt}`,
              'isLeaf': false
            })
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
  handleOnSelect=(selectdn)=>{
    const { treeobject }=this.props.groups
    const { loadedData }=this.state
    const { dispatch }=this.props
    let currState={selectedKeys:selectdn}
    if (treeobject.hasOwnProperty(selectdn)){
      currState=Object.assign(currState,{selectdata: Object.assign(treeobject[selectdn],{selectdn:selectdn})})
    }
    if (loadedData.hasOwnProperty(selectdn)){
      currState=Object.assign(currState,{selectdata: Object.assign(loadedData[selectdn],{selectdn:selectdn})})
    }
    this.setState(currState)
    if (this.state.classobjects === "") {
      dispatch({
        type: 'users/getLDAPClassList', callback: (data) => {
          this.setState({
            classobjects: data,
          });
        }
      })
    }
  }
  handleOnChange = (e) => {
    const value = e.target.value;
    console.log('111')
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
      selectdata:[],
      selectedKeys:[]})
  }
  handleRemoveDn=()=>{
    alert(this.state.selectedKeys)
  }
  handleFlushAndReset=()=>{
    this.setState({
      expandedKeys:[],
      autoExpandParent:false,
      selectedKeys:[],
      selectdata:"",
      loadedKeys:[],
      searchValue:""
    })
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
      selectdata 
    } = this.state
    const {treedata}=this.props.groups
    const {loading}=this.props

    return (
    <Layout className={usercss.userbody}>
      <CMDBBreadcrumb route={{'用户管理':"",'用户组列表':'/user/ldap'}} title='用户组列表'  />
      <Layout style={{margin:"10px 0 0 0"}}>
        <Resizable axis="x"  minConstraints={[220,220]}
            maxConstraints={[520, 520]}
            height={100}
            width={width} onResize={this.onResize} >
          <Sider width={width} theme="light" >
            <Layout style={{height:"100%",padding:5,boxShadow:"0px 0px 3px #dcd8d8"}} >
              <Search style={{ marginBottom: 8 }} placeholder="Search(Key Press)" value={searchValue} onChange={this.handleOnChange.bind(this)}  />
              <Content className={usercss.ldap_content_box} >
                <Spin tip="Loading..." spinning={loading.effects['ldap/getLDAPGroupsList']}>
                  <ContextMenuTrigger id='ldap_control_menu' >
                    <DirectoryTree loadData={this.onLoadData} 
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      selectedKeys={selectedKeys}
                      loadedKeys={loadedKeys}
                      onExpand={this.onExpand.bind(this)}
                      onSelect={this.handleOnSelect.bind(this)}>
                      {this.renderTreeNodes(treedata,searchValue)}
                    </DirectoryTree>
                  </ContextMenuTrigger>
                  {this.handleRightMenu()}
                  </Spin>
              </Content>
              <Footer style={{padding:0,}}>
                <ButtonGroup size="small" >
                    <Button title="添加" 
                      className={usercss.ldap_button_group} 
                      icon='plus' 
                      onClick={this.handleNewDNItem.bind(this)}/>
                    <Button title="删除" disabled={selectdata ? false : true} 
                      onClick={this.handleRemoveDn.bind(this)}
                      className={usercss.ldap_button_group} icon='minus' />
                    <Button title="刷新" onClick={this.handleFlushAndReset.bind(this)} className={usercss.ldap_button_group} icon='reload' />
                </ButtonGroup>
              </Footer>
            </Layout>
          </Sider>
        </Resizable>
        <Content className={usercss.right_content_class}>
          {(classobjects && selectdata)?<CMDBLDAPManager 
            selectdata={this.state.selectdata}
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