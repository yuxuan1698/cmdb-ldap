'use strict'

import {PureComponent} from 'react'

class CMDBBase extends PureComponent {
  constructor(props){
    super(props)
  }
  render(){
    return <div style={{width:"100%"}}><h1 class="company_info">物必达运维管理平台</h1></div>
  }
}

export default CMDBBase;
