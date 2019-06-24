'use strict'
import {connect} from 'dva';
import {PureComponent} from 'react'
import {Row,Col,Statistic,Card,Icon} from 'antd'


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
      }
    }
  }
  componentWillMount=()=>{
    const {dispatch}= this.props
    dispatch({type:'global/loadAllStatus',callback:(cerificate)=>{
      this.setState({cerificate})
    }})
  }
  render(){
    const {Issued,WillExpired,Expired,Checking}=this.state.cerificate
    return <div style={{width:"100%"}}>
      <div style={{ background: '#ECECEC', padding: '10px' }}>
        <Row gutter={8}>
          <Col span={12}>
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
