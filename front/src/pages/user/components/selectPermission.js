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
    width:600,
    targetKeys: [],
    targetValues:[],
    selectedKeys:[],
    selectedRowKeys:[],
    expandedKeys:[],
    loadedKeys:[],
    grouplist:[],
    grouplistobject:{},
    searchValue:""
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
      this.setState({grouplist:grouplist,grouplistobject})
    }})
  }
  getUserPermission=(selectKey)=>{
    let {dispatch}=this.props
    if(selectKey){
      dispatch({type:'users/getLDAPUserPermissions',payload: selectKey,callback:(data)=>{
        if(data && data instanceof Object){
          let listdata=Object.values(data)
          let targetValues=[]
          let parentExtentedKeys=new Set()
          let targetKeys=listdata.map(it=>{
            targetValues.push(it[0])
            parentExtentedKeys.add(it[0].replace(it[0].split(',')[0]+",",''))
            return {
              key:it[0],
              parentname:it[0].split(',')[1].split('=')[1],
              groupname:it[0].split(',')[0].split('=')[1],
              description:it[1].hasOwnProperty('description')?it[1]['description']:""
            }
          })
          this.setState({targetKeys,targetValues,expandedKeys:Array.from(parentExtentedKeys)})
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
      let {targetValues,expandedKeys}=this.state
      return (
        <TreeNode
          key={item.key}
          isLeaf = {item.isLeaf}
          disabled={targetValues.includes(item.key)?true:false}
          icon={item.isLeaf?<Icon  type='team' />:""}  
          groupdn={item.key}
          dataRef={item}
          title={expandedKeys.includes(item.key)?<strong>{item.title}</strong>:<span>{item.title}</span>}>
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
    this.setState({ width: size.width });
  }
  handleRemovePermissionItem=()=>{
    let {selectedRowKeys}=this.state
    alert(selectedRowKeys)
  }
  render(){
    const { grouplist,selectedKeys,expandedKeys,searchValue,targetKeys,selectedRowKeys,width } = this.state;
    const {loading,selectKey}=this.props
    let currUser=selectKey.split(',')[0].split('=')[1]
    return (
      <Layout style={{height:"100%",display:"flex",flexDirection:"column"}}>
        <Layout style={{height:"100%",display:"flex",padding:5,flexDirection:"row"}}>
            <Sider width={width}  className={css.permission_box}>
              <Spin tip={"Loading..."} 
                wrapperClassName={css.permission_tree_spinng}
                spinning={Boolean(loading.effects['ldap/getPermissionGroupsList'] || loading.effects['ldap/getLDAPGroupsSecendList'])}>
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
              </Spin>
            </Sider>
            <Resizable axis="x"  minConstraints={[350,350]}
              maxConstraints={[620, 620]}
              height={100}
              width={width}
              onResize={this.onResize}>
                <div ></div>
          </Resizable>
          <Table showHeader
            title={() => {
              return <div>
                  {selectedRowKeys.length>0?<Button title="移除所选权限项" 
                    icon='retweet' 
                    style={{float:"right",top:-4}} 
                    type="danger" 
                    onClick={this.handleRemovePermissionItem.bind(this)}>移除所选权限项</Button>:""}
                  <h3 style={{margin:0}}>当前用户[<span style={{color:"blue"}}>{currUser}</span>]的权限。</h3>
                </div>
            }}
            className={css.permission_current_status}
            bordered
            rowKey='key'
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
            onRow={record => ({
              onDoubleClick:()=>{
                
                if(selectedRowKeys.includes(record.key)){
                  this.setState({selectedRowKeys:selectedRowKeys.filter(i=>i!=record.key)})
                }else{
                  this.setState({selectedRowKeys:selectedRowKeys.push(record.key)})
                }
              }
            })}
          />
          </Layout>
        <Footer className={css.permission_box_footbar}>
          <Button title="返回" icon='retweet' style={{margin:"0 10px"}} type="dashed"  >返回</Button>
          <Button title="保存权限" icon='usergroup-add' disabled={true} loading={loading.effects['users/getLDAPUserPermissions']}>保存权限</Button>
        </Footer>
      </Layout>
    )
  }
}

export default LDAPSelectPermission
