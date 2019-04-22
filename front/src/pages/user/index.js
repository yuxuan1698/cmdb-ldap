'use strict'
import {connect} from 'dva';
import {PureComponent} from 'react'
import { Breadcrumb,Table,Divider,Icon,Button,Menu,Dropdown,Alert } from 'antd';
import Link from 'umi/link';
import usercss from "./user.less";
import CMDBBreadcrumb from "../components/Breadcrumb";
const ButtonGroup = Button.Group;

const columns = [{
  title: '用户名',
  dataIndex: 'uid',
  key: 'uid',
  sorter:()=>{},
}, {
  title: '姓名',
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
  title: '部门',
  dataIndex: 'ou',
  key: 'ou',
}, {
  title: '邮箱',
  dataIndex: 'mail',
  key: 'mail',
}, {
  title: "动作",
  key: 'action',
  align: 'center',
  width:150,
  render: (text, record) => (
    <span>
      <a href="javascript:;">修改</a>
      <Divider type="vertical" />
      <a href="javascript:;">锁定</a>
      <Divider type="vertical" />
      <a href="javascript:;">删除</a>
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

@connect(({ users, loading }) => ({ users, loading }))
class CMDBUserList extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      selectedRowKeys: []
    }
  }
  onSelectChange=(selectedRowKeys)=>{
    this.setState({ selectedRowKeys });
  }
  render(){
    const {selectedRowKeys}=this.state
    console.log(selectedRowKeys)
    const {userlist}=this.props.users
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
              <Alert message={`当前选中${selectedRowKeys.length}个用户`} type="success" showIcon />
            </div>
            <Button type="primary">
              <Icon type="plus" />添加用户
            </Button>
            <Dropdown overlay={menu}>
              <Button >
                批量操作<Icon type="down" />
              </Button>
            </Dropdown>
          </div>
          <Table pagination={{size:"small",showSizeChanger:true,showQuickJumper:true,defaultPageSize:15,pageSizeOptions:[15,30,45]}} 
            hasData 
            loading={this.props.loading.global} 
            size='small' 
            bodyStyle={{margin:0}}
            rowSelection={{
              selectedRowKeys,
              columnWidth:40,
              onChange: this.onSelectChange.bind(this),
            }}
            columns={columns} 
            dataSource={data} />
        </div>
      </div>)
  }
}

export default CMDBUserList;