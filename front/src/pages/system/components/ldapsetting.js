'use strict'

import {PureComponent} from 'react'
import { Form,Switch,Input,Button,Select,AutoComplete } from 'antd';
const InputGroup = Input.Group;
const { Option } = Select;

@Form.create({ name: 'LDAPSettingContent' })
class CMDBLDAPSettingContent extends PureComponent {
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
        sm: { span: 6 },
        md: { span: 6 },
        lg: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 14 },
        lg: { span: 10 },
      },
    };
 
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="开启LDAP认证">
          {getFieldDecorator('openldap', {
            rules: [
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <Switch size="small" checkedChildren="开" unCheckedChildren="关" defaultChecked style={{margin:"-2px 0 0 10px"}} />
            )}
        </Form.Item>
        <Form.Item label="LDAP服务器地址">
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(
            <InputGroup compact style={{display:"inline-flex"}}>
              <Select defaultValue="ldap" style={{width:100}}>
                    <Option value="Sign Up">ldap</Option>
                    <Option value="Sign In">ldaps</Option>
                  </Select>
              <Input placeholder="LDAP地址(IP/域名)" />
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
              <Input style={{ width: 80, textAlign: 'center', }} placeholder="端口" />
            </InputGroup>
          )}
        </Form.Item>
        <Form.Item label="E-mail">
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<InputGroup compact style={{display:"inline-flex"}}>
          <Select defaultValue="ldap" style={{width:80}}>
                <Option value="Sign Up">ldap</Option>
                <Option value="Sign In">ldaps</Option>
              </Select>
          <Input style={{textAlign: 'center' }} placeholder="Minimum" />
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
          <Input style={{ width: 100, textAlign: 'center', }} placeholder="Maximum" />
        </InputGroup>)}
        </Form.Item>
      </Form>)
  }
}

export default CMDBLDAPSettingContent;