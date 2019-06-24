
'use strict'
import {connect} from 'dva';
import {PureComponent} from 'react'
import CMDBBreadcrumb from "../components/Breadcrumb";
import {Layout,Table,Tooltip,Tag,Input,Icon,Select, notification } from 'antd';
import CMDBSelectRegions from "./components/SelectRegions"
import {formatMessage} from 'umi/locale';
import { formatAliCloundTime } from 'utils'
import css from './index.less'
import linuxlogo from './linux.png'
const {
  Content
} = Layout;
const { Option } = Select;

@connect(({ loading }) => ({ loading }))
class CMDBSystemSetting extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      cerificates:[],
      total:0,
      page:1,
      pageSize:15,
      region:'cn-hangzhou',
      selectedRowKeys:[],
      regions:[],
      regionNames:{},
      currStatus:"ALL",
      searchValue:""
    }
  }
  handleAliCloundSetRegion=(regions)=>{
    this.setState({...regions})
  }
  handleAliCloundRegionChange(region){
    const {page,pageSize}=this.state
    this.handleAliCloundCerificateList(page,pageSize,region)
  }
  handleAliCloundCerificateList=(page,pageSize,region,status)=>{
    const {dispatch}=this.props
    let payload={page,pageSize,region:region?region:this.state.region}
    if(status) payload['status']=status
    dispatch({type:'equipment/getAliCloundCerificateList',payload,callback:(data)=>{
      console.log(data)
      if(data.hasOwnProperty('CertificateList') || data.hasOwnProperty('OrderList')){
        this.setState({
            cerificates:data.CertificateList || data.OrderList,
            total:data.TotalCount,
            page:data.CurrentPage,
            currStatus:status
          })
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
      this.handleAliCloundCerificateList(page,pageSize,region)
    }})
  }
  componentDidMount(){
    const {pageSize,page,region}=this.state
    if(this.state.regions.length===0){
       this.handleAliCloundRegions()
    }else{
      this.handleAliCloundCerificateList(page,pageSize,region)
    }
  }
  onSelectChange=(selectedRowKeys)=>{
    this.setState({selectedRowKeys})
  }
  handleSearchChange=(e)=>{
    this.setState({searchValue:e.target.value})
  }
  handleCerificateStatus=(e)=>{
    const {pageSize,page,region}=this.state
    this.setState({})
    this.handleAliCloundCerificateList(1,pageSize,region,e)
  }
  render(){
    const {
      cerificates,
      pageSize,
      total,
      region,
      selectedRowKeys,
      regions,
      regionNames,
      searchValue
    } = this.state
    const {loading}=this.props
    const columns = [
        {
        title: '证书/ID',
        key: 'Name',
        dataIndex: 'Name',
        sorter: (a,b)=> a['Name'] < b['Name']?-1:(a['Name'] > b['Name']?1:0),
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
          <span style={{fontSize:12}}>{text}<br/ >({record.InstanceId})</span>
        } </Tooltip>
      },
      {
        title: '绑定域名',
        key: 'Domain',
        dataIndex: 'Domain',
        sorter: (a,b)=> a['Domain'] < b['Domain']?-1:(a['Domain'] > b['Domain']?1:0),
      },
      {
        title: '证书状态',
        width: 120,
        key: 'StatusCode',
        dataIndex: 'StatusCode',
        sorter: (a,b)=> a['StatusCode'] < b['StatusCode']?-1:(a['StatusCode'] > b['StatusCode']?1:0),
        onCell:()=>{
          return {
            style:{
              textAlign:"center"
            }
          }
        },
        render:(text,record)=>{
          let diff_day=formatAliCloundTime(new Date(),record.AfterDate)
          if(diff_day<0) {
            return <Tag color="#f50">已过期</Tag>
          }else if(0<=diff_day && diff_day<30 ){
            return <Tag color="orange">即将过期</Tag>
          }else if(record.StatusCode==='ISSUED'){
            return  <Tag color="#2db7f5">已签发</Tag>
          }else if(record.StatusCode==='REVOKED'){
            return  <Tag color="#FF9800">已吊销</Tag>
          }
        }
      },
      {
        title: '证书品牌',
        width: 120,
        key: 'BrandName',
        dataIndex: 'BrandName',
        sorter: (a,b)=> a['BrandName'] < b['BrandName']?-1:(a['BrandName'] > b['BrandName']?1:0),
      },
      {
        title: '产品到期时间',
        key: 'AfterDate',
        width:210,
        dataIndex: 'AfterDate',
        sorter: (a,b)=> a['AfterDate'] < b['AfterDate']?-1:(a['AfterDate'] > b['AfterDate']?1:0),
        render:(text,record)=>{
          if(text){
            let diff_day=formatAliCloundTime(new Date(),text)
            if (record.StatusCode!=='REVOKED' && diff_day>=0){
              return <Tooltip placement = "top" 
                  title={()=><div style={{fontSize:12}}>剩余 { diff_day<30?<span style={{color:"red"}}>{diff_day}</span>:diff_day } 天</div>} > 
                    <div style={{textDecoration:record.StatusCode==='REVOKED'?"line-through":"none"}}> { formatAliCloundTime(text) } 到期</div>
                    <div> 剩余 { diff_day<30?<span style={{color:"red"}}>{diff_day}</span>:diff_day } 天 </div>
                </Tooltip>
            }else{
              return <div>
                <div style={{textDecoration:"line-through"}}> { formatAliCloundTime(text) } 到期</div>
              </div>
            }
           
          }
        }
      },
      {
        title: '购买期限',
        key: 'Year',
        dataIndex: 'Year',
        width:100,
        sorter: (a,b)=> a['Year'] < b['Year']?-1:(a['Year'] > b['Year']?1:0),
        onCell:()=>{
          return {
            style:{
              textAlign:"center"
            }
          }
        },
        render:(text)=>{
          return <strong>{text}年</strong>
        }
      },
      {
        title: '部署检测',
        key: 'deplay',
        dataIndex: 'deplay',
        sorter: (a,b)=> a['deplay'] < b['deplay']?-1:(a['deplay'] > b['deplay']?1:0),
      },
      {
        title: '返回状态',
        key: 'callbackstatus',
        dataIndex: 'callbackstatus',
        sorter: (a,b)=> a['callbackstatus'] < b['callbackstatus']?-1:(a['callbackstatus'] > b['callbackstatus']?1:0),
      },
    ];
    return (
      <Layout >
        <CMDBBreadcrumb 
          route={{
            'menu.side.resource':"",
            equipment_cerificate_list:'/system/cerificate/'
          }} 
          title='equipment_cerificate_list' />
          <Content className={css.aliecs_extra_css}>
            <Table pagination={{
                size:"small",
                showSizeChanger:true,
                showQuickJumper:true,
                defaultPageSize:pageSize,
                total:total,
                pageSize:pageSize,
                pageSizeOptions:["15","30","45"],
                onChange:this.handleAliCloundCerificateList.bind(this),
                onShowSizeChange: this.handleAliCloundCerificateList.bind(this)
              }} 
              rowKey={record=>record.Name}
              title={()=><div>
                  <Input.Search
                    allowClear
                    value={searchValue}
                    onChange={this.handleSearchChange.bind(this)}
                    placeholder={formatMessage({id:'userlist_table_search'})}
                    style={{ transition:"all .2s ease-out",width:300,float:"right" }}
                  />
                  <Select 
                    style={{ width: 150,float:"right",marginRight:10 }}
                    placeholder="请选择证书状态"
                    defaultValue='ALL'
                    onChange={this.handleCerificateStatus.bind(this)}
                    optionFilterProp="children">
                      <Option value='ALL'>全部状态</Option>
                      <Option value='ISSUED'>已签发</Option>
                      <Option value='WILL_EXPIRED'>即将过期</Option>
                      <Option value='EXPIRED'>已经过期</Option>
                      <Option value='REVOKED'>已吊销</Option>
                  </Select>
                  <strong>区域选择:</strong><CMDBSelectRegions 
                    loading={loading} 
                    region={region} 
                    regions={regions}
                    handleAliCloundRegionChange={this.handleAliCloundRegionChange.bind(this)} 
                    />
                  </div>
                }
              bordered
              bodyStyle={{margin:"0px"}}
              columns={columns} 
              dataSource={cerificates.filter(i=>{
                if(searchValue!==""){
                  console.log(i.BrandName)
                  return  i.Domain.indexOf(searchValue)>=0 ||
                          i.InstanceId.indexOf(searchValue)>=0||
                          i.Name.indexOf(searchValue)>=0
                }else{
                  return true
                }
              })} 
              rowSelection={{
                selectedRowKeys,
                onChange: this.onSelectChange.bind(this),
              }}
              loading={Boolean(loading.effects['equipment/getAliCloundCerificateList'])}
              size="middle" />
          </Content>
      </Layout>
      )
  }
}

export default CMDBSystemSetting;