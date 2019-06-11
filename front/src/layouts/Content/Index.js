import { PureComponent,Fragment } from 'react';
import {
  Layout
} from 'antd'

// import { TransitionGroup, CSSTransition } from "react-transition-group";
import CMDBHeader from '../Header/';
import CMDBSider from './Sider';
import {isLoginPageAction,isNotAuthChangerPassword} from 'utils'
const {Content} =Layout
class CMDBContent extends PureComponent {
  render(){
    let {
      children,
      collapsed,
      toggleSideMenu,
      location
    }=this.props
    let currlogin=isLoginPageAction(location) || isNotAuthChangerPassword(location)
    return (
      <Fragment >
        {!currlogin ?<CMDBSider 
            location={location}
            collapsed={collapsed} 
            toggleSideMenu={toggleSideMenu} />:""}
        <Layout>
          <CMDBHeader location={location} 
            collapsed={collapsed} 
            toggleSideMenu={toggleSideMenu} />
          <Content  style={{ overflow: "auto",padding:10,display:"flex"}}>
                {children}
          </Content>
        </Layout>
      </Fragment>
      )
  }
  }
export default CMDBContent