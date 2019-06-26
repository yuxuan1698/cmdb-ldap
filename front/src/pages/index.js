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
  dataIndex: 'ExpirationDate',
  key: 'ExpirationDate',
  render:(text,record)=>{
    return <div style={{fontSize:12}}>{formatAliCloundTime(false,record.RegistrationDate,"YYYY年MM月DD日")}~{formatAliCloundTime(false,text,"YYYY年MM月DD日")}</div>
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
  }
  render(){
    const {Issued,WillExpired,Checking}=this.state.cerificate
    const {domains}=this.state
    const {loading}=this.props

    return <div style={{width:"100%"}}>
      <div style={{ background: '#ECECEC', padding: '10px' }}>
      <Row gutter={8}>
          <Col span={12}>
          <Card headStyle={{minHeight:40}} bodyStyle={{padding:"8px 5px"}} title="阿里云ECS主机检测">
              <Col span={8}>
                <Card>
                  <Statistic
                    title="ECS主机数量"
                    value={Issued}
                    suffix="个"
                    valueStyle={{ color: '#3f8600' }}
                    // prefix={<Icon type="arrow-up" />}
                  />
                </Card>
              </Col>
            </Card>
            <Card style={{marginTop:10}} headStyle={{minHeight:40}} bodyStyle={{padding:"8px 5px"}} title="阿里云证书检测">
              <Col span={8}>
                <Card>
                  <Statistic
                    title="已签发的证书"
                    value={Issued}
                    suffix="个"
                    valueStyle={{ color: '#3f8600' }}
                    // prefix={<Icon type="arrow-up" />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="即将过期的证书"
                    value={WillExpired}
                    suffix="个"
                    valueStyle={{ color: '#cf1322' }}
                    // prefix={<Icon type="arrow-up" />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="待申请的证书"
                    value={Checking}
                    valueStyle={{ color: '#3f8600' }}
                    suffix="个"
                  />
                </Card>
              </Col>
            </Card>
          </Col>
          <Col span={12}>
            <Card headStyle={{minHeight:40}} bodyStyle={{padding:"8px 8px"}} title="阿里云域名过期检测">
              <Table columns={columns} 
                showHeader={false} 
                bordered
                size="small"
                loading={Boolean(loading.effects['global/getAliyunDomainList'])}
                bodyStyle={{margin:"0px"}}
                pagination={false}
                dataSource={domains}/>

            </Card>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            
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
