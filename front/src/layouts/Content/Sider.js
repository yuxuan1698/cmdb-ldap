  import { PureComponent } from 'react';
  import {
    Layout,Icon,Menu
  } from 'antd'
  import classnames from 'classnames';
  import css from '../index.less';
  import Link from 'umi/link';
  const Sider =Layout.Sider;
  const SubMenu = Menu.SubMenu;

  const sideMenu=[
    {
      key: '/',
      name: '我的首页',
      icon:'home',
      allow: true,
    },
    {
      key:'user',
      name: '用户管理',
      icon: 'user',
      allow: true,
      submenu:[
        {
          key: '/user/',
          name:'用户列表',
        },
        {
          key: '/user/permission/',
          name:'用户权限'
        },
        {
          key: '/user/ldap/',
          name:'LDAP管理'
        },
      ]
    },
    {
      key:'equipment',
      name: 'IT资源管理',
      icon: 'edit',
      allow: true,
      submenu:[
        {
          key: '/equipment/',
          name:'设备列表',
          // allow: false,
        },
        {
          key: '/equipment/groups/',
          name:'设备监控',
        },
      ]
    },
  ]
  class CMDBSider extends PureComponent {
    constructor(props){
      super(props)
      const {pathname}=this.props.location
      this.state={
        parentpath:[pathname==='/'?pathname:pathname.split('/')[1]],
        subpath: [pathname.replace(/\//g, '')]
      }
    }
    initSideMenu=(arr)=>{
      return arr.filter(it=>{
        if(it.hasOwnProperty('allow')){
          return it.allow
        }
        return true
      }).map(it=>{
        let menuItem=""
        if(it.hasOwnProperty('submenu')){
          const childMenu=this.initSideMenu(it.submenu)
          menuItem = (<SubMenu key={it.key.replace(/\//g, '')} title={
            <span>
              {it.icon?<Icon type={it.icon} />:""}
              <span>{it.name}</span>
            </span>}>
            {childMenu}
          </SubMenu>)
        }else{
          menuItem = (<Menu.Item key={it.key.replace(/\//g, '')}>
            <Link to={it.key}>
              {it.icon?<Icon type={it.icon} />:""}
              <span>
                {it.name}
              </span>
            </Link>
          </Menu.Item>)
        }
        return menuItem
      })
    }
    render(){
      let {collapsed,toggleSideMenu}=this.props
      return (
        <Sider className={css.sider}
                collapsed={collapsed}
                breakpoint={'xl'}
                onBreakpoint={toggleSideMenu}
                >
          <div className={classnames({[css.logo]:true,[css.logoToggle]:collapsed})} />
          <Menu 
                defaultSelectedKeys={this.state.subpath}
                defaultOpenKeys={this.state.parentpath}
                mode="inline"
                theme="light"
                inlineCollapsed={collapsed}
                >
              {this.initSideMenu(sideMenu)}
          </Menu>
        </Sider>)}
    }
  export default CMDBSider