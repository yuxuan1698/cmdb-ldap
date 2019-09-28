'use strict'
import {PureComponent } from 'react'
import {
  Spin,
  Icon,
  Tree,
  Table,
  Button,
  Layout,
  Popover,
  notification
} from 'antd';

import { Resizable } from 'react-resizable';
import css from './index.less'
import Sider from 'antd/lib/layout/Sider';
import {formatMessage} from 'umi/locale';
const {TreeNode,DirectoryTree}=Tree
const {Footer}=Layout
class LDAPSelectPermission extends PureComponent {
  state = {
    width:350,
    targetKeys: [],
    targetValues:[],
    selectedKeys:[],
    selectedRowKeys:[],
    expandedKeys:[],
    loadedKeys:[],
    grouplist:[],
    oldgrouplist:[],
    grouplistobject:{},
    currPermissionKeys:{},
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
      Object.values(data).map(it=>{
        grouplist.push({
          'title':it[1].split(',')[0].split('=')[1],
          'key':it[1],
          'description':  it[0].hasOwnProperty('description')?`(${it[0]['description'][0]})`:"",
          'isLeaf': it[0].hasOwnProperty('hasSubordinates') ?
            (it[0]['hasSubordinates'][0] === "TRUE" ? false : true) :
            false
        })
      })
      this.setState({grouplist:grouplist})
    }})
  }
  getUserPermission=(selectKey)=>{
    let {dispatch}=this.props
    if(selectKey){
      dispatch({type:'users/getLDAPUserPermissions',payload: selectKey,callback:(data)=>{
        if(data && data instanceof Object){
          let listdata=Object.values(data)
          let targetValues=[]
          let oldgrouplist=[]
          let parentExtentedKeys=new Set()
          let targetKeys=listdata.map(it=>{
            targetValues.push(it[0])
            oldgrouplist.push(it[0])
            console.log(it)
            parentExtentedKeys.add(it[0].replace(it[0].split(',')[0]+",",''))
            return {
              key:it[0],
              parentname:it[0].split(',')[1].split('=')[1],
              groupname:it[0].split(',')[0].split('=')[1],
              description:it[1].hasOwnProperty('description')?it[1]['description']:""
            }
          })
          this.setState({
            targetKeys,
            currPermissionKeys:{},
            selectedRowKeys:[],
            targetValues,
            expandedKeys:Array.from(parentExtentedKeys),
            oldgrouplist})
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
      let {targetValues,expandedKeys,currPermissionKeys,oldgrouplist}=this.state
      let {selectKey}=this.props
      let havePermission=Boolean(
        targetValues.includes(item.key)
        )
      return (
        <TreeNode
          key={item.key}
          isLeaf = {item.isLeaf}
          disabled={havePermission}
          icon={item.isLeaf?<Icon  type='team' />:""}  
          groupdn={item.key}
          dataRef={item}
          title={expandedKeys.includes(item.key)||targetValues.includes(item.key)?
          <strong>{item.title}{item.description}</strong>:
          (item.isLeaf && selectKey && !havePermission ?
            <Popover 
              placement="right" 
              title={item.pop} 
              content={<Button block type='primary' icon='plus' size="small" 
                    onClick={this.handleAddPermission.bind(this,item.key)} >{formatMessage({id:'ldap_permission_add_group'})}</Button>
                } 
              trigger="hover">
            <span >{item.title}{item.description}</span>
          </Popover>:
          <span >{item.title}{item.description}</span>)
          }>
          {item.hasOwnProperty('children')?this.renderTreeNodes(item.children):""}
        </TreeNode>
      );
  })
  onLoadData = treeNode => {
    const {dispatch} =this.props
    const {loadedKeys,grouplistobject}=this.state
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
            'pop':i[0].hasOwnProperty('description')?i[0].description:'',
            'isLeaf': i[0].hasOwnProperty('hasSubordinates') ?
              (i[0]['hasSubordinates'][0] === "TRUE" ? false : true) :
              false
          })
        })
        treeNode.props.dataRef.children = list
        setTimeout(() => {
          this.setState({
            loadedKeys: loadedKeys.concat(curkey),
            grouplistobject:Object.assign(grouplistobject,loadedobject)
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
    let {selectedRowKeys,targetKeys,targetValues,currPermissionKeys,grouplistobject,oldgrouplist}=this.state
    let {selectKey}=this.props
    selectedRowKeys.map(i=>{
      if(!oldgrouplist.includes(i)){
        if(currPermissionKeys.hasOwnProperty(i)) delete currPermissionKeys[i]
      }else{
        let values={}
        if(grouplistobject[i].hasOwnProperty('uniqueMember')){
          values={uniqueMember:grouplistobject[i]['uniqueMember'].filter(s=>s!==selectKey)}
        } else if(grouplistobject[i].hasOwnProperty('member')){
          values={member:grouplistobject[i]['member'].filter(s=>s!==selectKey)}
        } else if(grouplistobject[i].hasOwnProperty('memberUid')){
          values={memberUid:grouplistobject[i]['memberUid'].filter(s=>s!==selectKey.split(',')[0].split('=')[1])}
        } else{
          return false 
        }
        currPermissionKeys[i]=values
      }
    })
    this.setState({
      selectedRowKeys:[],
      targetKeys:targetKeys.filter(i=>!selectedRowKeys.includes(i.key)),
      targetValues:targetValues.filter(i=>!selectedRowKeys.includes(i)),
      currPermissionKeys
    })
  }

  handleAddPermission=(currGroupDn)=>{
    if(currGroupDn){
      let {targetValues,grouplistobject,currPermissionKeys,targetKeys,selectedRowKeys,oldgrouplist}=this.state
      let {selectKey}=this.props
      let tmpKeys=targetKeys.filter(i=>i.key!==currGroupDn)
      let newcurrPermissionKeys=currPermissionKeys
      if(oldgrouplist.includes(currGroupDn)){
        if(newcurrPermissionKeys.hasOwnProperty(currGroupDn)) delete newcurrPermissionKeys[currGroupDn]
      }else{
        let values={}
        if(grouplistobject[currGroupDn].hasOwnProperty('uniqueMember')){
          values={uniqueMember:Array.from(new Set([...grouplistobject[currGroupDn]['uniqueMember'],selectKey]))}
        } else if(grouplistobject[currGroupDn].hasOwnProperty('member')){
          values={member:Array.from(new Set([...grouplistobject[currGroupDn]['member'],selectKey]))}
        } else if(grouplistobject[currGroupDn].hasOwnProperty('memberUid')){
          values={memberUid:Array.from(new Set([
            ...grouplistobject[currGroupDn]['memberUid'],
            selectKey.split(',')[0].split('=')[1]
          ]))}
        } else{
          return false 
        }
        newcurrPermissionKeys[currGroupDn]=values
      }
      tmpKeys.push({
        key:currGroupDn,
        parentname:currGroupDn.split(',')[1].split('=')[1],
        groupname:currGroupDn.split(',')[0].split('=')[1],
        description:grouplistobject[currGroupDn].hasOwnProperty('description')?grouplistobject[currGroupDn]['description']:""
      })
      this.setState({
        currPermissionKeys:newcurrPermissionKeys,
        selectedRowKeys:Array.from(new Set([...selectedRowKeys,currGroupDn])),
        targetValues:Array.from(new Set([...targetValues,currGroupDn])),
        targetKeys:tmpKeys
      })
    }
  }
  handleSavePermissionChange=()=>{
    let {dispatch}=this.props
    let {currPermissionKeys}=this.state
    let haveError=false
    Object.keys(currPermissionKeys).map(i=>{
      Object.keys(currPermissionKeys[i]).map(m=>{
        if(currPermissionKeys[i][m].length===0){
          haveError=true
          notification.error({
            message: formatMessage({id:'ldap_permission_save_field'}),
            description: <span>
              {formatMessage({id:'ldap_permission_save_field_msg'},{groupname:i.split(',')[0].split('=')[1]})}
            </span>
          })
        }
      })
    })
    if(haveError) return haveError
    dispatch({type:'ldap/postLDAPGroupPermission',payload:currPermissionKeys,callback:(d)=>{
      notification.info({
        message: formatMessage({id:'ldap_permission_save_success'}),
        description: d.status
      })
      this.props.handleReturnOrReset()
    }})
  }
  render(){
    const { grouplist,selectedKeys,expandedKeys,searchValue,targetKeys,selectedRowKeys,width,currPermissionKeys,oldgrouplist } = this.state;
    const {loading,selectKey}=this.props
    let currUser=selectKey.split(',')[0].split('=')[1]
    let tableData=targetKeys
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
                  selectedKeys={selectedKeys}
                  onExpand={this.onExpand.bind(this)}
                  onSelect={this.handleOnSelect.bind(this)}>
                    {this.renderTreeNodes(grouplist,searchValue)}
                </DirectoryTree>
              </Spin>
            </Sider>
            <Resizable axis="x"  minConstraints={[300,300]}
              maxConstraints={[620, 620]}
              height={100}
              width={width}
              onResize={this.onResize}>
                <div ></div>
          </Resizable>
          <Table showHeader
            title={() => {
              return <div>
                  {selectedRowKeys.length>0?<Button title={formatMessage({id:'ldap_permission_remove_choise'})}
                    icon='retweet' 
                    style={{float:"right",top:-4}} 
                    type="danger" 
                    onClick={this.handleRemovePermissionItem.bind(this)}>{formatMessage({id:'ldap_permission_remove_choise'})}</Button>:""}
                  <h3 style={{margin:0}}><Icon type='user' />{formatMessage({id:'ldap_permission_remove_content'},{currUser})}</h3>
                </div>
            }}
            className={css.permission_current_status}
            bordered
            rowKey='key'
            bodyStyle={{margin:0}}
            style={{minWidth:600}}
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
                title: formatMessage({id:'ldap_permission_table_id1'}),
                key: 'parentname'
              },
              {
                dataIndex: 'groupname',
                title: formatMessage({id:'ldap_permission_table_id2'}),
                key: 'groupname'
              },
              {
                dataIndex: 'description',
                title: formatMessage({id:'ldap_permission_table_id3'}),
                key:'description'
              },
            ]}
            dataSource={tableData}
            size="small"
          />
          </Layout>
        <Footer className={css.permission_box_footbar}>
          <Button title={formatMessage({id:'ldap_permission_backup'})} 
            icon='retweet' 
            onClick={this.props.handleReturnOrReset} 
            style={{margin:"0 10px"}} 
            type="dashed" >
              {formatMessage({id:'ldap_permission_backup'})}
            </Button>
          <Button title={formatMessage({id:'ldap_permission_save'})}
            icon='usergroup-add' 
            disabled={Object.keys(currPermissionKeys).length>0?false:true} 
            onClick={this.handleSavePermissionChange.bind(this)}
            loading={loading.effects['users/getLDAPUserPermissions']}>
              {formatMessage({id:'ldap_permission_save'})}
            </Button>
        </Footer>
      </Layout>
    )
  }
}

export default LDAPSelectPermission
