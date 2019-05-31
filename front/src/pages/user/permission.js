'use strict'

import { PureComponent } from 'react'
import { Layout, Tree, Input, Spin, Icon, Empty } from 'antd';
import { connect } from 'dva';
import { Resizable } from 'react-resizable';
import PropTypes from 'prop-types';
import usercss from "./user.less";
import CMDBBreadcrumb from "../components/Breadcrumb";
import dynamic from 'umi/dynamic';


const {
  Content, Sider
} = Layout;
const { TreeNode, DirectoryTree } = Tree;
const { Search } = Input;

const CMDBSeletPermission = dynamic({
  loader: () => import('./components/selectPermission'),
  loading: (e) => {
    return null
  },
})

@connect(({ loading,users }) => ({ loading,userlist: users.userlist }))
class CMDBLdapPermission extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      width: 280,
      searchValue: "",
      selectdata: "",
      loadedData: {},
      selectKey: "",
      classobjects: "",
    }
  }
  handleFlushAndReset = () => {
    this.setState({
      expandedKeys: [],
      autoExpandParent: false,
      selectdata: "",
    })
  }
  componentWillMount(){
    let {userlist,dispatch}=this.props
    if(JSON.stringify(userlist) ==="{}"){
      dispatch({type:'users/getUserList'})
    }
  }
  renderTreeNodes = (data, searchValue) => data.filter(i=>{
    let searchText=`${i[1].sn}(${i[1].uid})`
    return searchText.indexOf(searchValue)>-1
  }).map((item) => {
    let searchText=`${item[1].sn}(${item[1].uid})`
    let title = <span className={usercss.permission_user_style} >{searchText}</span>
    if (searchValue) {
      const index = searchText.indexOf(searchValue);
      const beforeStr = searchText.substr(0, index);
      const afterStr = searchText.substr(index + searchValue.length);
      if (index > -1) {
        title = (<span className={usercss.permission_user_style}>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>)
      }
    }
    return <TreeNode disableCheckbox icon={<Icon type='user' /> } isLeaf={true}
       key={item[0]} style={{padding:1}} title={title} dataRef={item} />;
  })
  onResize = (event, { size }) => {
    this.setState({ width: size.width });
  }
  handleOnSelect = (selectKey) => {
    this.setState({selectKey:selectKey[0]})
  }
  handleOnChange = (e) => {
    const value = e.target.value;
    this.setState({
      searchValue: value,
      autoExpandParent: true,
    });
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  render() {
    const { searchValue, width, selectKey } = this.state
    const { loading,userlist,dispatch } = this.props
    return (
      <Layout className={usercss.userbody}>
        <CMDBBreadcrumb route={{ '用户管理': "", '用户权限管理': '/user/permission' }} title='用户权限管理' />
        <Layout style={{ margin: "10px 0 0 0" }}>
          <Resizable axis="x" minConstraints={[260, 260]}
            maxConstraints={[520, 520]}
            height={100}
            width={width} onResize={this.onResize} >
            <Sider width={width} theme="light" >
              <Layout style={{ height: "100%", padding: 5, boxShadow: "0px 0px 3px #dcd8d8" }} >
                <Search style={{ marginBottom: 8 }} placeholder="Search(Key Press)" onChange={this.handleOnChange.bind(this)} />
                <Content className={usercss.ldap_content_box} >
                  <Spin tip="Loading..." spinning={Boolean(loading.effects['users/getUserList'])||Boolean(loading.effects['users/getLDAPUserPermissions'])}>
                    <DirectoryTree 
                      draggable
                      onExpand={this.onExpand.bind(this)}
                      loadedKeys={this.state.loadedKeys}
                      onSelect={this.handleOnSelect.bind(this)}>
                      {this.renderTreeNodes(Object.values(userlist), searchValue)}
                    </DirectoryTree>
                  </Spin>
                </Content>
              </Layout>
            </Sider> 
          </Resizable>
          <Content className={usercss.right_content_class}>
            <CMDBSeletPermission
              loading={loading}
              dispatch={dispatch}
              selectKey={selectKey} /> 
          </Content>
        </Layout>
      </Layout>
    )
  }
}

CMDBLdapPermission.propTypes = {
  userlist: PropTypes.object
};

export default CMDBLdapPermission;