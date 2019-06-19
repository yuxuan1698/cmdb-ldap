
'use strict'
import {connect} from 'dva';
import {PureComponent} from 'react'
import CMDBBreadcrumb from "../components/Breadcrumb";
import {Layout,Table,Tooltip,Tag,Input,Icon,Cascader } from 'antd';
import CMDBSelectRegions from "./components/SelectRegions"
import {formatMessage} from 'umi/locale';
import { formatAliCloundTime } from 'utils'
import css from './index.less'
import linuxlogo from './linux.png'
const {
  Content
} = Layout;
@connect(({ loading }) => ({ loading }))
class CMDBSystemSetting extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      ecslist:[],
      total:0,
      page:1,
      pageSize:15,
      region:'cn-shenzhen',
      selectedRowKeys:[],
      regions:[],
      regionNames:{},
      Tags:[]
    }
  }
  handleAliCloundSetRegion=(regions)=>{
    this.setState({...regions})
  }
  handleAliCloundRegionChange(region){
    const {dispatch}=this.props
    const {page,pageSize}=this.state
    let payload={page,pageSize,region}
    dispatch({type:'equipment/getAliCloundEcsList',payload,callback:(data)=>{
      this.setState(Object.assign({...data},payload))
    }})
  }
  handleAliCloundEcsList=(page,pageSize)=>{
    const {dispatch}=this.props
    let payload={page,pageSize,region:this.state.region}
    let Tags=[]
    dispatch({type:'equipment/getAliCloundEcsList',payload,callback:(data)=>{
      let tmp={}
      data.ecslist.map(i=>{
        if(i.hasOwnProperty('Tags')){
          i.Tags.Tag.map(s=>{
            if(tmp.hasOwnProperty(s.TagKey) && tmp[s.TagKey]!==undefined){
              tmp[s.TagKey]=Array.from(new Set([...tmp[s.TagKey],s.TagValue===""?s.TagKey:s.TagValue]))
            }else{
              tmp[s.TagKey]=[s.TagValue===""?s.TagKey:s.TagValue]
            }
            console.log([s.TagValue===""?s.TagKey:s.TagValue])
            console.log(tmp[s.TagKey])
          })
        }
      })
      Object.keys(tmp).map(n=>{
        let tt={label:n,value:n}
        if(tmp[n]) tt['children']=tmp[n].map(k=>{return {label:k,value:k} })
        Tags.push(tt)
      })
      this.setState(Object.assign({...data,Tags},payload))
    }})
  }
  handleAliCloundRegions(){
    const {dispatch}=this.props
    const {pageSize,page,region}=this.state
    dispatch({type:'equipment/getAliCloundRegionsList',callback:(data)=>{
      let regionNames={}
      Object.values(data).map(i=>regionNames[i.RegionId]=i.LocalName)
      this.setState({regions:Object.values(data),regionNames:regionNames})
      this.handleAliCloundEcsList(page,pageSize,region)
    }})
  }
  componentDidMount(){
    const {pageSize,page,region}=this.state
    if(this.state.regions.length===0){
       this.handleAliCloundRegions()
    }else{
      this.handleAliCloundEcsList(page,pageSize,region)
    }
  }
  onSelectChange=(selectedRowKeys)=>{
    this.setState({selectedRowKeys})
  }
  handleCascaderChange(e){
    console.log(e)
  }
  render(){
    const {
      ecslist,
      pageSize,
      total,
      region,
      selectedRowKeys,
      regions,
      regionNames,
      Tags
    } = this.state
    console.log(Tags)
    const {loading}=this.props
    const columns = [
        {
        title: '实例名称/ID',
        key: 'InstanceId',
        width:180,
        dataIndex: 'InstanceId',
        sorter: (a,b)=> a['InstanceId'] < b['InstanceId']?-1:(a['InstanceId'] > b['InstanceId']?1:0),
        onCell: () => {
          return {
            style: {
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer'
            }
          }
        },
        render: (text, record) => < Tooltip placement = "top"
        title = {
          `实例ID:${record.InstanceId}`
        } > {
          <span style={{fontSize:12}}>{text}<br/ >({record.InstanceName})</span>
        } </Tooltip>
      },
      {
        title: '实例状态',
        width: 100,
        key: 'Status',
        dataIndex: 'Status',
        sorter: (a,b)=> a['Status'] < b['Status']?-1:(a['Status'] > b['Status']?1:0),
        onCell: () => {
          return {
            style: {
              textAlign: "center"
            }
          }
        },
        render: (text) => {
          if (text) {
            return text === 'SUCCESS' ? <Tag color = "#87d068" > {
              text
            } </Tag>:<Tag color="green" style={{
              padding: "0px", 
              borderRadius: 18}} > 
              < Icon type = 'play-circle'
                style = {{float: "left",
                    margin: 2,
                    fontSize: 16}} /> 
            < span style = {{marginRight: 4}} > {
              text
            } </span> </Tag >
          }
        }
      },
      {
        title: '产品到期时间',
        key: 'ExpiredTime',
        width:190,
        dataIndex: 'ExpiredTime',
        sorter: (a,b)=> a['ExpiredTime'] < b['ExpiredTime']?-1:(a['ExpiredTime'] > b['ExpiredTime']?1:0),
        render:(text,record)=>{
          if(text){
            let diff_day=formatAliCloundTime(new Date(),text)
            return <Tooltip placement = "top" 
                    title={()=><div style={{fontSize:12}}>剩余 { diff_day<30?<span style={{color:"red"}}>{diff_day}</span>:diff_day } 天</div>} > 
                      <div> { formatAliCloundTime(text) } 到期</div>
                      <div> 剩余 { diff_day<30?<span style={{color:"red"}}>{diff_day}</span>:diff_day } 天 </div>
                  </Tooltip>
          }
        }
      },
      {
        title: '公网/内网IP',
        key: 'NetworkInterfaces',
        dataIndex: 'NetworkInterfaces',
        render: (text,record) => {
          if (text) {
            return <Tooltip placement = "top"
                    title={<div style={{fontSize:12}}>(私){record.NetworkInterfaces.NetworkInterface.map(i=>i.PrimaryIpAddress).join('、')}</div>}
                    >
                {record.PublicIpAddress.IpAddress.length>0?<div>(公){record.PublicIpAddress.IpAddress}</div>:""} 
                <div>(私){record.NetworkInterfaces.NetworkInterface.map(i=>i.PrimaryIpAddress).join('、')}</div> 
            </Tooltip> 
          }
        }
      },
      {
        title: '配置参数',
        key: 'Cpu',
        dataIndex: 'Cpu',
        sorter: (a,b)=> a['Cpu'] < b['Cpu']?-1:(a['Cpu'] > b['Cpu']?1:0),
        onCell: () => {
          return {
            style: {
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer'
            }
          }
        },
        render: (text,record) => {
          if (text) {
            return <Tooltip placement = "top"
                      title = {()=>{
                          return <div style={{fontSize:12}}>{text} vCPU / {parseInt(record.Memory/1024,10) }GiB / {record.InternetMaxBandwidthOut}Mbps(峰值)<br/>
                          {record.InstanceType}</div>
                        }
                      } >
                      {text} vCPU / {parseInt(record.Memory/1024,10) }GiB / {record.InternetMaxBandwidthOut}Mbps(峰值)<br/>
                      {record.InstanceType}
                    </Tooltip>
            }
          }
      },
      {
        title: '系统类型',
        key: 'OSType',
        dataIndex: 'OSType',
        sorter: (a,b)=> a['OSType'] < b['OSType']?-1:(a['OSType'] > b['OSType']?1:0),
        render: (text,record) => {
          if (text) {
            return <div>
                <div>{record.OSName}</div>
                <div>{text==='linux'?<span>{text}<img src={linuxlogo} /></span>:text}(
                  {record.InstanceChargeType==='PrePaid'?"预付费":record.InstanceChargeType})</div>
              </div>
            }
          }
      },
      {
        title: '主机名称',
        key: 'HostName',
        dataIndex: 'HostName',
        sorter: (a,b)=> a['HostName'] < b['HostName']?-1:(a['HostName'] > b['HostName']?1:0),
      },
      {
        title: '主机标签',
        key: 'Tags',
        dataIndex: 'Tags',
        filterDropdown:()=>{
          return <Cascader options={Tags} 
            expandTrigger="hover"
            autoFocus
            // style={{margin:2}}
            suffixIcon={<Icon type="tags" theme="twoTone" />}
            onChange={this.handleCascaderChange.bind(this)} 
            placeholder="请选择过滤标签" />
        },
        // filters: [{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }],
        render: (text,record) => {
          if (text) {
            return record.Tags.Tag.map(i=>{
              return <Tag key={i.TagValue+""+Math.random()} color={i.TagValue==='prod'?"blue":"cyan"}>{i.TagValue===""?i.TagKey:i.TagValue}</Tag>
            })
            }
          }
      },
      {
        title: '区域/区域组',
        key: 'RegionId',
        width:120,
        dataIndex: 'RegionId',
        sorter: (a,b)=> a['RegionId'] < b['RegionId']?-1:(a['RegionId'] > b['RegionId']?1:0),
        render: (text,record) => {
          if (text) {
            return <div>
              <div>{regionNames.hasOwnProperty(text)?regionNames[text]:text}</div>
              <div>{record.ZoneId}</div>
            </div>
            }
          }
      },
      {
        title: '监控',
        key: 'qq',
        width:60,
        dataIndex: 'qq',
        
        render: (text) => {
            return <div style={{textAlign:"center"}}>
              <Tooltip placement="top"
                title={<div style={{fontSize:12}}>查看监控数据</div>} >
                  <Icon type='line-chart' style={{fontSize:16,cursor:"pointer",color:"green"}} />
                  <Icon type='line-chart' style={{fontSize:16,cursor:"pointer",color:"green"}} />
                </Tooltip>
              
            </div>
          }
      },
    ];
    return (
      <Layout >
        <CMDBBreadcrumb 
          route={{
            'menu.side.resource':"",
            equipment_host_list:'/system/cronlogs'
          }} 
          title='equipment_host_list_manager' />
          <Content className={css.aliecs_extra_css}>
            <Table pagination={{
                size:"small",
                showSizeChanger:true,
                showQuickJumper:true,
                defaultPageSize:pageSize,
                total:total,
                pageSize:pageSize,
                pageSizeOptions:["15","30","45"],
                onChange:this.handleAliCloundEcsList.bind(this),
                onShowSizeChange:this.handleAliCloundEcsList.bind(this)
              }} 
              rowKey={record=>record.InstanceId}
              title={()=><div>
                  <Input.Search
                    allowClear
                    placeholder={formatMessage({id:'userlist_table_search'})}
                    style={{ transition:"all .2s ease-out",width:300,float:"right" }}
                  /><strong>区域选择:</strong><CMDBSelectRegions 
                    loading={loading} 
                    region={region} 
                    regions={regions}
                    handleAliCloundRegionChange={this.handleAliCloundRegionChange.bind(this)} 
                    handleAliCloundSetRegion={this.handleAliCloundSetRegion.bind(this)} 
                    />
                  </div>
                }
              bordered
              bodyStyle={{margin:"0px"}}
              columns={columns} 
              dataSource={ecslist} 
              rowSelection={{
                selectedRowKeys,
                onChange: this.onSelectChange.bind(this),
              }}
              loading={Boolean(loading.effects['equipment/getAliCloundEcsList'])}
              size="middle" />
          </Content>
      </Layout>
      )
  }
}

export default CMDBSystemSetting;