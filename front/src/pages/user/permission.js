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
  Content, Sider, Footer
} = Layout;
const ButtonGroup = Button.Group;
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
  renderTreeNodes = (data, searchValue) => data.filter(i => {
    if (i.children) return true
    if (i.title.indexOf(searchValue) > -1) return true
    return false
  }).map((item) => {
    let title = <span>{item.title}</span>
    if (searchValue) {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      if (index > -1) {
        title = (<span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>)
      }
    }

    if (item.children) {
      return (
        <TreeNode title={title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children, searchValue)}
        </TreeNode>
      );
    }
    return <TreeNode icon={item.isLeaf ? <Icon type='bars' /> : ""} key={item.key} title={title} dataRef={item} />;
  })
  onResize = (event, { size }) => {
    this.setState({ width: size.width });
  }
  handleOnSelect = (selectkey) => {
    const { treeobject } = this.props.groups
    const { loadedData } = this.state
    const { dispatch } = this.props
    if (treeobject.hasOwnProperty(selectkey)) {
      this.setState({
        selectdata: Object.assign(treeobject[selectkey], { selectkey: selectkey }),
      })
    }
    if (loadedData.hasOwnProperty(selectkey)) {
      this.setState({
        selectdata: Object.assign(loadedData[selectkey], { selectkey: selectkey }),
      })
    }
    if (this.state.classobjects === "") {
      dispatch({
        type: 'users/getLDAPClassList', callback: (data) => {
          this.setState({
            classobjects: data
          });
        }
      })
    }
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
    console.log(userlist)
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
                      defaultSelectedKeys={[]}
                      onExpand={this.onExpand.bind(this)}
                      loadedKeys={this.state.loadedKeys}
                      onSelect={this.handleOnSelect.bind(this)}>
                      {this.renderTreeNodes(Object.values(userlist), searchValue)}
                    </DirectoryTree>
                </Content>
                <Footer style={{ padding: 0, }}>
                  <ButtonGroup size="small" >
                    <Button title="添加" style={{ height: 22, fontSize: 10, borderRadius: 0 }} icon='plus' />
                    <Button title="删除" disabled={selectdata ? false : true} style={{ height: 22, fontSize: 10, borderRadius: 0 }} icon='minus' />
                    <Button title="刷新" onClick={this.handleFlushAndReset.bind(this)} style={{ height: 22, fontSize: 10, borderRadius: 0 }} icon='reload' />
                  </ButtonGroup>
                </Footer>
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