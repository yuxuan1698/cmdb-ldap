'use strict'

import {PureComponent} from 'react'
import { Breadcrumb } from 'antd';
import Link from 'umi/link';
import usercss from "./user.less";
class CMDBUserCenter extends PureComponent {
  constructor(props){
    super(props)
  }
  render(){
    return (<div className={usercss.userbody}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to='/' >主页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item >用户管理</Breadcrumb.Item>
          <Breadcrumb.Item >
            <Link to='/user/center/' >个人中心</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>)
  }
}

export default CMDBUserCenter;