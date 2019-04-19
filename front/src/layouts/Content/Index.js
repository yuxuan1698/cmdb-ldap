import { PureComponent,Fragment } from 'react';
import {
  Layout
} from 'antd'
import CMDBHeader from '../Header/';
import CMDBSider from './Sider';
const {Content} =Layout
class CMDBContent extends PureComponent {
  render(){
    let {
      children,
      collapsed,
      toggleSideMenu,
      location
    }=this.props
    return (
      <Fragment >
        {!location.pathname.match('^/login')?<CMDBSider 
            collapsed={collapsed} 
            toggleSideMenu={toggleSideMenu} />:""}
        <Layout>
            <CMDBHeader location={location} 
            collapsed={collapsed} 
            toggleSideMenu={toggleSideMenu} />
            <Content>
                {children}
            </Content>
        </Layout>
      </Fragment>
      )
  }
  }
export default CMDBContent