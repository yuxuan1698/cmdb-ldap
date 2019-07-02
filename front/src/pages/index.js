'use strict'
import {connect} from 'dva';
import {PureComponent} from 'react'
import {Row,Col,Statistic,Card,Icon,Table} from 'antd'
import { formatAliCloundTime } from 'utils'
const columns = [{
  title: "域名",
  dataIndex: 'DomainName',
  key: 'DomainName',
  render:(text)=>{
    return <div>
      <Icon type="global" style={{color:"blue",marginRight:5}} />{text}
    </div>
  }
}, {
  title: "过期",
  dataIndex: 'ExpirationDated',
  key: 'ExpirationDated',
  render:(text,record)=>{
    return <div style={{fontSize:12}}>{formatAliCloundTime(false,record.RegistrationDate,"YYYY年MM月DD日")}~{formatAliCloundTime(false,record.ExpirationDate,"YYYY年MM月DD日")}</div>
  }
}, {
  title: "剩余天数",
  dataIndex: 'ExpirationDate',
  key: 'ExpirationDate',
  render:(text)=>{
    return <div>还剩<span style={{color:"red"}}>{formatAliCloundTime(new Date(),text)}</span>天</div>
  }
}]
@connect(({ loading }) => ({ loading }))
class CMDBBase extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      cerificate:{
        Issued:0,
        Revoked:0,
        CheckedFail:0,
        Expired:0,
        Checking:0,
        RequestId:0,
        Payed:0,
        WillExpired:0,
      },
      ecs:{
        count:0,
        runCount:0,
        expireWill:0,
      },
      domains:[]
    }
  }
  componentWillMount=()=>{
    const {dispatch}= this.props
    dispatch({type:'global/loadAllStatus',callback:(cerificate)=>{
      this.setState({cerificate})
    }})
    dispatch({type:'global/getAliyunDomainList',callback:(data)=>{
      this.setState({domains:data.Data.Domain})
    }})
    dispatch({type:'global/getAliyunEcsStatusCount',callback:(data)=>{
      this.setState({ecs:data})
    }})
  }
  render(){
    const {Issued,WillExpired,Payed,Checking}=this.state.cerificate
    const {ecs}=this.state
    const {domains}=this.state
    const {loading}=this.props
    console.log(ecs)
    return <div style={{width:"100%"}}>
      <div style={{ background: '#FFF', padding: '10px',boxShadow: "#dcd8d8 0px 0px 3px" }}>
      <Row gutter={8}>
          <Col span={12}>
          <Card headStyle={{minHeight:40}} bodyStyle={{padding:"8px 5px"}} style={{boxShadow: "#dcd8d8 0px 0px 3px"}} title="阿里云ECS主机检测">
          <Col span={8}>
                <Card>
                  <Statistic
                    title="ECS主机数"
                    value={ecs.count}
                    suffix="个"
                    valueStyle={{ color: '#3f8600' }}
                    // prefix={<Icon type="arrow-up" />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="运行ECS的主机"
                    value={ecs.runCount}
                    suffix="个"
                    valueStyle={{ color: '#03A9F4' }}
                    // prefix={<Icon type="arrow-up" />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="即将过期的ECS主机"
                    value={ecs.expireWill}
                    valueStyle={{ color: 'red' }}
                    suffix="个"
                  />
                </Card>
              </Col>
            </Card>
          </Col>
          <Col span={12}>
          <Card style={{boxShadow: "#dcd8d8 0px 0px 3px"}} headStyle={{minHeight:40}} bodyStyle={{padding:"8px 5px"}}  title="阿里云证书检测">
              <Col span={6}>
                <Card>
                  <Statistic
                    title="已签发的"
                    value={Issued}
                    suffix="个"
                    valueStyle={{ color: '#3f8600' }}
                    // prefix={<Icon type="arrow-up" />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="即将过期的"
                    value={WillExpired}
                    suffix="个"
                    valueStyle={{ color: '#cf1322' }}
                    // prefix={<Icon type="arrow-up" />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="等待申请"
                    value={Payed}
                    valueStyle={{ color: '#3f8600' }}
                    suffix="个"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="申请中的..."
                    value={Checking}
                    valueStyle={{ color: '#3f8600' }}
                    suffix="个"
                  />
                </Card>
              </Col>
            </Card>
          </Col>
        </Row>
        <Row gutter={8} style={{marginTop:10}}>
          <Col span={12}>
            <Card headStyle={{minHeight:40}} bodyStyle={{padding:"8px 8px"}} style={{boxShadow: "#dcd8d8 0px 0px 3px"}} title="阿里云域名过期检测">
                <Table columns={columns} 
                  showHeader={false} 
                  bordered
                  size="small"
                  rowKey="DomainName"
                  loading={Boolean(loading.effects['global/getAliyunDomainList'])}
                  bodyStyle={{margin:"0px"}}
                  pagination={false}
                  dataSource={domains}/>

              </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="Idle"
                value={9.3}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix={<Icon type="arrow-down" />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  }
}

export default CMDBBase;
