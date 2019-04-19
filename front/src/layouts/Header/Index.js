import { PureComponent,Fragment } from 'react';
import {
  Layout,Icon
} from 'antd';
import CMDBLanguage from './Language';
import CMDBUserControl from './UserControl';
import CMDBMessages from './Messages';
import css from '../index.less';
const {Header} =Layout;

class CMDBHeader extends PureComponent {
  render(){
    let {toggleSideMenu,collapsed,location}=this.props
    return (
        <Header>
          {!location.pathname.match('^/login')?(
          <div style={{float:"left"}}>
            <span className={css.headerControlMenu} onClick={toggleSideMenu}>
              <Icon type={collapsed?"menu-unfold":"menu-fold"}/>
            </span>
          </div>
          ):""}
          <div style={{float:"right"}}>
          {!location.pathname.match('^/login')?(
            <Fragment>
              <CMDBMessages />
              <CMDBUserControl />
            </Fragment>
          ):""}
            <CMDBLanguage />
          </div>
        </Header>
        
      )
  }
  }
export default CMDBHeader