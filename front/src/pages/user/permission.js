'use strict'

import { PureComponent } from 'react'
import { Layout, Tree, Input, Button, Icon, Empty } from 'antd';
import { connect } from 'dva';
import { Resizable } from 'react-resizable';
import PropTypes from 'prop-types';
import usercss from "./user.less";
import CMDBBreadcrumb from "../components/Breadcrumb";
import CMDBLDAPAttribute from "../components/Attribute"

const {
  Content, Sider
} = Layout;
const { TreeNode, DirectoryTree } = Tree;
const { Search } = Input;

@connect(({ users }) => ({ userlist: users.userlist }))
class CMDBLdapPermission extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      width: 250,
      searchValue: "",
      selectdata: "",
      loadedData: {},
      loadedKeys: [],
      classobjects: "",
    }
  }
  handleFlushAndReset = () => {
    this.setState({
      expandedKeys: [],
      autoExpandParent: false,
      selectdata: "",
      loadedKeys: []
    })
  }
  renderTreeNodes = (data, searchValue) => data.map((item) => {
    let title = <span>{item[1].uid}</span>
    if (searchValue) {
      const index = item[1].uid.indexOf(searchValue);
      const beforeStr = item[1].uid.substr(0, index);
      const afterStr = item[1].uid.substr(index + searchValue.length);
      if (index > -1) {
        title = (<span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>)
      }
    }
    return <TreeNode icon={<Icon type='user' /> }
       key={item[0]} style={{padding:1}} title={title} dataRef={item} />;
  })
  onResize = (event, { size }) => {
    this.setState({ width: size.width });
  }
  handleOnSelect = (selectkey) => {
    
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
    const { searchValue, width, classobjects, selectdata } = this.state
    const { userlist } = this.props
    return (
      <Layout className={usercss.userbody}>
        <CMDBBreadcrumb route={{ '用户管理': "", '用户组列表': '/user/ldap/' }} title='用户组列表' />
        <Layout style={{ margin: "10px 0 0 0" }}>
          <Resizable axis="x" minConstraints={[220, 220]}
            maxConstraints={[520, 520]}
            height={100}
            width={width} onResize={this.onResize} >
            <Sider width={width} theme="light" >
              <Layout style={{ height: "100%", padding: 5, boxShadow: "0px 0px 3px #dcd8d8" }} >
                <Search style={{ marginBottom: 8 }} placeholder="Search(Key Press)" onChange={this.handleOnChange.bind(this)} />
                <Content className={usercss.ldap_content_box} >
                    <DirectoryTree 
                      checkable
                      defaultSelectedKeys={[]}
                      onExpand={this.onExpand.bind(this)}
                      loadedKeys={this.state.loadedKeys}
                      onSelect={this.handleOnSelect.bind(this)}>
                      {this.renderTreeNodes(Object.values(userlist), searchValue)}
                    </DirectoryTree>
                </Content>
              </Layout>
            </Sider>
          </Resizable>
          <Content className={usercss.right_content_class}>
            {(classobjects && selectdata) ? <CMDBLDAPAttribute
              selectdata={this.state.selectdata}
              classobjects={classobjects} /> : <Empty className={usercss.right_empty_center} />}
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