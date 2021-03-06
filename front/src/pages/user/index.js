'use strict'

import {connect} from 'dva';
import {PureComponent} from 'react'
import PropTypes from 'prop-types';
import { 
  Table, Icon, Button, Alert,Layout,Input,Tooltip,Popover,Checkbox,Divider
} from 'antd';
import usercss from "./user.less";
import CMDBBreadcrumb from "../components/Breadcrumb";
import dynamic from 'umi/dynamic';
import {UserEditButton,UserBatchButton} from './components/UserEditButton'
import {ResetButtonGroup} from './components/ResetButtonGroup'
import {formatTimeAndZone,exportUserDatas} from 'utils'
import {formatMessage} from 'umi/locale';
import useralias from 'svgicon/useralias.svg'
const {
  Content
} = Layout;

const DrawerAddUser = dynamic({
  loader: () => import('./components/addUser'),
  loading: (e) => {
    return null
  },
})

let DrawerUpdateUser = dynamic({
  loader: () => import('./components/modifyUser'),
  loading: (e) => {
    return null
  },
})

let UserInfo = dynamic({
  loader: () => import('./components/UserInfo'),
  loading: (e) => {
    return null
  },
})

@connect(({ users, loading }) => ({ userlist:users.userlist, loading }))
class CMDBUserList extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      selectedRowKeys: [],
      loadedDrawer:false,
      modifyDrawer:false,
      modifydata:"",
      classobjects:"",
      userinfo:{},
      displayuser:false,
      searchWidth:150,
      searchFilterVal:"",
      exportFields:[
        {label:"用户名",value:"uid"},
        {label:"用户姓名",value:"cn"},
        {label:"用户别名",value:"sn"},
        {label:"邮箱EMail",value:"mail"},
        {label:"手机号码",value:"mobile"},
        {label:"职位名称",value:"departmentNumber"},
        {label:"所属部门",value:"ou"},
        {label:"用户UID",value:"uidNumber"},
        {label:"用户GID",value:"gidNumber"},
        {label:"用户公钥",value:"sshPublicKey"},
        {label:"用户目录",value:"homeDirectory"},
        {label:"字段归属",value:"objectClass"},
        {label:"锁定时间",value:"pwdAccountLockedTime"},
        {label:"备注/描述",value:"description"}],
      currExportFields:[]
    }
  }
  showHideUserDrawer = (type,userdn) => {
    let {classobjects,loadedDrawer,modifyDrawer,modifydata} = this.state
    let {userlist} = this.props
    let dispDrager={loadedDrawer:!loadedDrawer}
    let moddata
    if(userdn!=="" && modifydata===""){
      Object.keys(userlist).filter(i=> userlist[i].includes(userdn)).map(i=>{
        moddata={userdn,data:userlist[i][1]}
        return i
      })
    }
    if(type==='update'){
      dispDrager={
        modifyDrawer:!modifyDrawer,
        modifydata:modifydata?"":moddata
      }
    }
    if(classobjects===""){
      const { dispatch } = this.props;
      dispatch({type:'users/getLDAPClassList',callback:(data)=>{
        this.setState({
          classobjects: data,
          ...dispDrager
        });
      }})
    }else{
      this.setState(dispDrager)
    }
  }
  onSelectChange=(selectedRowKeys)=>{
    this.setState({ selectedRowKeys });
  }
  confirmDeletion=(userkeys)=>{
    const {dispatch}=this.props
    dispatch({type:'users/postLDAPDeleteUser',payload: {userdn:userkeys},callback:(data)=>{
      dispatch({type:'users/getUserList'})
      this.setState({selectedRowKeys:[]})
    }})
  }
  onLockUnLockUser=(lock)=>{
    const {dispatch}=this.props
    dispatch({type:'users/postLDAPLockUnlockUser',payload: {...lock},callback:(data)=>{
      dispatch({type:'users/getUserList'})
    }})
  }
  handleExportUsersToCSV=(ulist,fields)=>{
    exportUserDatas(ulist,fields)
  }
  handleDisplayModal=(record)=>{
    const {dispatch}=this.props
    if(!this.state.displayuser && record.hasOwnProperty('userdn')){
      this.setState({
        displayuser:!this.state.displayuser,
        userinfo:record
        })
      const userdn=record.userdn.split(',')[0]
      dispatch({type:'users/getUserAttribute',payload:userdn,callback:(data)=>{
        this.setState({
          userinfo:data[1]
          })
      }})
    }else{
      this.setState({
        displayuser:!this.state.displayuser,
        userinfo:{}
        })
    }
  }
  handleExportChoiseFields=(v)=>{
    this.setState({currExportFields:v})
  }
  render(){
    const {selectedRowKeys,loadedDrawer,modifyDrawer,modifydata,classobjects,exportFields,currExportFields}=this.state
    const {userlist,loading,dispatch}=this.props
    const data = [];
    Object.keys(userlist).map(it=>{
      data.push({
        uid: userlist[it][1].uid[0],
        sn: userlist[it][1].sn[0],
        ou: userlist[it][1].ou ? userlist[it][1].ou[0]:"",
        mobile: userlist[it][1].mobile ? userlist[it][1].mobile[0]:"",
        givenName: userlist[it][1].givenName ? userlist[it][1].givenName[0]:"",
        cn: userlist[it][1].cn ? userlist[it][1].cn[0]:"",
        mail: userlist[it][1].mail ? userlist[it][1].mail[0]:"",
        departmentNumber: userlist[it][1].departmentNumber ? userlist[it][1].departmentNumber[0]:"",
        pwdAccountLockedTime:userlist[it][1].pwdAccountLockedTime?userlist[it][1].pwdAccountLockedTime:"",
        userdn: userlist[it][0]
      })
      return it
    })
    const tableData=data.filter(i=>{
      return (i.uid.indexOf(this.state.searchFilterVal)>-1 ||
        i.sn.indexOf(this.state.searchFilterVal)>-1 ||
        i.ou.indexOf(this.state.searchFilterVal)>-1 ||
        i.mobile.indexOf(this.state.searchFilterVal)>-1 ||
        i.givenName.indexOf(this.state.searchFilterVal)>-1 ||
        i.cn.indexOf(this.state.searchFilterVal)>-1 ||
        i.mail.indexOf(this.state.searchFilterVal)>-1 ||
        i.departmentNumber.indexOf(this.state.searchFilterVal)>-1 )
    })
    const columns = [{
      title:  ()=><span><Icon type="user" style={{marginRight:2,color:"#188fff"}} />{formatMessage({id:'userlist_table_account'})}</span>,
      dataIndex: 'uid',
      key: 'uid',
      sorter: (a,b)=> a['uid'] < b['uid']?-1:(a['uid'] > b['uid']?1:0),
    }, {
      title: ()=><span><Icon type="user" style={{marginRight:2,color:"#188fff"}} />{formatMessage({id:'userlist_table_username'})}</span>,
      dataIndex: 'sn',
      key: 'sn',
      sorter: (a,b)=> a['sn'] < b['sn']?-1:(a['sn'] > b['sn']?1:0),
    }, {
      title: ()=><span><Icon component={useralias} style={{marginRight:2,color:"#188fff"}} />{formatMessage({id:'userlist_table_cn'})}</span>,
      dataIndex: 'cn',
      key: 'cn',
      sorter: (a,b)=> a['cn'] < b['cn']?-1:(a['cn'] > b['cn']?1:0),
    },{
      title: ()=><span>
      <Icon type="phone" theme="twoTone" style={{marginRight:2}} />
        {formatMessage({id:'userlist_table_mobile'})}
      </span>,
      dataIndex: 'mobile',
      key: 'mobile',
      sorter: (a,b)=> a['mobile'] < b['mobile']?-1:(a['mobile'] > b['mobile']?1:0),
    },{
      title: formatMessage({id:'userlist_table_department'}),
      dataIndex: 'departmentNumber',
      key: 'departmentNumber',
      sorter: (a,b)=> a['departmentNumber'] < b['departmentNumber']?-1:(a['departmentNumber'] > b['departmentNumber']?1:0),
    },{
      title: ()=><span>
      <Icon type="apartment" style={{marginRight:2,color:"#188fff"}} />
        {formatMessage({id:'userlist_table_ou'})}
      </span>,
      dataIndex: 'ou',
      key: 'ou',
      sorter: (a,b)=> a['ou'] < b['ou']?-1:(a['ou'] > b['ou']?1:0),
    }, {
      title: ()=><span>
        <Icon type="mail" theme="twoTone" style={{marginRight:2}} />
          {formatMessage({id:'userlist_table_email'})}
        </span> ,
      dataIndex: 'mail',
      key: 'mail',
      sorter: (a,b)=> a['mail'] < b['mail']?-1:(a['mail'] > b['mail']?1:0),
    },{
      title: formatMessage({id:'userlist_table_action'}),
      dataIndex: 'mail_notification',
      key: 'mail_notification',
      width:120,
      align:"center",
      render:(text,record)=>{
        const username=record[record['userdn'].split(',')[0].split('=')[0]]
        return <ResetButtonGroup 
          restpassworddata={{userdn:record['userdn'],username, email: record['mail']}} 
          restsshkeyddata = {
            { username,
              email: record['mail'],
              userdn: record['userdn'],
              writetable:true
            }
          }
          dispatch={dispatch} />
      }
    },{
      title: ()=><span><Icon type="clock-circle" style={{marginRight:2,color:"#188fff"}}/>{formatMessage({id:'userlist_table_status'})}</span>,
      dataIndex: 'pwdAccountLockedTime',
      key: 'pwdAccountLockedTime',
      width: 65,
      align:"center",
      render:(text)=>{
          return <Tooltip placement = "top"
          title = {
            text===""?formatMessage({id:'userlist_table_status_value'}):
              formatMessage(
                {id:'userlist_table_status_value_lock'},
                {locktime:formatTimeAndZone(text[0])}
              )
          }
          arrowPointAtCenter >
                  {text===""?(<Icon className={usercss.user_list_unlock} type="check-circle" />):
                  (<Icon className={usercss.user_list_lock} type="issues-close" />)}
              </Tooltip>
      }
    },{
      title:()=><span><Icon type="box-plot" theme="twoTone" /> {formatMessage({id:'userlist_table_operation'})}</span>,
      key: 'action',
      align: 'center',
      width:115,
      render: (text, record) => {
        return (
          <UserEditButton 
            delkey={record['userdn']} 
            pwdAccountLockedTime={record.pwdAccountLockedTime}
            onLockUnLockUser={this.onLockUnLockUser.bind(this)}
            showHideUserDrawer={this.showHideUserDrawer.bind(this)} 
            confirmDeletion={this.confirmDeletion} />
        )
      }
    }];
    return (
      <Layout className={usercss.userbody}>
        <CMDBBreadcrumb route={{'menu.side.users.ldap':"",breadcrumb_users_list:'/user'}} title='breadcrumb_users_list' />
        <Layout style={{margin:"10px 0 0 0"}}>
          <Content className={usercss.tableContent}>
            <div className={usercss.usercontrol}>
              <div style={{float:"right"}}>
                <Alert message={formatMessage({id:'userlist_table_select_user'},{usercount:selectedRowKeys.length})} 
                  style={{padding: "5px 30px 4px 37px"}}
                  icon={<Icon type='user' style={{top:9}} />}
                  type={selectedRowKeys.length > 0 ? "success" : "info"} showIcon />
              </div>
            <Input.Search
                allowClear
                placeholder={formatMessage({id:'userlist_table_search'})}
                onChange={e => {
                  this.setState({searchFilterVal:e.target.value})
                }}
                onBlur={()=>{
                  this.setState({searchWidth:150})
                }}
                onFocus={()=>{
                  this.setState({searchWidth:250})
                }}
                style={{ width: this.state.searchWidth,transition:"all .2s ease-out",float:"right",marginRight:15 }}
              />
            <Button type="primary" 
              loading={loading.effects['users/getLDAPClassList']} 
              onClick={this.showHideUserDrawer.bind(this)} >
                <Icon type="user-add" />{formatMessage({id:'userlist_table_adduser'})}
            </Button>
            <Popover placement="right" 
              overlayStyle={{width:430}}
              title={<div style={{textAlign: "center"}} >导出用户字段选择</div>} 
              content={<div style={{padding: 8}}>
                <Checkbox.Group
                  options={exportFields}
                  value={currExportFields}
                  onChange={this.handleExportChoiseFields.bind(this)}
                />
                <Divider style={{margin: "10px 0px"}} />
                <Button type="primary" size="small" block 
                  icon="download" 
                  disabled={currExportFields.length>0?false:true}
                  onClick={this.handleExportUsersToCSV.bind(this,userlist,currExportFields)}
                  >导出</Button>
              </div>} trigger="click">
                <Button type="dashed" icon="download">{formatMessage({id:'userlist_useredit_exportuser'})}</Button>
            </Popover>
              { loadedDrawer?<DrawerAddUser 
                    showHideUserDrawer={this.showHideUserDrawer.bind(this)} 
                    dispatch={dispatch}
                    userselect={data}
                    loading={this.props.loading}
                    classobjects={classobjects} />:""
              }
              { modifyDrawer?<DrawerUpdateUser 
                showHideUserDrawer={this.showHideUserDrawer.bind(this)} 
                dispatch={dispatch}
                modifydata={modifydata}
                userselect={data}
                loading={this.props.loading}
                classobjects={classobjects} />:""
              } 
            {selectedRowKeys.length > 0 ? (
              <UserBatchButton confirmDeletion={this.confirmDeletion} delkeys={selectedRowKeys}/>
            ):""}
            </div>
            <Table pagination={{
                size:"small",
                showSizeChanger:true,
                showQuickJumper:true,
                defaultPageSize:15,
                pageSizeOptions:["15","30","45"]
              }} 
              rowKey='userdn'
              hasData 
              loading={loading.effects['users/getUserList']} 
              size='small'
              bodyStyle={{margin:"0px"}}
              style={{minWidth:1200}}
              rowSelection={{
                selectedRowKeys,
                onChange: this.onSelectChange.bind(this),
              }}
              onRow={(record)=>{
                return {
                  onDoubleClick: this.handleDisplayModal.bind(this,record),   
                }
              }}
              columns={columns} 
              dataSource={tableData} />
          </Content>
          <UserInfo visible={this.state.displayuser} 
            loading={this.props.loading}
            userinfo={this.state.userinfo} handleDisplayModal={this.handleDisplayModal.bind(this)} />
        </Layout>
      </Layout>)
  }
}

CMDBUserList.propTypes={
  userlist: PropTypes.object,
  loading: PropTypes.object
}
export default CMDBUserList;