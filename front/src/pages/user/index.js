'use strict'

import {connect} from 'dva';
import {PureComponent} from 'react'
import PropTypes from 'prop-types';
import { Table, Icon, Button, Alert,Layout,Input,Tooltip, Modal,notification } from 'antd';
import usercss from "./user.less";
import CMDBBreadcrumb from "../components/Breadcrumb";

import dynamic from 'umi/dynamic';
import {UserEditButton,UserBatchButton} from './components/UserEditButton'
import {formatTimeAndZone} from 'utils'
import {formatMessage} from 'umi/locale';

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
      searchFilterVal:""
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
      this.setState({
        ...dispDrager
      })
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
          userinfo:data[0][1]
          })
      }})
    }else{
      this.setState({
        displayuser:!this.state.displayuser,
        userinfo:{}
        })
    }
  }
  handleResetPassword=(userdn,username)=>{
    Modal.confirm({
      title: formatMessage({id:'userlist_userreset_password'},{username}),
      content: formatMessage({id:'userlist_userreset_password_msg'},{username}),
      onCancel: ()=>{Modal.destroyAll()},
      onOk: ()=>{
        const {dispatch}=this.props
        dispatch({type:'users/resetPasswordAction',payload:{userdn},callback:(data)=>{
          notification.success({
            message: formatMessage({id:'userlist_userreset_success'}),
            description: data.status
          })
        }})
      }
    })
  }
  render(){
    const {selectedRowKeys,loadedDrawer,modifyDrawer,modifydata,classobjects}=this.state
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
      title: formatMessage({id:'userlist_table_account'}),
      dataIndex: 'uid',
      key: 'uid',
      sorter: (a,b)=> a['uid'] < b['uid']?-1:(a['uid'] > b['uid']?1:0),
    }, {
      title: formatMessage({id:'userlist_table_username'}),
      dataIndex: 'sn',
      key: 'sn',
      sorter: (a,b)=> a['sn'] < b['sn']?-1:(a['sn'] > b['sn']?1:0),
    }, {
      title: formatMessage({id:'userlist_table_cn'}),
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
      width:80,
      align:"center",
      render:(text,record)=>{
        const username=record[record['userdn'].split(',')[0].split('=')[0]]
        return <Tooltip placement = "top" 
                title={formatMessage({id:'userlist_table_resetpassword'},{username})} >
                <Button size='small' 
                  type="default" 
                  style={{padding:"0 4px",borderRadius:30}}
                  onClick={this.handleResetPassword.bind(this,record['userdn'],username)}
                  icon='mail'/>
              </Tooltip>

      }
    },{
      title: formatMessage({id:'userlist_table_status'}),
      dataIndex: 'pwdAccountLockedTime',
      key: 'pwdAccountLockedTime',
      width: 50,
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
      title: formatMessage({id:'userlist_table_operation'}),
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