'use strict'

// 引入组件
import ECharts from 'react-echarts3';
// 引入柱状图
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import moment from 'moment';
import {PureComponent} from 'react';

import {Tooltip,Slider,Popover, DatePicker, Radio,Button, Drawer } from 'antd';

const { RangePicker } = DatePicker;
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
class CMDBMonitorData extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      visible: this.props.showHideMonitor,
      monitortime: 3600,
      StartTime: moment().subtract(3600,'seconds'),
      EndTime: moment()
    }
  }
  
  handleClose=()=>{
    this.setState({visible:!this.state.visible})
    setTimeout(this.props.handleShowHideMonitor,500)
  }
  handleMoniterTimeChange=(e)=>{
    this.setState({
      monitortime: e.target.value,
      StartTime: moment().subtract(parseInt(e.target.value,10),'seconds'),
      EndTime: moment(),
    })
  }
  handleMoniterDateTimeChange=(d,dstr)=>{
    this.setState({
      monitortime: moment(dstr[1]).diff(moment(dstr[0]),'seconds'),
      StartTime: moment(dstr[0]),
      EndTime: moment(dstr[1]),
    })
  }
  disabledDate=(current)=> {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }
  
  disabledDateTime=()=> {
    return {
      disabledHours: () => range(0, 24).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  handleSliderChange=(v)=>{
    if(v>=24){
      let n=parseInt(v/24,10);
      v=n*24;
    }
    this.setState({
      monitortime:v*3600,
      StartTime: moment().subtract(v*3600,'seconds'),
      EndTime: moment(),
    })
  }
  handleMoniterDataGet=()=>{
    let {dispatch,InstanceID,currAccount}=this.props
    let {StartTime,EndTime}=this.state
    dispatch({type:'equipment/getAliCloundEcsMonitorDataList',payload:{
      InstanceID,StartTime:StartTime.format("YYYY-MM-DD HH:mm:ss"),EndTime:EndTime.format("YYYY-MM-DD HH:mm:ss"),currAccount
    },callback:(data)=>{
      console.log(data)
    }})
  }
  componentWillMount=()=>{
    this.handleMoniterDataGet()
  }
  render(){
    const {monitortime,StartTime,EndTime}=this.state
    let hour=parseInt(monitortime/3600,10)
    const option = {
      tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
          orient: 'vertical',
          x: 'left',
          data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
      },
      series: [
          {
              name:'访问来源',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                  normal: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      show: true,
                      textStyle: {
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  }
              },
              labelLine: {
                  normal: {
                      show: false
                  }
              },
              data:[
                  {value:335, name:'直接访问'},
                  {value:310, name:'邮件营销'},
                  {value:234, name:'联盟广告'},
                  {value:135, name:'视频广告'},
                  {value:1548, name:'搜索引擎'}
              ]
          }
      ]
    };
    const marks = {
      1: '',
      6: '',
      12: '',
      18: '',
      24: '',
      48:'',
      72:'',
      168:'',
    };
    return (
      <Drawer
          title={<div>
            <RangePicker
              disabledDate={this.disabledDate}
              size="small"
              allowClear={false}
              style={{width:360,float:"right",marginRight: 20}}
              disabledTime={this.disabledRangeTime}
              showTime={{
                hideDisabledOptions: true,
              }}
              value={[StartTime, EndTime]}
              onChange={this.handleMoniterDateTimeChange.bind(this)}
              format="YYYY-MM-DD HH:mm:ss"
            />
            <Radio.Group size="small"
              value={monitortime} 
              onChange={this.handleMoniterTimeChange}>
              <Radio.Button value={300}>5分</Radio.Button>
              <Radio.Button value={600}>10分</Radio.Button>
              <Radio.Button value={1800}>30分</Radio.Button>
              <Radio.Button value={3600}>1小时</Radio.Button>
            </Radio.Group> 
              <Popover  placement="bottom" title={false} content={
                 <Slider size="small" 
                  marks={marks}
                  value={monitortime>3600?parseInt(monitortime/3600,10):1}
                  step={hour<24?1:24} min={1} max={168}
                  tipFormatter={()=>{
                    return <span>{hour>=24?((hour/24)%7==0?(hour/24)/7:parseInt(hour/24)):hour}{hour<24?"小时":((hour/24)%7==0?"周":"天")}</span>
                  }}
                  defaultValue={1}
                  onChange={this.handleSliderChange}
                  />
                } 
                trigger="click" 
                overlayClassName={"customer_popover_cmdb"}>
                <Button size="small" style={{marginLeft:5}}>其它</Button>
              </Popover>
          </div>}
          // getContainer={false}
          width={750}
          closable={true}
          placement="right"
          onClose={this.handleClose}
          visible={this.state.visible}
        >
          <ECharts height={250} option={option} />
        </Drawer>
      )
  }
}

export default CMDBMonitorData;