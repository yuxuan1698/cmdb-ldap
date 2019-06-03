'use strict'
import {PureComponent} from 'react'
import { Spin,Icon, Tree, Table, Button,Layout } from 'antd';

import { Resizable } from 'react-resizable';
import css from './index.less'
import Sider from 'antd/lib/layout/Sider';
const {TreeNode,DirectoryTree}=Tree
const {Footer,Content}=Layout
class LDAPSelectPermission extends PureComponent {
  state = {
    width:250,
    targetKeys: [],
    selectedKeys:[],
    selectedRowKeys:[],
    expandedKeys:[],
    loadedKeys:[],
    grouplist:[],
    grouplistobject:{},
    disabled: false,
    showSearch: false,
    searchValue:""
  }
  onChange = nextTargetKeys => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  triggerDisable = disabled => {
    this.setState({ disabled });
  };

  triggerShowSearch = showSearch => {
    this.setState({ showSearch });
  };
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
      this.setState({grouplist:grouplist,grouplistobject})
    }})
  }
  getUserPermission=(selectKey)=>{
    let {dispatch}=this.props
    if(selectKey){
      dispatch({type:'users/getLDAPUserPermissions',payload: selectKey,callback:(data)=>{
        if(data && data instanceof Object){
          let listdata=Object.values(data)
          let targetKeys=listdata.map(it=>{
            return { groupname:it[0].split(',')[0].split('=')[1],
              description:it[1].hasOwnProperty('description')?it[1]['description']:""
            }
          })
          this.setState({targetKeys})
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
          key={item.key}
          isLeaf = {item.isLeaf}
          icon={item.isLeaf?<Icon  type='team' />:""}  
          groupdn={item.key}
          dataRef={item}
          title={item.title}>
          {item.hasOwnProperty('children')?this.renderTreeNodes(item.children):""}
        </TreeNode>
      );
  })
  onLoadData = treeNode => {
    const {dispatch} =this.props
    return new Promise((resolve)=>{
      if (treeNode.props.children) {
        resolve();
        return;
      }
      const curkey=treeNode.props.groupdn
      dispatch({'type':'ldap/getLDAPGroupsSecendList',payload:`${curkey}/`,callback:(data)=>{
        let list=[]
        let loadedobject={}
        
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
        })
        treeNode.props.dataRef.children = list
        setTimeout(() => {
          this.setState({
            loadedKeys: this.state.loadedKeys.concat(curkey)
          });
          resolve();
        }, 100);
      }})
    })
  }
  handleRowSelectionChange = enable => {
    this.setState({ rowSelection: enable ? {} : undefined });
  };
  onSelectChange=(selectedRowKeys)=>{
    this.setState({ selectedRowKeys });
  }
  onResize=(event, { size })=>{
    console.log(size)
    this.setState({ width: size.width });
  }
  render(){
    const { grouplist,selectedKeys,expandedKeys,searchValue,targetKeys,selectedRowKeys,width } = this.state;
    const {loading,selectKey}=this.props
    let currUser=selectKey.split(',')[0].split('=')[1]
    console.log(width)
    return (
      <Layout style={{height:"100%",display:"flex",flexDirection:"column"}}>
         <Resizable axis="x"  minConstraints={[220,220]}
            maxConstraints={[520, 520]}
            height={100}
            width={width}
            onResize={this.onResize}>
            <Sider width={width}  className={css.permission_box}>
              <DirectoryTree loadData={this.onLoadData} 
                expandedKeys={expandedKeys}
                className={css.permission_tree_box}
                // autoExpandParent={autoExpandParent}
                selectedKeys={selectedKeys}
                // loadedKeys={loadedKeys}
                onExpand={this.onExpand.bind(this)}
                // onRightClick={this.handleRightButtonEvent.bind(this)}
                onSelect={this.handleOnSelect.bind(this)}>
                  {this.renderTreeNodes(grouplist,searchValue)}
              </DirectoryTree>
            </Sider>
        </Resizable>
          {/* <div style={{width:120}}>
            <Button size="small" icon='double-left'>移除权限</Button>
            <Button size="small">添加权限<Icon type='double-right' /></Button>
          </div> */}
          <Layout>
          <Table
            showHeader
            title={() => <h3 style={{margin:0}}>当前用户[<span style={{color:"blue"}}>{currUser}</span>]的权限</h3>}
            className={css.permission_current_status}
            bordered
            bodyStyle={{margin:0}}
            pagination={{
              size:"small",
              showSizeChanger:true,
              showQuickJumper:true,
              defaultPageSize:15,
              pageSizeOptions:["15","30","45"]
            }} 
            loading={loading.effects['users/getLDAPUserPermissions']}
            // title={"当前分配的权限组"}
            rowSelection={{
              selectedRowKeys,
              columnWidth:"30px",
              onChange: this.onSelectChange.bind(this),
            }}
            columns={[
              {
                dataIndex: 'parentname',
                title: '所属父级组',
                key: 'parentname'
              },
              {
                dataIndex: 'groupname',
                title: '权限组名',
                key: 'groupname'
              },
              {
                dataIndex: 'description',
                title: '组描述',
                key:'description'
              },
            ]}
            dataSource={targetKeys}
            size="small"
            // style={{ pointerEvents: listDisabled ? 'none' : null }}
            // onRow={({ key, disabled: itemDisabled }) => ({
            //   onClick: () => {
            //     if (itemDisabled || listDisabled) return;
            //     onItemSelect(key, !listSelectedKeys.includes(key));
            //   },
            // })}
          />
          </Layout>
        <Footer style={{padding:10,textAlign:"center"}}>
          <Button title="添加" icon='plus'>保存权限</Button>
        </Footer>
      </Layout>
    )
  }
}

export default LDAPSelectPermission
