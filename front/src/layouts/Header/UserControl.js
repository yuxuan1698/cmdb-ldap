import {PureComponent} from 'react';

import {
    Menu,Avatar,Dropdown, Icon,Modal
  } from 'antd'
import css from '../index.less';
// 国际化
import {formatMessage,setLocale} from 'umi/locale';
import router from 'umi/router';
import {isNotAuthChangerPassword} from 'utils'
const {Item,Divider}=Menu


class CMDBUserControl extends PureComponent{
  constructor(props){
    super(props)
    this.state={modal:false}
  }
  userMenuAction({key}){
    switch(key){
      case 'logout':
        Modal.confirm({
          title: formatMessage({id:'login.loginout.title'}),
          content: formatMessage({id:'login.loginout.msg'},{nickname:this.props.login.userinfo.nickname}),
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
  }
  onLogoutHandle(){
    const {dispatch} =this.props
    dispatch({
      type: 'login/logoutAction',
    });
    Modal.destroyAll()
  }
  
  componentWillMount() {
    const {login} =this.props
    if (!login.islogin) {
      router.push('/login')
    }
  }
  componentWillReceiveProps(nextProps){
    const {login,location} =nextProps
    const {historyPath,historyParse}=login
    if(!login.islogin){
      if(!isNotAuthChangerPassword(location))
        router.push({
          pathname:'/login',
          query:{from: historyPath,...historyParse}
        })
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
            <Icon type={item.icon}  />{item.name}
          </Item>
        }else{
          return <Divider key={item+Math.random()}/>
        }
      })}
    </Menu>)
    const nickname = userinfo.nickname ? userinfo.nickname.substring(0, 1).toUpperCase():""
    return (
      <Dropdown  overlay={userMenu}  placement="bottomRight">
        <span className={css.headerControlMenu}>
          <span>
            <Avatar className={css.userAvater}>{nickname}</Avatar>
            <span className={css.userLogined}>
              {userinfo.nickname}
              <small>({userinfo.username})</small>
            </span>
          </span>
        </span>
      </Dropdown>
      )
  }
}

export default CMDBUserControl