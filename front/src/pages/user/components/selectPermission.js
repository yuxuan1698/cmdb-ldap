'use strict'

import {
  PureComponent
} from 'react';
import {
  Transfer,Spin,Tree,Icon
} from 'antd';
import css from './index.less'

const { TreeNode,DirectoryTree } = Tree;
class LDAPSelectPermission extends PureComponent {
  state = {
    targetKeys: [],
    selectedKeys:[],
    expandedKeys:[],
    grouplist:[],
    grouplistobject:{},
    transferDataSource:[]
  }
  componentWillMount(){
    let {selectKey}=this.props
    this.getUserPermission(selectKey)
    this.getAllGroups()
  }
  // 获取权限组列表
  getAllGroups=()=>{
    let {dispatch}=this.props
    dispatch({type:'ldap/getPermissionGroupsList',callback:(data)=>{
      let grouplist=[]
      let grouplistobject={}
      Object.values(data).map(it=>{
        grouplistobject[it[1]]=it[0]
        grouplist.push({
          'title':it[1].split(',')[0].split('=')[1],
          'key':it[1],
          'isLeaf': it[0].hasOwnProperty('hasSubordinates') ?
            (it[0]['hasSubordinates'][0] === "TRUE" ? false : true) :
            false
        })
      })
      this.setState({allgroups:grouplist,grouplistobject})
    }})
  }
  getUserPermission=(selectKey)=>{
    let {dispatch}=this.props
    if(selectKey){
      dispatch({type:'users/getLDAPUserPermissions',payload: selectKey,callback:(data)=>{
        if(data && data instanceof Object){
          let listdata=Object.values(data)
          let targetKeys=listdata.map(it=>{
            return it[0]
          })
          // this.setState({targetKeys,transferDataSource:listdata})
        }
      }})
    }
  }
  componentWillReceiveProps(nextProps){
    let old_selectkey=this.props.selectKey
    let new_selectkey=nextProps.selectKey
    if(old_selectkey!=new_selectkey){
      this.getUserPermission(new_selectkey)
    }
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
    });
  }
  handleOnSelect=(selectdn)=>{
    this.setState({
      selectedKeys: selectdn
    })
  }
  renderTreeNodes = (data) => data.map((item) => {
      return (
        <TreeNode  
          isLeaf = {item.isLeaf}
          title={item.title}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
  })
  render() {
    let {loading}=this.props
    let {transferDataSource,targetKeys,expandedKeys,selectedKeys,grouplist}=this.state
    return (
      // <Spin tip={"加载中......"} 
      //   size='large'
      //   wrapperClassName={css.spin_height}
      //   spinning={Boolean(loading.effects['users/getLDAPUserPermissions'])} >
          <Transfer
            // style={{height:"100%",display:"flex",alignItems:"center"}}
            className="tree-transfer"
            titles={["选择组权限","当前权限"]}
            // listStyle={{width:"100%",height:"100%"}}
            targetKeys={targetKeys}
            dataSource={transferDataSource}
            className="tree-transfer"
            render={item => item.title}
            showSelectAll={false}
          >
            <DirectoryTree 
              expandedKeys={expandedKeys}
              autoExpandParent={true}
              selectedKeys={selectedKeys}
              onExpand={this.onExpand.bind(this)}
              onSelect={this.handleOnSelect.bind(this)}>
              {this.renderTreeNodes(grouplist)}
            </DirectoryTree>
          </Transfer>
        // </Spin>
      );
    }
  }

export default LDAPSelectPermission