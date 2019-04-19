import {connect} from 'dva';
import {PureComponent} from 'react';

import {
    Menu,Avatar,Dropdown, Icon,Modal
  } from 'antd'
import css from '../index.less';
// 国际化
import {formatMessage} from 'umi/locale';
import router from 'umi/router';
const {Item,Divider}=Menu


@connect(({ login, loading,dispatch }) => ({ login, loading,dispatch }))
class CMDBUserControl extends PureComponent{
  constructor(props){
    super(props)
    this.state={modal:false}
  }
  userMenuAction({key}){
    switch(key){
      case 'logout':
        const modal = Modal.confirm({
          title: '退出登陆提示',
          content: `${this.props.login.userinfo.nickname}-您确定要退出系统吗？`,
          // centered:true,
          onCancel: ()=>{Modal.destroyAll()},
          onOk:this.onLogoutHandle.bind(this)
        });
        break;
      case 'unlock':
        router.push('/user/changepassword')
        break;
      case 'setting':
        router.push('/system/setting')
        break;
      case 'user':
        router.push('/user/center')
        break;
    }
    if(key==='logout'){
      
    }
  }
  onLogoutHandle(){
    const {dispatch} =this.props
    dispatch({
      type: 'login/logoutAction',
    });
    Modal.destroyAll()
  }
  componentWillReceiveProps(nextProps){
    if(!nextProps.login.islogin){
      router.push('/login')
    }
  }
  render(){
    const userinfo=this.props.login.userinfo
    const userMenuAttr=[
      {name: formatMessage({id:'header.user.menu.center'}),icon:'user',disp:true},
      {name: formatMessage({id:'header.user.menu.changepass'}),icon:'unlock',disp:true},
      "----",
      {name: formatMessage({id:'header.user.menu.setting'}),icon:'setting',disp:true},
      "----",
      {name: formatMessage({id:'header.user.menu.exit'}),icon:'logout',disp:true}
    ]
    let userMenu=(<Menu onClick={this.userMenuAction.bind(this)} >
      {userMenuAttr.map(item => {
        if(typeof(item)==='object'){
          return <Item key={item.icon} >
            <Icon type={item.icon} />{item.name}
          </Item>
        }else{
          return <Divider key={item+Math.random()}/>
        }
      })}
    </Menu>)
    return (
      <Dropdown  overlay={userMenu}  placement="bottomRight">
        <span className={css.headerControlMenu}>
          <span>
            <Avatar icon='user' style={{ backgroundColor: '#138a64' }}/>
            <span style={{marginLeft:8,fontSize:16}}>{userinfo.nickname}({userinfo.username})</span>
          </span>
        </span>
      </Dropdown>
      )
  }
}

export default CMDBUserControl