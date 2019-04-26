'use strict'

import {connect} from 'dva';
import {PureComponent} from 'react'
import { Table, Icon, Button, Alert } from 'antd';
import usercss from "./user.less";
import CMDBBreadcrumb from "../components/Breadcrumb";
import dynamic from 'umi/dynamic';
import {UserEditButton,UserBatchButton} from '../components/UserEditButton'

let DrawerAddUser = dynamic({
  loader: () => import('../components/addUser'),
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
      classobjects:""
    }
  }
  showHideUserAddDrawer = () => {
    if(this.state.classobjects===""){
      const { dispatch } = this.props;
      dispatch({type:'users/getLDAPClassList',callback:(data)=>{
        this.setState({
          loadedDrawer: !this.state.loadedDrawer,
          classobjects: data
        });
      }})
    }else{
      this.setState({
        loadedDrawer: !this.state.loadedDrawer,
      });
    }
    
  };
  onSelectChange=(selectedRowKeys)=>{
    this.setState({ selectedRowKeys });
  }
  onDeleteUser(){
    alert()
  }
  render(){
    const {selectedRowKeys}=this.state
    const {userlist,loading,dispatch}=this.props
    const data = [];
    const userselect=[]
    Object.keys(userlist).map(it=>{
      userselect.push({
          uid: userlist[it].uid[0],
          sn: userlist[it].sn[0]}
        )
      data.push({
        uid: userlist[it].uid[0],
        sn: userlist[it].sn[0],
        ou: userlist[it].ou?userlist[it].ou[0]:"",
        mobile: userlist[it].mobile?userlist[it].mobile[0]:"",
        givenName: userlist[it].givenName?userlist[it].givenName[0]:"",
        cn: userlist[it].cn?userlist[it].cn[0]:"",
        mail:userlist[it].mail[0]
      })
    })
    const columns = [{
      title: '用户名',
      dataIndex: 'uid',
      key: 'uid',
      sorter:()=>{},
    }, {
      title: '用户姓名',
      dataIndex: 'sn',
      key: 'sn',
    }, {
      title: '别名',
      dataIndex: 'cn',
      key: 'cn',
    },{
      title: '手机号码',
      dataIndex: 'mobile',
      key: 'mobile',
    },{
      title: '所属部门',
      dataIndex: 'ou',
      key: 'ou',
    }, {
      title: '邮箱',
      dataIndex: 'mail',
      key: 'mail',
    }, {
      title: '创建时间',
      dataIndex: 'createtime',
      key: 'createtime',
    }, {
      title: "动作",
      key: 'action',
      align: 'center',
      width:115,
      render: (text, record) => {
        return <UserEditButton delkey={record['uid']} dispatch={dispatch}/>
        },
    }];
    return (<div className={usercss.userbody}>
        <CMDBBreadcrumb route={{'用户管理':"",'用户列表':'/user/'}} title='用户列表' />
        <div className={usercss.tableContent}>
          <div className={usercss.usercontrol}>
            <div style={{float:"right"}}>
              <Alert message={`当前选中${selectedRowKeys.length}个用户`} 
              type={selectedRowKeys.length > 0 ? "success" : "info"} showIcon />
            </div>
          <Button type="primary" 
            loading={loading.effects['users/getLDAPClassList']} 
            onClick={this.showHideUserAddDrawer.bind(this)} >
              <Icon type="user-add" />添加用户
            </Button>
            { this.state.loadedDrawer?<DrawerAddUser 
                  showHideUserAddDrawer={this.showHideUserAddDrawer.bind(this)} 
                  dispatch={this.props.dispatch}
                  userselect={userselect}
                  loading={this.props.loading}
                  classobjects={this.state.classobjects} />:""
            }
          
          {selectedRowKeys.length > 0 ? (
            <UserBatchButton delkeys={selectedRowKeys}/>
          ):""}
          </div>
          <Table pagination={{
              size:"small",
              showSizeChanger:true,
              showQuickJumper:true,
              defaultPageSize:15,
              pageSizeOptions:["15","30","45"]
            }} 
            rowKey='uid'
            hasData 
            loading={loading.effects['users/getUserList']} 
            size='small'
            // bordered 
            bodyStyle={{margin:0}}
            rowSelection={{
              selectedRowKeys,
              onChange: this.onSelectChange.bind(this),
            }}
            columns={columns} 
            dataSource={data} />
        </div>
      </div>)
  }
}

export default CMDBUserList;