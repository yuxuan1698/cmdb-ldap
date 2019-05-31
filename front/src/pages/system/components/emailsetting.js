'use strict'

import {PureComponent} from 'react'
import { Form,Switch,Input,Button,Select,Checkbox } from 'antd';
const InputGroup = Input.Group;
const { Option } = Select;

@Form.create({ name: 'LDAPSettingContent' })
class CMDBEmailSettingContent extends PureComponent {
  constructor(props){
    super(props)
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  render(){
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 7 },
        lg: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 16 },
        lg: { span: 12 },
      },
    };
 
    const tailFormItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
        md: { span: 7 },
        lg: { span: 6 },
      },
      wrapperCol: {
        xs: {
          span: 10,
        }
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="开启EMail提醒">
          {getFieldDecorator('openldap', {
            rules: [
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <Switch size="small" checkedChildren={<span>开</span>} unCheckedChildren="关" defaultChecked style={{margin:"-2px 0 0 10px"}} />
            )}
        </Form.Item>
        <Form.Item label="Email服务器地址">
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <InputGroup compact style={{display:"inline-flex"}}>
              <Select defaultValue="smtp">
                <Option value="smtp">smtp</Option>
                <Option value="smtps">smtps</Option>
                <Option value="exchange">exchange</Option>
              </Select>
              <Input placeholder="EMAIL发件地址(IP/域名)" />
              <Input
                style={{
                  width: 55,
                  color: "#646464",
                  pointerEvents: 'none',
                  backgroundColor: '#fff',
                }}
                disabled
                value="端口:"
              />
              <Input style={{ width: 80 }} placeholder="端口" />
            </InputGroup>
          )}
        </Form.Item>
        <Form.Item label="Email用户名">
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
          <Input placeholder="请输入EMAIL用户名" />
          )}
        </Form.Item>
        <Form.Item label="Email用户密码">
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
          <Input.Password placeholder="请输入EMAIL用户密码" />
          )}
        </Form.Item>
        <Form.Item label="启用TLS">
          {getFieldDecorator('enable_tls', {
            rules: [
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
          <Checkbox />
          )}
        </Form.Item>
      </Form>)
  }
}

export default CMDBEmailSettingContent;