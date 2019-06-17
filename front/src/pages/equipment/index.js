
'use strict'
import {connect} from 'dva';
import {PureComponent} from 'react'
import CMDBBreadcrumb from "../components/Breadcrumb";
import {Layout,Table,Tooltip,Popover,Tag,Input,Select } from 'antd';
import CMDBSelectRegions from "./components/SelectRegions"
import {formatMessage} from 'umi/locale';
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
  onCell: () => {
    return {
      style: {
        maxWidth: 100,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        cursor: 'pointer'
      }
    }
  },
  render: (text, record) => < Tooltip placement = "top"
  title = {
    `任务ID:${record.task_id}`
  } > {
    <span style={{fontSize:12}}>{text}<br/ >{record.InstanceName}</span>
  } </Tooltip>
},
{
  title: '实例状态',
  width: 100,
  key: 'status',
  dataIndex: 'status',
  sorter: (a,b)=> a['status'] < b['status']?-1:(a['status'] > b['status']?1:0),
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
      } </Tag>:<Tag color="#f50">{text}</Tag >
    }
  }
},
{
  title: '完成时间',
  key: 'date_done',
  sorter: (a,b)=> a['date_done'] < b['date_done']?-1:(a['date_done'] > b['date_done']?1:0),
  width: 210,
  onCell: () => {
    return {
      style: {
        maxWidth: 120,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        cursor: 'pointer'
      }
    }
  },
  dataIndex: 'date_done',
},
{
  title: '任务参数',
  key: 'task_args',
  dataIndex: 'task_args',
  sorter: (a,b)=> a['task_args'] < b['task_args']?-1:(a['task_args'] > b['task_args']?1:0),
  onCell: () => {
    return {
      style: {
        maxWidth: 180,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        cursor: 'pointer'
      }
    }
  },
  render: (text) => {
    if (text) {
      return text.length > 50 ? < Popover placement = "topLeft"
      title = {
        '任务参数'
      }
      content = {
        text
      }
      overlayStyle = {
          {
            maxWidth: 650
          }
        } > {
          text
        } </Popover>:<Tooltip placement="top" 
      title = {
        text
      } > {
        text
      } </Tooltip>
    }
  }
},
{
  title: '返回内容',
  key: 'result',
  dataIndex: 'result',
  sorter: (a,b)=> a['result'] < b['result']?-1:(a['result'] > b['result']?1:0),
  onCell: () => {
    return {
      style: {
        maxWidth: 180,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        cursor: 'pointer'
      }
    }
  },
  render: (text) => <Tooltip placement = "topLeft"
  title = {
    text
  } > {
    text
  } </Tooltip>
},
{
  title: '执行错误内容',
  key: 'traceback',
  dataIndex: 'traceback',
  sorter: (a,b)=> a['traceback'] < b['traceback']?-1:(a['traceback'] > b['traceback']?1:0),
  onCell: () => {
    return {
      style: {
        maxWidth: 180,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        cursor: 'pointer'
      }
    }
  },
  render: (text) => {
    if (text) {
      return <Popover placement = "left"
      title = {
        '执行错误内容'
      }
      content = {
        text
      }
      trigger = "click"
      overlayStyle = {
          {
            maxWidth: 650,
          }
        } > {
          text
        } </Popover>
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
              rowKey={record=>record.task_id}
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