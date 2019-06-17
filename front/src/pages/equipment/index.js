
'use strict'
import {connect} from 'dva';
import {PureComponent} from 'react'
import CMDBBreadcrumb from "../components/Breadcrumb";
import {Layout,Table,Tooltip,Popover,Tag,Input,Select,Icon } from 'antd';
import CMDBSelectRegions from "./components/SelectRegions"
import {formatMessage} from 'umi/locale';
import { formatAliCloundTime } from 'utils'
import css from './index.less'
const {
  Content
} = Layout;
const { Option } = Select;

const columns = [
  {
  title: '实例名称/ID',
  key: 'InstanceId',
  dataIndex: 'InstanceId',
  sorter: (a,b)=> a['InstanceId'] < b['InstanceId']?-1:(a['InstanceId'] > b['InstanceId']?1:0),
  width:150,
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
        padding: "1px", 
        borderRadius: 18}} > 
        < Icon type = 'play-circle'
          style = {
            {
              float: "left",
              margin: 2,
              fontSize: 16
            }
          }
      / > 
      < span style = {
        {
          marginRight: 4
        }
      } > {
        text
      } </span> </Tag >
    }
  }
},
{
  title: '产品到期时间',
  key: 'ExpiredTime',
  dataIndex: 'ExpiredTime',
  sorter: (a,b)=> a['ExpiredTime'] < b['ExpiredTime']?-1:(a['ExpiredTime'] > b['ExpiredTime']?1:0),
  width: 160,
  render:(text,record)=>{
    if(text){
      return <div style={{fontSize:12}} > <span> {
        formatAliCloundTime(text)
      } </span><br /> <span> 剩余 {
        formatAliCloundTime(new Date(),text)
      }
       天 </span></div>
    }
  }
},
{
  title: '公网/内网IP',
  key: 'HostName',
  dataIndex: 'HostName',
  width:100,
  render: (text,record) => {
    if (text) {
      return <div style={{fontSize:12}} > {
        record.PublicIpAddress.IpAddress
      } < br /> < span > (私){
        record.NetworkInterfaces.NetworkInterface[0].PrimaryIpAddress
      } </span> </div >
    }
  }
},
{
  title: '配置',
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
      return <div>{text} vCPU {parseInt(record.Memory/1024,10) }GiB</div>
    }
  }
},
];
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
      selectedRowKeys:[]
    }
  }

  handleAliCloundEcsList=(page,pageSize,region)=>{
    const {dispatch}=this.props
    let payload={page,pageSize}
    if(region) payload=Object.assign({...payload,region})

    dispatch({type:'equipment/getAliCloundEcsList',payload,callback:(data)=>{
      this.setState(Object.assign({...data},payload))
    }})
  }
  componentDidMount(){
    const {pageSize,page,region}=this.state
    this.handleAliCloundEcsList(page,pageSize,region)
  }
  onSelectChange=(selectedRowKeys)=>{
    this.setState({selectedRowKeys})
  }
  render(){
    const {
      ecslist,
      pageSize,
      total,
      region,
      selectedRowKeys
    } = this.state
    console.log(this.state)
    const {loading,dispatch}=this.props
   
    return (
      <Layout >
        <CMDBBreadcrumb 
          route={{
            'menu.side.resource':"",
            equipment_host_list:'/system/cronlogs'
          }} 
          title='equipment_host_list_manager' />
          <Content className={css.tableContent}>
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
              title={()=><div><Input.Search
                  allowClear
                  placeholder={formatMessage({id:'userlist_table_search'})}
                  style={{ transition:"all .2s ease-out",width:300 }}
                /><CMDBSelectRegions dispatch={dispatch} loading={loading} region={region} /></div>
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