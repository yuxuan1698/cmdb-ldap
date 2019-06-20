
'use strict'
import {connect} from 'dva';
import {PureComponent} from 'react'
import CMDBBreadcrumb from "../components/Breadcrumb";
import {Layout,Table,Tooltip,Tag,Input,Icon,Cascader, notification } from 'antd';
import CMDBSelectRegions from "./components/SelectRegions"
import {formatMessage} from 'umi/locale';
import { formatAliCloundTime } from 'utils'
import css from './index.less'
import linuxlogo from './linux.png'
const {
  Content
} = Layout;
const InstanceStatus={
  'Starting':['启动中','blue','play-circle'],
  'Running':['运行中','green','play-circle'],
  'Stopped':['已停止','red','pause-circle']
}

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
      Tags:[],
      currTag:[],
    }
  }
  handleAliCloundSetRegion=(regions)=>{
    this.setState({...regions})
  }
  handleAliCloundRegionChange(region){
    const {page,pageSize}=this.state
    this.handleAliCloundEcsList(page,pageSize,region)
  }
  handleAliCloundEcsList=(page,pageSize,region)=>{
    const {dispatch}=this.props
    const {currTag}=this.state
    let payload={page,pageSize,region:region?region:this.state.region}
    if(currTag.length>0){
      payload['tagkey']=currTag[0]
      payload['tagvalue']=currTag[1]
      payload['page']=1
    }
    dispatch({type:'equipment/getAliCloundTagsList',payload:{region:payload['region']},callback:(data)=>{
      if(data.hasOwnProperty('Tags')){
        let tagobj={}
        data.Tags.Tag.map(i=>{
          if(tagobj.hasOwnProperty(i.TagKey) && tagobj[i.TagKey].length>0 ){
            tagobj[i.TagKey]=Array.from(new Set([...tagobj[i.TagKey],i.TagValue]))
          }else{
            tagobj[i.TagKey]=[i.TagValue===""?i.TagKey:i.TagValue]
          }
        })
        let Tags=[]
        Object.keys(tagobj).map(s=>{
          let val=tagobj[s]===""?s:tagobj[s]
          let tTags={
            label:s,
            value:s,
            children:tagobj[s].map(k=>{
              return {label:k,value:k}
            })
          }
          Tags.push(tTags)
        })
        this.setState({Tags})
      }else{
        notification.error({
          message:'error',
          description: 'error'
        })
      }
    }})
    dispatch({type:'equipment/getAliCloundEcsList',payload,callback:(data)=>{
      if(data.hasOwnProperty('ecslist')){
        this.setState(Object.assign({...data},payload))
      }else{
        notification.error({
          message:'error',
          description: 'error'
        })
      }
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
    this.setState({currTag:e,currTag:e})
    setTimeout(()=>{
      let {page,pageSize,region}=this.state
      this.handleAliCloundEcsList(page,pageSize,region)
    },100) 
  }
  render(){
    const {
      ecslist,
      pageSize,
      page,
      total,
      region,
      selectedRowKeys,
      regions,
      regionNames,
      Tags,
      currTag
    } = this.state
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
            } </Tag>:<Tag color={InstanceStatus[text][1]} style={{
              padding: "0px", 
              borderRadius: 18}} > 
              < Icon type ={InstanceStatus[text][2]}
                style = {{float: "left",
                    margin: 2,
                    fontSize: 16}} /> 
            < span style = {{marginRight: 4}} > {
              InstanceStatus[text][0]
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
        sorter: (a,b)=> {
          let aip=a.NetworkInterfaces.NetworkInterface.map(s=>s.PrimaryIpAddress).join()
          let bip=b.NetworkInterfaces.NetworkInterface.map(s=>s.PrimaryIpAddress).join()
          return  aip < bip?-1:(aip > bip?1:0)
        },
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
            value={currTag}
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
                current:page,
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
                    />
                    {currTag.length>0?<Tag
                      closable
                      style={{
                          padding: "5px 5px 5px 8px",
                          float: "right"
                        }}
                      color="magenta"
                      onClose={e => {
                        e.preventDefault();
                        this.handleCascaderChange([])
                      }} >
                      {currTag.join(":")}
                    </Tag>:''}
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