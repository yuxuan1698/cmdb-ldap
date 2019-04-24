
import { Component} from 'react';
import {
    Drawer, Form, Button, Col, Row, Input, Select, Icon,Dropdown,Menu
} from 'antd';
import {AddFieldButton} from './addUser/addFieldButton'

const { Option } = Select;

const models={ 
    professional:{
      objectclass:{}
    },
    template:{}
  }
const filedToName={
  uid:'用户名',
  sn:'姓名',
  givenName:'别名',
  mobile:'手机号',
  ou:'部门',
  cn:'别名',
  mail:'邮箱',
  mobile:'手机',
}
@Form.create()
class DrawerAddUser extends Component {
  constructor(props){
    super(props)
    const { classobjects } =this.props
    this.state={
      options: Object.keys(classobjects),
      classobjects: classobjects,
      selectedItems:['top'],
      mustField:['uid'],
      mayField:[],
      currField:['uid'],
      visible: true
    }
  }
  initSelectedItems(arr){
    const {classobjects}=this.state
    let supSet=[]
    arr.filter(it=>it!=='top').map((it)=>{
      let tmp=classobjects[it][0].sup.filter(i=>i!=='top')
      if(tmp.length>0) {
        supSet=supSet.concat(this.initSelectedItems(tmp),[it])
      }else{
        supSet=supSet.concat(classobjects[it][0].sup,[it])
      }
    })
    return Array.from(new Set(supSet))
  }
  handleClassObjectsChange=(e)=>{
    const {classobjects}=this.state
    let supSet=this.initSelectedItems(e)
    let mayfiled=[], mustfiled=[]
    supSet.filter(i=>i!=='top').map(it=>{
      mustfiled=mustfiled.concat(['uid'],classobjects[it][1].must)
      mayfiled=mayfiled.concat(classobjects[it][2].may)
    }) 
    this.setState({
      selectedItems:supSet,
      mustField:Array.from(new Set(mustfiled)),
      mayField:Array.from(new Set(mayfiled)),
      currField:Array.from(new Set(mustfiled)),
    })
  }
  hadleNewClassObject=()=>{
    this.props.form.setFieldsValue({
      objectClass: this.state.selectedItems,
    });
  }
  addInputField=(name)=>{
    this.setState({ currField:this.state.currField.concat(name.key)})
  }
  initAddFieldMenu=()=>{
    return (<Menu>
      {
        this.state.mayField
        .filter(it=>{
          return !this.state.currField.includes(it)
        }).map(it=>{
          return (
            <Menu.Item onClick={this.addInputField.bind(this)} key={it}>
              <span>{it}</span>
            </Menu.Item>)
        })
      }
    </Menu>)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedItems,options } = this.state;
    return (<Drawer
            destroyOnClose
            title="添加新用户"
            width={680}
            bodyStyle={{padding:"10px 24px 30px 24px",overflow:"auto"}}
            onClose={()=>{
              this.setState({visible:!this.state.visible})
              setTimeout(this.props.showHideUserAddDrawer,500)
            }}
            visible={this.state.visible}
            >
              <Form layout="vertical" hasFeedback>
                <Row gutter={12}>
                    <Form.Item label='字段归属(objectClass)' >
                      {getFieldDecorator('objectClass', {
                          initialValue:this.state.selectedItems,
                          rules: [{ required: true, message: '请选择属性归属类' }],
                      })(
                        <Select
                          mode="multiple"
                          showArrow
                          allowClear
                          placeholder="请选择属性归属类"
                          onChange={this.handleClassObjectsChange.bind(this)}
                          onMouseLeave={this.hadleNewClassObject.bind(this)}
                          onBlur={this.hadleNewClassObject.bind(this)}
                          style={{ width: '100%' }}>
                          {options.filter(e=>!selectedItems.includes(e)).map(item => (
                            <Option key={item} value={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  {this.state.currField.map((i)=>{
                     return (
                      <Form.Item  key={i} hasFeedback required>
                        {getFieldDecorator(i, {
                            rules: [{ required: true, message: i }],
                        })(
                            <Input style={{ width: '100%' }}
                                addonBefore={filedToName[i]?filedToName[i]:i}
                                // prefix={i}
                                placeholder={filedToName[i]?filedToName[i]:i}/>
                        )}
                        {/* {<Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={()=>{}} />
                        } */}
                      </Form.Item>
                    )
                  })}
                </Row>
                <Row align='middle' >
                  <Form.Item >
                    <Dropdown trigger={['click']} 
                    overlayStyle={{maxHeight:300,overflow:"auto",boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"}}
                    overlay={this.initAddFieldMenu.bind(this)} >
                      <Button block  type="dashed"  >
                        <Icon type="plus" /> 添加字段
                      </Button>
                    </Dropdown>
                  </Form.Item>
                </Row>
              </Form>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: '100%',
                  borderTop: '1px solid #e9e9e9',
                  padding: '10px 16px',
                  background: '#fff',
                  textAlign: 'right',
                }}
              >
                <Button  style={{ marginRight: 8 }}>
                  取消
                </Button>
                <Button onClick={()=>{
                    this.props.form.setFieldsValue({
                      objectClass: this.state.selectedItems,
                    });
                }} type="primary">
                  保存
                </Button>
              </div>
            </Drawer>
    );
  }
}

export default DrawerAddUser
