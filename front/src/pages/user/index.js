'use strict'
import {connect} from 'dva';
import {PureComponent} from 'react'
import { Table, Icon, Button, Menu, Dropdown, Alert, Tooltip } from 'antd';
// import Link from 'umi/link';
import usercss from "./user.less";
import CMDBBreadcrumb from "../components/Breadcrumb";
import dynamic from 'umi/dynamic';


const ButtonGroup = Button.Group;

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
  dataIndex: 'givenName',
  key: 'givenName',
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
  render: (text, record) => (
    <span>
      <ButtonGroup size="small">
        <Tooltip placement="topLeft" title={'编辑用户'} >
          <Button type="Default" icon="edit" />
        </Tooltip>
        <Tooltip placement="top" title='锁定用户' >
          <Button type="Default" icon="lock" />
        </Tooltip>
        <Tooltip placement="topRight" title='删除用户' >
          <Button type="danger" icon="delete" />
        </Tooltip>
      </ButtonGroup>
    </span>
  ),
}];

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" >批量删除</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item>
      <a target="_blank" >批量锁定</a>
    </Menu.Item>
    <Menu.Item>
      <a >批量解锁</a>
    </Menu.Item>
  </Menu>
);

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
  render(){
    const DrawerAddUser = dynamic({ 
        loader: () => import('../components/addUser'),
        loading:(e)=>{
          return null
        }
      })
    const {selectedRowKeys}=this.state
    const userlist=this.props.userlist
    const data = [];
    Object.keys(userlist).map(it=>{
      data.push({
        uid: userlist[it].uid[0],
        sn: userlist[it].sn[0],
        ou: userlist[it].ou?userlist[it].ou[0]:"",
        mobile: userlist[it].mobile?userlist[it].mobile[0]:"",
        givenName: userlist[it].givenName?userlist[it].givenName[0]:"",
        mail:userlist[it].mail[0]
      })
    })
    return (<div className={usercss.userbody}>
        <CMDBBreadcrumb route={{'用户管理':"",'用户列表':'/user/'}} title='用户列表' />
        <div className={usercss.tableContent}>
          <div className={usercss.usercontrol}>
            <div style={{float:"right"}}>
              <Alert message={`当前选中${selectedRowKeys.length}个用户`} 
              type={selectedRowKeys.length > 0 ? "success" : "info"} showIcon />
            </div>
          <Button type="primary" 
            loading={this.props.loading.global} 
            onClick={this.showHideUserAddDrawer.bind(this)} >
              <Icon type="user-add" />添加用户
            </Button>
            {
              this.state.loadedDrawer?<DrawerAddUser 
                  dispatch={this.props.dispatch}
                  showHideUserAddDrawer={this.showHideUserAddDrawer.bind(this)} 
                  classobjects={this.state.classobjects} />:""
            }
          
          {selectedRowKeys.length > 0 ? (
            <Dropdown overlay={menu}>
              <Button >
                批量操作<Icon type="down" />
              </Button>
            </Dropdown>
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
            loading={this.props.loading.global} 
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