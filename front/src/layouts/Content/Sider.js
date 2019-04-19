import { PureComponent } from 'react';
import {
  Layout,Icon,Menu
} from 'antd'
import classnames from 'classnames';
import css from '../index.less';
const Sider =Layout.Sider;
const SubMenu = Menu.SubMenu;
class CMDBSider extends PureComponent {
  render(){
    let {collapsed,toggleSideMenu}=this.props
    return (
        <Sider 
          className={css.sider}
          collapsed={collapsed}
          breakpoint={'lg'}
          onBreakpoint={toggleSideMenu}
          // onCollapse={toggleSideMenu}

        >
          <div className={classnames({[css.logo]:true,[css.logoToggle]:collapsed})} />
          <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub3']}
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
        >
          <Menu.Item key="1">
            <Icon type="pie-chart" />
            <span>Option 1</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="desktop" />
            <span>Option 2</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="inbox" />
            <span>Option 3</span>
          </Menu.Item>
          <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </SubMenu>
        </Menu>
        </Sider>
      )
  }
  }
export default CMDBSider