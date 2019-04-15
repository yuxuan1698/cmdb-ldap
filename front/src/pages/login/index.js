import login from './login.css'

import { connect } from 'dva';
import { Component }  from 'react'
import {
  Form, Icon, Input, Button, Checkbox,
} from 'antd';

import { request } from '../../utils/request'

function mapStateToProps(state) {  
  return {...state};  
}  

class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={login.loginForm}>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住密码</Checkbox>
          )}
          <a className={login.loginFormForgot} href="">忘记密码</a>
          <Button type="primary" htmlType="submit" className={login.loginFormButton}>
            登  陆
          </Button>
        </Form.Item>
      </Form>
      </div>
    );
  }
}

const LoginFrom = Form.create({ name: 'normal_login' })(Login);
export default connect(mapStateToProps)(LoginFrom);