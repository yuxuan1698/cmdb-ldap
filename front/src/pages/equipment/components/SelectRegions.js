
'use strict'

import {PureComponent} from 'react'
import {Select } from 'antd';
import {formatMessage} from 'umi/locale';

const { Option } = Select;


const FLAGS={
  "cn-qingdao":["🇨🇳","中国-青岛"],
  "cn-beijing":["🇨🇳","中国-北京"],
  "cn-zhangjiakou":["🇨🇳","中国-张家口"],
  "cn-huhehaote":["🇨🇳","中国-呼和浩特"],
  "cn-hangzhou":["🇨🇳","中国-杭州"],
  "cn-shanghai":["🇨🇳","中国-上海"],
  "cn-chengdu":["🇨🇳","中国-成都"],
  "cn-shenzhen":["🇨🇳","中国-深圳"],
  "cn-hongkong":["🇭🇰","中国-香港"],
  "ap-northeast-1":["🇯🇵",],
  "ap-southeast-1":["🇸🇬",],
  "ap-southeast-2":["🇦🇺",],
  "ap-southeast-3":["🇲🇾",],
  "ap-southeast-5":["🇮🇩",],
  "ap-south-1":["🇮🇳",],
  "us-east-1":["🇺🇸",],
  "us-west-1":["🇺🇸",],
  "eu-west-1":["🇬🇧",],
  "me-east-1":["🇸🇦",],
  "eu-central-1":["🇩🇪",]
}
class CMDBSelectRegions extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      regions:[],
    }
  }
  render(){
    const {regions}=this.state
    const {loading,region}=this.props
    return <Select
      showSearch
      style={{ width: 230 }}
      placeholder="请选择一个Regions"
      optionFilterProp="children"
      defaultValue={region}
      loading={Boolean(loading.effects['equipment/getAliCloundRegionsList'])}
      onChange={this.props.handleAliCloundRegionChange.bind(this)}
    >
    {this.props.regions.map(it=>{
      return <Option key={it.RegionId} style={{fontSize:14}} value={it.RegionId}>
      {FLAGS.hasOwnProperty(it.RegionId)?<span style={{fontSize:18,paddingTop:1,float:"left"}}>{FLAGS[it.RegionId][0]}</span>:""}
      {it.LocalName}{(FLAGS.hasOwnProperty(it.RegionId) && FLAGS[it.RegionId].length>1)?`(${FLAGS[it.RegionId][1]})`:""}
      </Option>}
    )}
    </Select>
  }
}

export default CMDBSelectRegions;