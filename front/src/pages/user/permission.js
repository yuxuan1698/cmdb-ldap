
'use strict'

import {connect} from 'dva';
import {PureComponent} from 'react'
import { Table, Icon, Button, Alert,message } from 'antd';
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
class CMDBPermissionList extends PureComponent {
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
  confirmDeletion=(userkeys)=>{
    const {dispatch}=this.props
    dispatch({type:'users/postLDAPDeleteUser',payload: {userdn:userkeys},callback:(data)=>{
      message.info(data.status)
      dispatch({type:'users/getUserList'})
      this.setState({selectedRowKeys:[]})
    }})
  }
  render(){
    const {selectedRowKeys}=this.state
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
        userdn: userlist[it][0]
      })
    })
    data.sort((a,b)=>{
      if(a.uid>b.uid) return -1
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
        return <UserEditButton delkey={record['userdn']} confirmDeletion={this.confirmDeletion}/>
        },
    }];
    return (<div className={usercss.userbody}>
        <CMDBBreadcrumb route={{'用户管理':"",'用户权限':'/user/permission/'}} title='用户权限管理' />
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
                  userselect={data}
                  loading={this.props.loading}
                  classobjects={this.state.classobjects} />:""
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

export default CMDBPermissionList;