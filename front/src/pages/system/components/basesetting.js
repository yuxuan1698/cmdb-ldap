'use strict'

import {PureComponent} from 'react'
import { Form,Switch,Input,Select,Upload,Icon } from 'antd';
const InputGroup = Input.Group;
const { Option } = Select;

@Form.create({ name: 'LDAPSettingContent' })
class CMDBBaseSettingContent extends PureComponent {
  constructor(props){
    super(props)
    this.state={}
  }
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
 
   
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="公司名称设置">
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
        <Form.Item label="公司域名">
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
        <Form.Item label="邮箱域名前缀">
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
        <Form.Item label="设置公司LOGO">
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            // fileList={fileList}
            // onPreview={this.handlePreview}
            // onChange={this.handleChange}
          >
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          </Upload>
        </Form.Item>

      </Form>)
  }
}

export default CMDBBaseSettingContent;