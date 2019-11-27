import { PureComponent } from 'react';
import {
  Layout,Icon
} from 'antd'
import css from './index.less';
const {Footer} =Layout
class CMDBFooter extends PureComponent {
  render(){
    // let {children}=this.props
    return (
        <Footer className={css.footer}>
          <span>Copyright 2019 <Icon type='copyright'/> 星客有限公司</span>
        </Footer>
      )
  }
  }
export default CMDBFooter