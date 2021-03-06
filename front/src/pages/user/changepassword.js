'use strict'

import {PureComponent} from 'react'
import {
  Form, Input, Button,Icon,notification,message
  } from 'antd';
import { connect } from 'dva';
// 国际化
import { formatMessage } from 'umi/locale'; 
import {isNotAuthChangerPassword} from 'utils'
// 
@connect(({ login, loading }) => ({ login, loading }))
@Form.create()
class CMDBChangePassword extends PureComponent {
  constructor(props){
    super(props)
    this.state={}
  }
  handleReset(){
    this.props.form.resetFields()
  }
  handleRelogin(){
    const {dispatch}=this.props
    dispatch({type:'login/logoutAction'})
  }
  handleConfirmPassword(rule, value, callback){
    const { getFieldValue} = this.props.form;
    if (value && value !== getFieldValue('newpassword')) {
      callback(formatMessage({ id:'user.changepassword.passdiff'}));
    } else {
      callback();
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let { dispatch,location } = this.props
        let payload={data:values}
        if(isNotAuthChangerPassword(location)){
          let { query } = location
          payload['headers']={'Authorization':`${query.tokenPrefix} ${query.token}`}
        }
        dispatch({ 
          type: 'users/changePasswordAction',
          payload: payload,
          callback:(data)=>{
            this.handleReset()
            notification.success({
              message: formatMessage({id:'userlist_userreset_success'}),
              description: formatMessage({id:'user.changepassword.success.msg'},{status:data.status})
            })
          setTimeout(this.handleRelogin.bind(this),1000)
          }
        })
      }
    });
  }
  componentDidMount=()=>{
    const {location,login }=this.props
    if(Object.keys(login.userinfo).length>0 && Object.keys(location.query).length>0){
      message.warn('你有登陆CMDB管理平台，只能修改登陆的用户名的密码。',20)
    }
  }
  render(){
    const { loading,location,login,form }=this.props
    const currUser=Object.keys(login.userinfo).length>0?login.userinfo:location.query
    const { getFieldDecorator } = form;
    const formItemLayout = {
        labelCol: {
          xs: { span: 7 },
          sm: { span: 7 },
          md: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 16 },
          sm: { span: 14 },
          md: { span: 12 },
        },
        onSubmit: this.handleSubmit.bind(this)
      };
    return (
      <div style={{ width: "60%",margin: "60px auto" }}>
        <Form {...formItemLayout} >
          <Form.Item hasFeedback
            label={`${formatMessage({ id: 'user.changepassword.username' })}:`} >
            {getFieldDecorator('username', {
              initialValue: currUser.username,
              rules: [
                { required: true, message: formatMessage({ id: 'user.changepassword.username' }) }
              ],
            })(
              <Input disabled
                prefix={<Icon type="user"  />}
                placeholder={formatMessage({ id: 'user.changepassword.username' })} />
            )}
          
          </Form.Item>
          <Form.Item label={`${formatMessage({ id: 'user.changepassword.oldpassword' })}:`} >
            {getFieldDecorator('oldpassword', {
              validateFirst: true,
              rules: [
                { 
                  required: true, 
                  message: formatMessage({ id: 'user.changepassword.oldpassword' }) 
                },
                {
                  min: 6, 
                  message: formatMessage({id: 'user.changepassword.newpasslen' }) 
                },
              ],
            })(
              <Input.Password prefix={<Icon type="unlock" theme="twoTone" />}
                placeholder={formatMessage({ id: 'user.changepassword.oldpassword' })} />
            )}
          </Form.Item>
          <Form.Item label={`${formatMessage({ id: 'user.changepassword.newpassword' })}:`} >
            {getFieldDecorator('newpassword', {
              validateFirst: true,
              rules: [
                { 
                  required: true, 
                  message: formatMessage({ id: 'user.changepassword.newpassword' }) 
                },
                {
                  min: 6,
                  message: formatMessage({ id: 'user.changepassword.newpasslen' })
                },
              ],
            })(
              <Input.Password prefix={<Icon type="lock" theme="twoTone" />}
                placeholder={formatMessage({ id: 'user.changepassword.newpassword' })} />
            )}
          </Form.Item>
          <Form.Item 
            label={`${formatMessage({ id: 'user.changepassword.repassword' })}:`} >
            {getFieldDecorator('repassword', {
              validateFirst: true,
              rules: [
                { 
                  required: true, 
                  message: formatMessage({ id: 'user.changepassword.repassword' }) 
                },
                {
                  min: 6,
                  message: formatMessage({ id: 'user.changepassword.newpasslen' })
                },
                {
                  validator: this.handleConfirmPassword.bind(this),
                  // message: "两次密码不一致。"
                },
              ],
            })(
              <Input.Password prefix={<Icon type="lock" theme="twoTone" />}
                placeholder={formatMessage({ id: 'user.changepassword.repassword' })} />
            )}
          </Form.Item>
        <Form.Item
          wrapperCol={{
            lg: { span: 24 },
          }}
          style={{textAlign:"center"}}
        >
          <Button 
            style={{marginRight:10}}
            htmlType="reset" 
              onClick={this.handleReset.bind(this)}>
                {formatMessage({ id: 'user.changepassword.reset' })}
          </Button>
          <Button loading={Boolean(loading.global)}
            type="primary"
            htmlType="submit">
            {formatMessage({ id: 'user.changepassword.submit' })}
          </Button>
        </Form.Item>
      </Form>
      </div>)
  }
}

export default CMDBChangePassword;