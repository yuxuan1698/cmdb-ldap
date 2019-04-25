
import { Component} from 'react';
import css from './index.less'
import {
    Drawer, Form, Button, Radio, Row, Input, Select, Icon,Dropdown,Menu,InputNumber,Divider,Col,Tooltip,notification
} from 'antd';

const { Option } = Select;

const models={ 
    pro:{
      selectedItems:['top'],
      mustField:['uid'],
      currField:['uid']
    },
    temp:{
      selectedItems:['top','person','organizationalPerson','inetOrgPerson','posixAccount','ldapPublicKey'],
      mustField:['uid','sn','cn','uidNumber','gidNumber','homeDirectory'],
      currField:['uid','sn','cn','uidNumber','gidNumber','userPassword','homeDirectory','ou','manager',
        'mobile','mail','loginShell','sshPublicKey','description']
    }
  }
const filedToName={
  uid:'用户名',
  sn:'用户姓名',
  givenName:'用户附名',
  mobile:'手机号码',
  cn:'用户别名',
  mail:'邮箱EMail',
  uidNumber:'用户UID',
  gidNumber:'用户组ID',
  loginShell:'登陆SHELL',
  departmentNumber:'部门编号',
  homeDirectory:'用户目录',
  userPassword:'用户密码',
  sshPublicKey:'用户公钥',
  manager:'领导/上级',
  description:'描述内容',
  ou:'所属部门',
  o:'组织单位',
}

@Form.create()
class DrawerAddUser extends Component {
  constructor(props){
    super(props)
    const { classobjects } =this.props
    this.state={
      options: Object.keys(classobjects),
      classobjects: classobjects,
      mayField:[],
      visible: true,
      addmodel:'temp',
      ...models.temp
    }
  }
  componentDidMount(){
    this.handleClassObjectsChange(models['temp']['selectedItems'],models['temp'])
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
  handleClassObjectsChange=(e,v)=>{
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
      ...v
    })
  }
  handleNewClassObject=()=>{
    let { getFieldValue,setFieldsValue }=this.props.form
    let curSeleItem=getFieldValue('objectClass'),isIdent
    if(curSeleItem.length>this.state.selectedItems.length){
      isIdent=curSeleItem.filter(i=>!this.state.selectedItems.includes(i)).length
    }else{
      isIdent=this.state.selectedItems.filter(i=>!curSeleItem.includes(i)).length
    }
    if(isIdent>0){
      setFieldsValue({
        objectClass: this.state.selectedItems,
      });
    }
  }
  handleClose=()=>{
    this.setState({visible:!this.state.visible})
    setTimeout(this.props.showHideUserAddDrawer,500)
  }
  addInputField=(name)=>{
    this.setState({ currField:this.state.currField.concat(name.key)})
  }
  initAddFieldMenu=()=>{
    return (<Menu>
      {this.state.mayField
        .filter(it=>{
          return !this.state.currField.includes(it)
        }).map(it=>{
          return (<Menu.Item onClick={this.addInputField.bind(this)} key={it}>
              <span>{it}</span>
            </Menu.Item>)
        })
      }</Menu>)
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {dispatch} =this.props
        dispatch({type:'users/postLDAPCreateUser',payload: values,callback:(data)=>{
          console.log(data)
        }})
      }
    });
  }
  removeField=(key)=>{
    let {mustField,currField}=this.state
    if(mustField.includes(key)){
      notification.error({
        message:"字段删除失败",
        description: "此字段为必须字段，无法删除！"
      })
    }else{
      this.setState({currField:currField.filter(i=>i!==key)})
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedItems,options } = this.state;
    return (<Drawer
            destroyOnClose
            title="添加新用户"
            width={680}
            bodyStyle={{padding:"10px 24px",overflow:"auto",height:"calc(100% - 106px)"}}
            onClose={this.handleClose.bind(this)}
            visible={this.state.visible} >
              <div style={{textAlign:"center"}}>
              <Radio.Group value={this.state.addmodel} onChange={(e)=>{
                  let currState=models[e.target.value]
                  currState['addmodel']=e.target.value
                  this.handleClassObjectsChange(currState['selectedItems'],models[e.target.value])
                  setTimeout(this.handleNewClassObject.bind(this),100)
              }} >
                <Radio.Button style={{width:270}} value="temp"><Icon type="profile" />模板模式</Radio.Button>
                <Radio.Button style={{width:270}} value="pro"><Icon type="bars" />专业模式</Radio.Button>
              </Radio.Group>
              </div>
              <Form layout="horizontal" onSubmit={this.handleSubmit} >
                <Row gutter={18} style={{margin:0}}>
                    <Form.Item label='字段归属(objectClass)' >
                      {getFieldDecorator('objectClass', {
                          initialValue:this.state.selectedItems,
                          rules: [{ required: true, message: '请选择属性归属类' }],
                      })(
                        <Select
                          disabled={this.state.addmodel=='pro'?false:true}
                          mode="multiple" showArrow autoFocus allowClear
                          placeholder="请选择属性归属类"
                          onChange={this.handleClassObjectsChange.bind(this)}
                          onMouseLeave={this.handleNewClassObject.bind(this)}
                          onBlur={this.handleNewClassObject.bind(this)} >
                          {options.filter(e=>!selectedItems.includes(e)).map(item => (
                            <Option key={item} value={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>

                  <Divider dashed style={{margin:"10px 0px"}}/>
                  {this.state.currField.map((i)=>{
                    let inputField=<Input className={css.add_user_field_width}
                                    type={i==='userPassword'?"password":"text"}
                                    placeholder={filedToName[i]?filedToName[i]:i}/>
                    if(i==='gidNumber' || i==='uidNumber'){
                      inputField=<InputNumber className={css.add_user_field_width}  min={2100} max={65535} />
                    }
                    if(i==='sshPublicKey' || i==='description'){
                      inputField=<Input.TextArea placeholder={filedToName[i]?filedToName[i]:i} autosize={{ minRows: 2, maxRows: 5 }} />
                    }
                    return (
                      <Col span={24} key={i} >
                      <Form.Item  labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={filedToName[i]?filedToName[i]:i} hasFeedback required>
                        {getFieldDecorator(i, {
                            initialValue: i==='homeDirectory'?`/home/${this.props.form.getFieldValue('uid')}`:(
                              i==='gidNumber'?this.props.form.getFieldValue('uidNumber'):(
                                i==='loginShell'?'/bin/bash':""
                              )),
                            rules: [{ required: true, message: `请输入${filedToName[i]}` }],
                        })(inputField)}
                        {<Tooltip placement="top" title="删除字段">
                          <Icon className={css.delete_field_icon}
                            type="minus-circle-o"
                            onClick={this.removeField.bind(this,i)} />
                        </Tooltip>
                        }
                      </Form.Item>
                      </Col>
                    )
                  })}
                </Row>
                <Row align='middle' >
                  <Form.Item >
                    <Dropdown trigger={['click']} 
                    overlayStyle={{maxHeight:300,overflow:"auto",boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"}}
                    disabled={this.state.selectedItems.filter(i=>i!=='top').length>0?false:true}
                    overlay={this.initAddFieldMenu.bind(this)} >
                      <Button block type="dashed"  >
                        <Icon type="plus" /> 添加字段信息
                      </Button>
                    </Dropdown>
                  </Form.Item>
                </Row>
              </Form>
              <div className={css.add_user_field_submit} >
                <Button  style={{ marginRight: 8 }} onClick={this.handleClose.bind(this)}>
                  取消
                </Button>
                <Button onClick={this.handleSubmit.bind(this)} type="primary">
                  保存
                </Button>
              </div>
            </Drawer>
    );
  }
}

export default DrawerAddUser
