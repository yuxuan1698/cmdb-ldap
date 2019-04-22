'use strict'

import {PureComponent} from 'react'
import { Breadcrumb } from 'antd';
import Link from 'umi/link';
import usercss from "./user.less";
import CMDBBreadcrumb from "../components/Breadcrumb";

class CMDBUserGroups extends PureComponent {
  constructor(props){
    super(props)
  }
  render(){
    return (<div className={usercss.userbody}>
      <CMDBBreadcrumb route={{'用户管理':"",'用户组列表':'/user/groups'}} title='用户组列表'  />
        
      </div>)
  }
}

export default CMDBUserGroups;