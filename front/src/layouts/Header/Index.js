import { PureComponent,Fragment } from 'react';
import {
  Layout,Icon
} from 'antd';
import classnames from "classnames";
import CMDBLanguage from './Language';
import CMDBUserControl from './UserControl';
import CMDBMessages from './Messages';
import css from '../index.less';
const {Header} =Layout;

class CMDBHeader extends PureComponent {
  render(){
    let {toggleSideMenu,collapsed,location}=this.props
    const currLogin = location.pathname.match('^/login')
    return (
      <Header className={classnames({ [css.headerbox]: true, [css.headerlogined]: !currLogin })}>
        <div style={{ float: "right" }}>
          {!currLogin ? (
            <Fragment>
              <CMDBMessages />
              <CMDBUserControl />
            </Fragment>
          ) : ""}
          <CMDBLanguage />
        </div>
        {!currLogin?(
        <div>
          <span className={css.headerControlMenu} onClick={toggleSideMenu}>
            <Icon type={collapsed?"menu-unfold":"menu-fold"}/>
          </span>
        </div>
        ):""}
      </Header>
    )
  }
  }
export default CMDBHeader