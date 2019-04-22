  import { PureComponent } from 'react';
  import {
    Layout,Icon,Menu
  } from 'antd'
  import classnames from 'classnames';
  import css from '../index.less';
  import Link from 'umi/link';
  const Sider =Layout.Sider;
  const SubMenu = Menu.SubMenu;
  class CMDBSider extends PureComponent {
    render(){
      let {collapsed,toggleSideMenu}=this.props
      return (
        <Sider className={css.sider}
                collapsed={collapsed}
                breakpoint={'lg'}
                onBreakpoint={toggleSideMenu}
                // onCollapse={toggleSideMenu}
                >
          <div className={classnames({[css.logo]:true,[css.logoToggle]:collapsed})} />
          <Menu defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub3']}
                mode="inline"
                theme="light"
                inlineCollapsed={collapsed}
                >
            <SubMenu key="sub0" title={
              <span>
                <Icon type="user" />
                <span>用户管理</span>
              </span>}>
              <Menu.Item key="1">
                <Link to='/user/'>用户列表</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to='/user/groups/'>用户组列表</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub1" title={
              <span>
                <Icon type="mail" />
                <span>Navigation One</span>
              </span>}>
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={
              <span>
                <Icon type="appstore" />
                <span>Navigation Two</span>
              </span>}>
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
              </SubMenu>
          </SubMenu>
        </Menu>
      </Sider>)}
    }
  export default CMDBSider