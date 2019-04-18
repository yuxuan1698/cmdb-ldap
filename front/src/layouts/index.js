import withRouter from 'umi/withRouter';
import {
  Layout, LocaleProvider
} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import { Component } from 'react';
import CMDBSider from './Sider';
import CMDBContent from './Content';
// import css from './index.less';
// import { connect } from 'dva';

const { Content, Sider,Footer } = Layout;



@withRouter
// @connect(({ login, loading }) => ({ login, loading }))
class CMDBLayout extends Component {
  constructor(props){
    super(props)
    this.state={collapsed:false}
  }
  toggleSideMenu = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render(){
    const {children,location}=this.props

    return (
      <LocaleProvider locale={zh_CN}>
        <Layout style={{height:"100%"}}>
        <CMDBContent children={children} />
        </Layout>
      </LocaleProvider>
      )
  }
}

export default CMDBLayout;
