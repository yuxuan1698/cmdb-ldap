import withRouter from 'umi/withRouter';
import {
  Layout, LocaleProvider
} from 'antd';
import {isLoginPageAction} from 'utils'
import css from './index.less';
import { PureComponent } from 'react';
import CMDBContent from './Content/';
import CMDBFooter from './Footer';


import zh_CN from 'antd/lib/locale-provider/zh_CN';
@withRouter
class CMDBLayout extends PureComponent {
  constructor(props){
    super(props)
    this.state={
        collapsed:true,
    }
  }
  toggleSideMenu = (s) => {
    this.setState({
      collapsed: typeof s==='boolean'?s:!this.state.collapsed,
    });
  }
  render(){
    const {children,location}=this.props
    return (
        <LocaleProvider locale={zh_CN}>
          <Layout className={css.mainLayer}>
            <CMDBContent 
              children={children} 
              collapsed={this.state.collapsed}
              toggleSideMenu={this.toggleSideMenu.bind(this)} 
              location={location} />
            {isLoginPageAction(location)?(
              <CMDBFooter />
            ):""}
          </Layout >
        </LocaleProvider>
      )
  }
}

export default CMDBLayout;
