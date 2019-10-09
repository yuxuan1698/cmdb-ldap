'use strict'

// 引入组件
import ECharts from 'react-echarts3';
// 引入柱状图
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { formatByteUnits } from 'utils'

import moment from 'moment';
import {PureComponent} from 'react';

import {message,Slider,Popover, DatePicker, Radio,Button, Drawer } from 'antd';

const { RangePicker } = DatePicker;


class CMDBMonitorData extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      visible: this.props.showHideMonitor,
      monitortime: 3600,
      StartTime: moment().subtract(3600,'seconds'),
      EndTime: moment(),
      MonitorData:{InstanceMonitorData:[]}
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
    setTimeout(this.handleMoniterDataGet,100)
  }
  handleMoniterDateTimeChange=(d,dstr)=>{
    if (dstr[0] === dstr[1]){
      message.error("开始时间不能与结束时间相同。")
      return false
    }
    if (moment(dstr[1]).diff(moment(dstr[0]),'minutes')<10){
      message.error("时间范围小于最小单位10分钟。")
      return false
    }
    this.setState({
      monitortime: moment(dstr[1]).diff(moment(dstr[0]),'seconds'),
      StartTime: moment(dstr[0]),
      EndTime: moment(dstr[1]),
    })
  }
  disabledDate=(current)=> {
    // Can not select days before today and today
    return current && (current > moment().endOf('day') || current<moment().subtract(15,'days'));
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
      if(data.hasOwnProperty('MonitorData')){
        this.setState({...data})
      }
    }})
  }
  componentWillMount=()=>{
    this.handleMoniterDataGet()
  }
  render(){
    const {monitortime,StartTime,EndTime,MonitorData}=this.state
    let hour=parseInt(monitortime/3600,10)
    const cpudata = {
        title: {
          text: 'CPU使用率',
          left: 'center',
          padding:2,
          textStyle:{
            fontSize:14
          },
          color:"#48cda6"
        },
        borderWidth:10,
        grid: {
          left: '48',
          right: '10',
          top: '30',
          bottom: '20',
          borderWidth: 1,
          borderColor:"#48cda6",
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 10
        },
        color:['#48cda6','#fd87ab','#11abff','#ffdf33','#968ade','#48cda6','#fd87ab','#11abff','#ffdf33','#968ade'],
        tooltip: {
            trigger: 'axis',
            padding:2,
            backgroundColor: 'rgba(50,50,50,0.4)',
            textStyle:{
              fontSize:10
            },
            formatter:(v)=>{
              let htmlmsg=`<div><div>${v[0].axisValueLabel}</div>`
              v.map(i=>{
                htmlmsg+=`<div>${i.marker}${i.seriesName}: ${i.data}%</div>`
                return i
              })
              htmlmsg+=`</div>`
              return htmlmsg
            }
        },
        legend: {
            data:['CPU使用率(%)']
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisTick: {show:false},
            axisLabel:{
              fontSize:11
            },
            axisLine:{
              lineStyle:{
                color: "#868686"
              }
            },
            data: MonitorData.InstanceMonitorData.map(i=>moment(i.TimeStamp).format("MM/DD HH:mm"))
        },
        yAxis: {
          axisLabel:{
            fontSize:11,
            formatter: "{value}(%)"
          },
          axisLine: {show:false},
          axisTick: {show:false},
        },
        series: [{
            name: 'CPU',
            type: 'line',
            smooth: true,
            lineStyle:{
                width:1
            },
            showSymbol: false,
            data: MonitorData.InstanceMonitorData.map(i=>i.CPU?i.CPU:0)
        },]
    };
    const iodata = {
        title: {
          text: '磁盘I/O',
          left: 'center',
          padding:2,
          textStyle:{
            fontSize:14
          },
          color:"#48cda6"
        },
        grid: {
          left: '48',
          right: '10',
          top: '30',
          bottom: '20',
          borderWidth: 1,
          borderColor:"#48cda6",
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 10
        },
        color:['#11abff','#ffdf33','#48cda6','#fd87ab','#968ade','#48cda6','#fd87ab','#11abff','#ffdf33','#968ade'],
        tooltip: {
          trigger: 'axis',
          padding:2,
          backgroundColor: 'rgba(50,50,50,0.4)',
          textStyle:{
            fontSize:10
          },
          formatter:(v)=>{
            let htmlmsg=`<div><div>${v[0].axisValueLabel}</div>`
            v.map(i=>{
              htmlmsg+=`<div>${i.marker}${i.seriesName}: ${i.data}次/s</div>`
              return i
            })
            htmlmsg+=`</div>`
            return htmlmsg
          }
        },
        legend: {
            data:['磁盘I/O']
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisTick: {show:false},
            axisLabel:{
              fontSize:11
            },
            axisLine:{
              lineStyle:{
                color: "#868686"
              }
            },
            data: MonitorData.InstanceMonitorData.map(i=>moment(i.TimeStamp).format("MM/DD HH:mm"))
        },
        yAxis: {
          axisLabel:{
            fontSize:11,
            formatter: "{value} (次)"
          },
          axisLine: {show:false},
          axisTick: {show:false},
        },
        series: [{
            name: 'I/O写',
            type: 'line',
            smooth: true,
            lineStyle:{
                width:1
            },
            showSymbol: false,
            data: MonitorData.InstanceMonitorData.map(i=>i.IOPSWrite?i.IOPSWrite:0)
        },{
          name: 'I/O读',
          type: 'line',
          smooth: true,
          lineStyle:{
              width:1
          },
          showSymbol: false,
          data: MonitorData.InstanceMonitorData.map(i=>i.IOPSRead?i.IOPSRead:0)
      }]
    };
    const iobpsdata = {
        title: {
          text: '磁盘BPS',
          left: 'center',
          padding:2,
          textStyle:{
            fontSize:14
          },
          color:"#48cda6"
        },
        grid: {
          left: '65',
          right: '10',
          top: '30',
          bottom: '20',
          borderWidth: 1,
          borderColor:"#48cda6",
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 10
        },
        color:['#11abff','#ffdf33','#48cda6','#fd87ab','#968ade','#48cda6','#fd87ab','#11abff','#ffdf33','#968ade'],
        tooltip: {
            trigger: 'axis',
            padding:2,
            backgroundColor: 'rgba(50,50,50,0.4)',
            textStyle:{
              fontSize:10
            },
            formatter:(v)=>{
              let htmlmsg=`<div><div>${v[0].axisValueLabel}</div>`
              v.map(i=>{
                htmlmsg+=`<div>${i.marker}${i.seriesName}: ${formatByteUnits(i.data)}/s</div>`
                return i
              })
              htmlmsg+=`</div>`
              return htmlmsg
            }
        },
        legend: {
            data:['磁盘BPS']
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisTick: {show:false},
            axisLabel:{
              fontSize:11
            },
            axisLine:{
              lineStyle:{
                color: "#868686"
              }
            },
            data: MonitorData.InstanceMonitorData.map(i=>moment(i.TimeStamp).format("MM/DD HH:mm"))
        },
        yAxis: {
          axisLabel:{
            fontSize:11,
            formatter: (v)=>{
              return formatByteUnits(v)
            }
          },
          axisLine: {show:false},
          axisTick: {show:false},
        },
        series: [{
            name: '磁盘写',
            type: 'line',
            smooth: true,
            lineStyle:{
                width:1
            },
            showSymbol: false,
            data: MonitorData.InstanceMonitorData.map(i=>i.BPSWrite?i.BPSWrite:0)
        },{
          name: '磁盘读',
          type: 'line',
          smooth: true,
          lineStyle:{
              width:1
          },
          showSymbol: false,
          data: MonitorData.InstanceMonitorData.map(i=>i.BPSRead?i.BPSRead:0)
      }]
    };
    const netdata = {
        title: {
          text: '网络IO',
          left: 'center',
          padding:2,
          textStyle:{
            fontSize:14
          },
          color:"#48cda6"
        },
        grid: {
          left: '65',
          right: '10',
          top: '30',
          bottom: '20',
          borderWidth: 1,
          borderColor:"#48cda6",
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 10
        },
        color:['#48cda6','#fd87ab','#11abff','#ffdf33','#968ade','#48cda6','#fd87ab','#11abff','#ffdf33','#968ade'],
        tooltip: {
            trigger: 'axis',
            padding:2,
            backgroundColor: 'rgba(50,50,50,0.4)',
            textStyle:{
              fontSize:10
            },
            formatter:(v)=>{
              let htmlmsg=`<div><div>${v[0].axisValueLabel}</div>`
              v.map(i=>{
                htmlmsg+=`<div>${i.marker}${i.seriesName}: ${formatByteUnits(i.data)}/s</div>`
                return i
              })
              htmlmsg+=`</div>`
              return htmlmsg
            }
        },
        legend: {
            data:['网络IO']
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisTick: {show:false},
            axisLabel:{
              fontSize:11
            },
            axisLine:{
              lineStyle:{
                color: "#868686"
              }
            },
            data: MonitorData.InstanceMonitorData.map(i=>moment(i.TimeStamp).format("MM/DD HH:mm"))
        },
        yAxis: {
          axisLabel:{
            fontSize:11,
            formatter: (v)=>{
              return formatByteUnits(v)
            }
          },
          axisLine: {show:false},
          axisTick: {show:false},
        },
        series: [{
            name: '网络RX',
            type: 'line',
            smooth: true,
            lineStyle:{
                width:1
            },
            showSymbol: false,
            data: MonitorData.InstanceMonitorData.map(i=>i.IntranetRX?i.IntranetRX:0)
        },{
          name: '网络TX',
          type: 'line',
          smooth: true,
          lineStyle:{
              width:1
          },
          showSymbol: false,
          data: MonitorData.InstanceMonitorData.map(i=>i.IntranetTX?i.IntranetTX:0)
      }]
    };
    const netsdata = {
        title: {
          text: '网络平均速率',
          left: 'center',
          padding:2,
          textStyle:{
            fontSize:14
          },
          color:"#48cda6"
        },
        grid: {
          left: '65',
          right: '10',
          top: '30',
          bottom: '20',
          borderWidth: 1,
          borderColor:"#48cda6",
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 10
        },
        color:['#48cda6','#fd87ab','#11abff','#ffdf33','#968ade','#48cda6','#fd87ab','#11abff','#ffdf33','#968ade'],
        tooltip: {
            trigger: 'axis',
            padding:2,
            backgroundColor: 'rgba(50,50,50,0.4)',
            textStyle:{
              fontSize:10
            },
            formatter:(v)=>{
              let htmlmsg=`<div><div>${v[0].axisValueLabel}</div>`
              v.map(i=>{
                htmlmsg+=`<div>${i.marker}${i.seriesName}: ${formatByteUnits(i.data)}/s</div>`
                return i
              })
              htmlmsg+=`</div>`
              return htmlmsg
            }
        },
        legend: {
            data:['网络平均速率']
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisTick: {show:false},
            axisLabel:{
              fontSize:11
            },
            axisLine:{
              lineStyle:{
                color: "#868686"
              }
            },
            data: MonitorData.InstanceMonitorData.map(i=>moment(i.TimeStamp).format("MM/DD HH:mm"))
        },
        yAxis: {
          axisLabel:{
            fontSize:11,
            formatter: (v)=>{
              return formatByteUnits(v)
            }
          },
          axisLine: {show:false},
          axisTick: {show:false},
        },
        series: [{
            name: '内网平均速率',
            type: 'line',
            smooth: true,
            lineStyle:{
                width:1
            },
            showSymbol: false,
            data: MonitorData.InstanceMonitorData.map(i=>i.IntranetBandwidth?i.IntranetBandwidth:0)
        },{
            name: '外网平均速率',
            type: 'line',
            smooth: true,
            lineStyle:{
                width:1
            },
            showSymbol: false,
            data: MonitorData.InstanceMonitorData.map(i=>i.InternetBandwidth?i.InternetBandwidth:0)
        }]
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
              style={{width:310,float:"right",marginRight: 20}}
              disabledTime={this.disabledRangeTime}
              showTime={{
                hideDisabledOptions: true,
              }}
              value={[StartTime, EndTime]}
              onChange={this.handleMoniterDateTimeChange.bind(this)}
              onOk={this.handleMoniterDataGet}
              format={"YYYY-MM-DD HH:mm"}
            />
            <Radio.Group size="small"
              value={monitortime}
              buttonStyle="solid"
              onChange={this.handleMoniterTimeChange}>
              <Radio.Button value={600}>10分</Radio.Button>
              <Radio.Button value={1800}>30分</Radio.Button>
              <Radio.Button value={3600}>1小时</Radio.Button>
              <Radio.Button value={3600*6}>6小时</Radio.Button>
            </Radio.Group> 
              <Popover  placement="bottom" title={false} content={
                 <Slider size="small" 
                  marks={marks}
                  value={monitortime>3600?parseInt(monitortime/3600,10):1}
                  step={hour<24?1:24} min={1} max={168}
                  tipFormatter={()=>{
                    return <span>{hour>=24?((hour/24)%7===0?(hour/24)/7:parseInt(hour/24)):hour}{hour<24?"小时":((hour/24)%7===0?"周":"天")}</span>
                  }}
                  defaultValue={1}
                  onBlur = {
                    this.handleMoniterDataGet
                  }
                  onChange={this.handleSliderChange}
                  />
                } 
                trigger="click" 
                overlayClassName={"customer_popover_cmdb"}>
                <Button size="small"
                  type={hour>6?"primary":"default"}
                  style={{marginLeft:5}}>其它</Button>
              </Popover>
          </div>}
          // getContainer={false}
          width={755}
          closable={true}
          placement="right"
          onClose={this.handleClose}
          visible={this.state.visible} >
          <ECharts width={730} height={170} style={{paddingTop:5,paddingBottom:5,borderRadius:3,border:"1px solid #ccc"}} option={cpudata} />
          <ECharts width={730} height={170} style={{marginTop:5,paddingTop:5,paddingBottom:5,borderRadius:3,border:"1px solid #ccc"}} option={iodata} />
          <ECharts width={730} height={170} style={{marginTop:5,paddingTop:5,paddingBottom:5,borderRadius:3,border:"1px solid #ccc"}} option={iobpsdata} />
          <ECharts width={730} height={170} style={{marginTop:5,paddingTop:5,paddingBottom:5,borderRadius:3,border:"1px solid #ccc"}} option={netdata} />
          <ECharts width={730} height={170} style={{marginTop:5,paddingTop:5,paddingBottom:5,borderRadius:3,border:"1px solid #ccc"}} option={netsdata} />
        </Drawer>
      )
  }
}

export default CMDBMonitorData;