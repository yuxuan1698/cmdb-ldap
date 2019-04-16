import login from './login.scss'
import { Component }  from 'react'
import {
  Form, Icon, Input, Button, Checkbox,
} from 'antd';
// 国际化
import {formatMessage} from 'umi/locale';

import {routerRedux} from 'dva/router';

class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {dispatch} = this.props
        dispatch({
          type:'login/loginHandle',
          payload: values
        })
      }
    });
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.login.islogin){
      let {dispatch} = this.props
      dispatch(routerRedux.push({
            pathname:'/'
          }))
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;

    return (
      <div className={login.loginForm}>
      <h1 className={login.loginTitle}>{formatMessage({id:'login.title'})}</h1>
      <Form onSubmit={this.handleSubmit} className={login.login}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: formatMessage({id:'login.usernamemsg'}) }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.35)' }} />} placeholder={formatMessage({id:'login.username'})} />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: formatMessage({id:'login.passwordmsg'}) }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.35)' }} />} type="password" placeholder={formatMessage({id:'login.password'})}  />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>{formatMessage({id:'login.remember'})}</Checkbox>
          )}
          <a className={login.loginFormForgot} href="">{formatMessage({id:'login.forget'})}</a>
          <Button loading={Boolean(loading.global)} type="primary" htmlType="submit" className={login.loginFormButton}>
            {formatMessage({id:'login.loginbtn'})}
          </Button>
        </Form.Item>
      </Form>
      </div>
    );
  }
}

const LoginFrom = Form.create({ name: 'normal_login' })(Login);
export default LoginFrom;