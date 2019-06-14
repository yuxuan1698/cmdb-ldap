
'use strict'
import {connect} from 'dva';
import {PureComponent} from 'react'
import CMDBBreadcrumb from "../components/Breadcrumb";
import {Layout,Table,Tooltip,Popover,Tag,Input } from 'antd';
import {formatMessage} from 'umi/locale';
import css from './index.less'
const {
  Content
} = Layout;


const columns = [
  {
    title:"ID",
    key:"ID",
    width:40,
    dataIndex:"id",
    onCell: () => {
      return {
        style: {
          textAlign:"center"
        }
      }
    },
  },
  {
    title: '任务名称/ID',
    key:'task_name',
    dataIndex: 'task_name',
    sorter:()=>{},
    onCell: () => {
      return {
        style: {
          maxWidth: 160,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow:'ellipsis',
          cursor:'pointer'
        }
      }
    },
    render: (text,record) => <Tooltip placement="top" title={`任务ID:${record.task_id}`}>{text}</Tooltip>
  },
  {
    title: '执行状态',
    width: 100,
    key: 'status',
    dataIndex: 'status',
    sorter: (a, b) => a.status > b.status,
    onCell: () => {
      return {
        style: {
          textAlign:"center"
        }
      }
    },
    render: (text) => {
      if(text){
          return text==='SUCCESS'?<Tag color="#87d068">{text}</Tag>:<Tag color="#f50">{text}</Tag>
      }
    }
  },
  {
    title: '完成时间',
    key: 'date_done',
    sorter:()=>{},
    width:210,
    onCell: () => {
      return {
        style: {
          maxWidth: 120,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow:'ellipsis',
          cursor:'pointer'
        }
      }
    },
    dataIndex: 'date_done',
  },
  {
    title: '任务参数',
    key: 'task_args',
    dataIndex: 'task_args',
    sorter:()=>{},
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow:'ellipsis',
          cursor:'pointer'
        }
      }
    },
    render: (text) => {
      if(text){
        return text.length>50?<Popover placement="topLeft" 
          title={'任务参数'} 
          content={text}
          overlayStyle={{maxWidth:650}}>
            {text}
        </Popover>:<Tooltip placement="top" 
          title={text}>{text}</Tooltip>
      }
    }
  },
  {
    title: '返回内容',
    key: 'result',
    dataIndex: 'result',
    sorter:()=>{},
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow:'ellipsis',
          cursor:'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
  },
  {
    title: '执行错误内容',
    key: 'traceback',
    dataIndex: 'traceback',
    sorter:()=>{},
    onCell: () => {
      return {
        style: {
          maxWidth: 180,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow:'ellipsis',
          cursor:'pointer'
        }
      }
    },
    render: (text) => {
      if(text){
        return <Popover placement="left" 
          title={'执行错误内容'} 
          content={text} 
          trigger="click"
          overlayStyle={{maxWidth:650,}}>
            {text}
        </Popover>
      }
    }
  },
];
@connect(({ loading }) => ({ loading }))
class CMDBSystemSetting extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      data:[],
      resultTotal:0,
      page:1,
      pageSize:15
    }
  }
  handleGetData=(page,pageSize)=>{
    const {dispatch}=this.props
    const payload={page,pageSize}
    dispatch({type:'system/getSystemCronLogs',payload,callback:(data)=>{
      let newState={data:[]}
      if(data.hasOwnProperty('total')){
        newState['resultTotal']=data.total
      }
      if(data.hasOwnProperty('list')){
        data.list.map(it=>{
          newState['data'].push(it.fields)
        })
      }
      this.setState(Object.assign(newState,payload))
    }})
  }
  componentDidMount=()=>{
    const {pageSize,page}=this.state
    this.handleGetData(page,pageSize)
  }
  
  render(){
    const {data,pageSize,resultTotal}=this.state
    const {loading}=this.props
    return (
      <Layout >
        <CMDBBreadcrumb 
          route={{
            breadcrumb_system_setting:"",
            breadcrumb_system_crontablogs:'/system/cronlogs'
          }} 
          title='breadcrumb_system_crontablogs' />
          <Content className={css.tableContent}>
            <div style={{
                padding: "3px 0px 10px 18px",
                height: 45
              }}>
            <Input.Search
                allowClear
                placeholder={formatMessage({id:'userlist_table_search'})}
                style={{ width: this.state.searchWidth,transition:"all .2s ease-out",float:"right",marginRight:15 }}
              />
            </div>
            <Table pagination={{
                size:"small",
                showSizeChanger:true,
                showQuickJumper:true,
                defaultPageSize:pageSize,
                total:resultTotal,
                pageSize:pageSize,
                pageSizeOptions:["15","30","45"],
                onChange:this.handleGetData.bind(this),
                onShowSizeChange:this.handleGetData.bind(this)
              }} 
              bordered
              bodyStyle={{margin:"0px"}}
              columns={columns} 
              dataSource={data} 
              loading={Boolean(loading.effects['system/getSystemCronLogs'])}
              size="middle" />
          </Content>
      </Layout>
      )
  }
}

export default CMDBSystemSetting;