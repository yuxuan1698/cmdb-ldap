  import { PureComponent } from 'react';
  import {
    Layout,Icon,Menu
  } from 'antd'
  import classnames from 'classnames';
  import css from '../index.less';
  import Link from 'umi/link';
  import {formatMessage} from 'umi/locale';

  const Sider =Layout.Sider;
  const SubMenu = Menu.SubMenu;

  const sideMenu=[
    {
      key: '/',
      name: formatMessage({id:'menu.side.myhome'}),
      icon:'home',
      allow: true,
    },
    {
      key:'user',
      name: formatMessage({id:'menu.side.users'}),
      icon: 'user',
      allow: true,
      submenu:[
        {
          key: '/user',
          name:formatMessage({id:'menu.side.users.list'}),
        },
        {
          key: '/user/permission',
          name:formatMessage({id:'menu.side.users.perm'})
        },
        {
          key: '/user/ldap',
          name:formatMessage({id:'menu.side.users.ldap'})
        },
      ]
    },
    {
      key:'equipment',
      name: formatMessage({id:'menu.side.resource'}),
      icon: 'edit',
      allow: true,
      submenu:[
        {
          key: '/equipment/',
          name:formatMessage({id:'menu.side.resource.device'}),
          // allow: false,
        },
        {
          key: '/equipment/groups',
          name:formatMessage({id:'menu.side.resource.monitor'}),
        },
      ]
    },
    {
      key:'system',
      name: formatMessage({id:'menu.side.system'}),
      icon: 'exception',
      allow: true,
      submenu:[
        {
          key: '/system/setting',
          name:formatMessage({id:'menu.side.system.setting'}),
          // allow: false,
        },
        {
          key: '/system/systemlog',
          name:formatMessage({id:'menu.side.system.logs'}),
          // allow: false,
        },
        {
          key: '/system/cronlogs',
          name:formatMessage({id:'breadcrumb_system_crontab'}),
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
        subpath: [pathname]
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
          menuItem = (<SubMenu key={it.key} 
          title={
            <span>
              {it.icon?<Icon type={it.icon} />:""}
              <span>{it.name}</span>
            </span>}>
            {childMenu}
          </SubMenu>)
        }else{
          menuItem = (<Menu.Item key={it.key}>
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
    componentWillReceiveProps(nextProps){
      let {pathname}=this.props.location
      let nextpathname=nextProps.location.pathname
      if(pathname!==nextpathname && nextpathname!==''){
        this.setState({
          parentpath:[nextpathname==='/'?nextpathname:nextpathname.split('/')[1]],
          subpath: [nextpathname]
        })
      }
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
            selectedKeys={this.state.subpath}
            openKeys={this.state.parentpath}
            mode="inline"
            theme="light"
            inlineCollapsed={collapsed}
            onOpenChange={openKeys=>{
              this.setState({parentpath:openKeys})
            }} >
            {this.initSideMenu(sideMenu)}
          </Menu>
        </Sider>)}
    }
  export default CMDBSider