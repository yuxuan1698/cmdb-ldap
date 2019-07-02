
'use strict'

import {PureComponent} from 'react'
import {Select,Icon } from 'antd';
import {formatMessage} from 'umi/locale';

const { Option } = Select;

class CMDBSelectAccount extends PureComponent {
  constructor(props){
    super(props)
  }
  render(){
    const {aliAccount,currAccount}=this.props
    return <Select
      showSearch
      style={{ width: 170,marginRight:15 }}
      placeholder="请选择阿里帐号"
      autoFocus
      optionFilterProp="children"
      defaultValue={currAccount || 'wbd'}

      // loading={Boolean(loading.effects['equipment/getAliCloundRegionsList'])}
      onChange={this.props.handleAliCloundAccountNameChange.bind(this)}
    >
    {aliAccount.map(it=>{
      // console.log(it)
      return <Option key={it.key} style={{fontSize:14}} value={it.key}>
                <Icon type="aliyun" style={{marginRight:5}} />{it.name}
              </Option>}
    )}
    </Select>
  }
}

export default CMDBSelectAccount;