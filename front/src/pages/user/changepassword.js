'use strict'

import {PureComponent} from 'react'
import {
  Form, Input, Button,Icon
  } from 'antd';
import { connect } from 'dva';

// 国际化
import { formatMessage } from 'umi/locale'; 

// 
@connect(({ login, loading }) => ({ login, loading }))
@Form.create()
class CMDBChangePassword extends PureComponent {
  constructor(props){
    super(props)
  }
  handleReset(e){
    e.preventDefault();
    this.props.form.resetFields()
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
        let { dispatch } = this.props
        dispatch({ 
          type: 'global/changePasswordAction',
          payload: values
        })
      }
    });
  }
  render(){
    const currUser=this.props.login.userinfo
    const { loading }=this.props
    const { getFieldDecorator } = this.props.form;
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
      <div style={{ marginTop: 50 }}>
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