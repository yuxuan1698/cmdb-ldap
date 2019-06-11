import {connect} from 'dva';
import { PureComponent,Fragment } from 'react';
import {
  Layout,Icon
} from 'antd';
import classnames from "classnames";
import CMDBLanguage from './Language';
import CMDBUserControl from './UserControl';
import CMDBMessages from './Messages';
import {isLoginPageAction,isNotAuthChangerPassword} from 'utils'
import css from '../index.less';
const {Header} =Layout;


@connect(({ login,dispatch }) => ({ login,dispatch }))
class CMDBHeader extends PureComponent {
  render(){
    let {toggleSideMenu,collapsed,location,login,dispatch}=this.props
    const currLogin = isLoginPageAction(location) || isNotAuthChangerPassword(location)
    return (
      <Header className={classnames({ [css.headerbox]: true, [css.headerlogined]: !currLogin })}>
        <div style={{ float: "right" }}>
          {!currLogin ? (
            <Fragment>
              <CMDBMessages />
              <CMDBUserControl login={login} dispatch={dispatch} location={Location}  />
            </Fragment>
          ) : ""}
          <CMDBLanguage />
        </div>
        {!currLogin?(
        <span className={css.headerControlMenu} onClick={toggleSideMenu}>
          <Icon type={collapsed?"menu-unfold":"menu-fold"}/>
        </span>
        ):""}
      </Header>
    )
  }
  }
export default CMDBHeader