'use strict'

import { PureComponent } from 'react';
import css from './index.less'
import {
    Drawer, Form, Button, Radio, Row, Input, Select,Popover,
    Icon,InputNumber,Divider,Col,Tooltip,notification
} from 'antd';
import {formatMessage} from 'umi/locale';
import SelectFieldButton from "./SelectFieldButton";
import {LDAP_MAP_FIELDS_FORMAT} from 'utils'

const LDAP_MAP_FIELDS=LDAP_MAP_FIELDS_FORMAT()

const { Option } = Select;

const models={ 
    pro:{
      selectedItems:['top'],
      mustField:[],
      currField:['uid']
    },
    temp:{
      selectedItems:['top','person','organizationalPerson','inetOrgPerson','posixAccount','ldapPublicKey'],
      mustField:['uid','sn','cn','uidNumber','gidNumber','homeDirectory'],
      currField:['uid','sn','cn','uidNumber','gidNumber','userPassword','homeDirectory','ou',
        'mobile','mail','loginShell','departmentNumber','sshPublicKey','description']
    }
  }
const sshkeysvg=props=><svg t="1562306719054" viewBox="0 0 1024 1024" version="1.1" p-id="31350" width="28" height="28"><path d="M512 512m-472.177778 0a472.177778 472.177778 0 1 0 944.355556 0 472.177778 472.177778 0 1 0-944.355556 0Z" fill="#31C5B3" p-id="31351"></path><path d="M91.022222 568.888889l62.577778-5.688889c0 17.066667 5.688889 34.133333 11.377778 39.822222 11.377778 11.377778 28.444444 17.066667 51.2 17.066667s34.133333-5.688889 45.511111-11.377778c11.377778-5.688889 11.377778-17.066667 11.377778-28.444444s-5.688889-17.066667-11.377778-22.755556c-5.688889-5.688889-17.066667-11.377778-45.511111-22.755555-22.755556-11.377778-39.822222-17.066667-51.2-28.444445-11.377778-5.688889-17.066667-11.377778-28.444445-22.755555-5.688889-11.377778-5.688889-28.444444-5.688889-39.822223 0-28.444444 11.377778-45.511111 28.444445-62.577777 17.066667-17.066667 45.511111-28.444444 79.644444-28.444445 34.133333 0 62.577778 5.688889 85.333334 22.755556 17.066667 17.066667 28.444444 39.822222 34.133333 68.266666H295.822222c0-17.066667-5.688889-28.444444-17.066666-34.133333-5.688889-5.688889-22.755556-5.688889-39.822223-5.688889-17.066667 0-28.444444 5.688889-39.822222 11.377778-5.688889 0-11.377778 11.377778-11.377778 17.066667 0 11.377778 5.688889 17.066667 11.377778 22.755555 5.688889 5.688889 22.755556 11.377778 45.511111 22.755556 39.822222 17.066667 62.577778 34.133333 68.266667 39.822222 17.066667 11.377778 22.755556 34.133333 22.755555 56.888889 0 28.444444-11.377778 51.2-34.133333 68.266666-22.755556 17.066667-51.2 28.444444-91.022222 28.444445-28.444444 0-51.2-5.688889-68.266667-11.377778s-28.444444-22.755556-39.822222-39.822222c-5.688889-17.066667-11.377778-34.133333-11.377778-51.2zM364.088889 568.888889l62.577778-5.688889c0 17.066667 5.688889 34.133333 11.377777 39.822222 11.377778 11.377778 28.444444 17.066667 51.2 17.066667s34.133333-5.688889 45.511112-11.377778c11.377778-5.688889 11.377778-17.066667 11.377777-28.444444s-5.688889-17.066667-11.377777-22.755556c-5.688889-5.688889-22.755556-11.377778-45.511112-22.755555s-39.822222-17.066667-51.2-28.444445c-11.377778-5.688889-22.755556-11.377778-28.444444-22.755555-5.688889-11.377778-5.688889-28.444444-5.688889-39.822223 0-28.444444 11.377778-45.511111 28.444445-62.577777 17.066667-22.755556 45.511111-28.444444 79.644444-28.444445 34.133333 0 62.577778 5.688889 85.333333 22.755556 17.066667 17.066667 28.444444 39.822222 28.444445 68.266666H563.2c0-17.066667-5.688889-28.444444-17.066667-34.133333-5.688889-5.688889-17.066667-5.688889-34.133333-5.688889s-28.444444 5.688889-39.822222 11.377778c-5.688889 0-11.377778 11.377778-11.377778 17.066667 0 11.377778 5.688889 17.066667 11.377778 22.755555 5.688889 5.688889 22.755556 11.377778 45.511111 22.755556 34.133333 17.066667 56.888889 28.444444 68.266667 39.822222 17.066667 11.377778 22.755556 34.133333 22.755555 56.888889 0 28.444444-11.377778 51.2-34.133333 68.266666-22.755556 17.066667-51.2 28.444444-91.022222 28.444445-28.444444 0-51.2-5.688889-68.266667-11.377778s-34.133333-22.755556-39.822222-39.822222c-5.688889-17.066667-11.377778-34.133333-11.377778-51.2zM830.577778 529.066667h-119.466667l-28.444444 136.533333h-62.577778L682.666667 358.4h62.577777l-22.755555 119.466667h119.466667l22.755555-119.466667h62.577778l-62.577778 307.2h-62.577778l28.444445-136.533333z" fill="#FFFFFF" p-id="31352"></path></svg>
@Form.create()
class DrawerAddUser extends PureComponent {
  constructor(props){
    super(props)
    const { classobjects } =this.props
    this.state={
      options: Object.keys(classobjects),
      classobjects: classobjects,
      mayField:[],
      visible: true,
      addmodel:'temp',
      sshKeyType: 'ecdsa',
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
      mustfiled=mustfiled.concat([it==='simpleSecurityObject'?"cn":'uid'],classobjects[it][1].must)
      mayfiled=mayfiled.concat(classobjects[it][2].may)
    }) 
    this.setState({
      selectedItems:supSet,
      mustField:Array.from(new Set(mustfiled)),
      mayField:Array.from(new Set(mayfiled)),
      currField:Array.from(new Set(mustfiled.concat(this.state.currField))),
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
    setTimeout(this.props.showHideUserDrawer,500)
  }
  addInputField=(name)=>{
    this.setState({ currField:this.state.currField.concat(name.key)})
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {dispatch} =this.props
        dispatch({type:'users/postLDAPCreateUser',payload: values,callback:(data)=>{
          this.props.form.resetFields()
          notification.info({
            message:formatMessage({id:'userlist_useradd_success_tips'}),
            description: formatMessage({id:'userlist_useradd_success_content'})
          })
          dispatch({type:'users/getUserList'})
        }})
      }
    });
  }
  removeField=(key)=>{
    let {mustField,currField}=this.state
    if(mustField.includes(key)){
      notification.error({
        message:formatMessage({id:'userlist_useradd_delfield_tips'}),
        description: formatMessage({id:'userlist_useradd_delfield_failed'})
      })
    }else{
      this.setState({currField:currField.filter(i=>i!==key)})
    }
  }
  handleGenerateSSHkey=()=>{
    const {setFieldsValue,getFieldValue } = this.props.form;
    const {sshKeyType}=this.state
    let username=getFieldValue('uid') || getFieldValue('sn')
    let email=getFieldValue('mail') 
    let payload={username,email,keytype:sshKeyType}
    const {dispatch}=this.props
    dispatch({type:'users/generateSSHKeyAndDownLoad',payload,callback:(data)=>{
      if(data.hasOwnProperty('publickey')){
        setFieldsValue({sshPublicKey:data.publickey})
        notification.success({
          message: formatMessage({id:'userlist_usergenerate_sshkey_success'}),
          description: formatMessage({id:'userlist_usergenerate_sshkey_content'})
        })
      }
    }})
  }
  handleChangeSSHKeyType=(e)=>{
    this.setState({sshKeyType:e.target.value})
    setTimeout(() => {
      this.handleGenerateSSHkey();
    }, 200);
  }
  render() {
    const { getFieldDecorator,getFieldValue } = this.props.form;
    const { loading,userselect } = this.props;
    const { selectedItems,options,currField,mayField ,mustField,addmodel,visible,sshKeyType} = this.state;
    return (<Drawer
            destroyOnClose={true}
            title={<span><Icon type="user-add" style={{fontSize:18,marginRight:4}} />{`${formatMessage({id:'userlist_useradd_new'})}(${addmodel==='temp'?
            formatMessage({id:'userlist_useradd_template'}):
            formatMessage({id:'userlist_useradd_pro'})})`}</span>}
            width={780}
            bodyStyle={{padding:"10px 24px",overflow:"auto",height:"calc(100% - 106px)"}}
            onClose={this.handleClose.bind(this)}
            visible={visible} >
              <div style={{textAlign:"center"}}>
              <Radio.Group value={addmodel} onChange={(e)=>{
                  let currState=models[e.target.value]
                  currState['addmodel']=e.target.value
                  this.handleClassObjectsChange(currState['selectedItems'],models[e.target.value])
                  setTimeout(this.handleNewClassObject.bind(this),100)
              }} >
                <Radio.Button style={{width:270}} value="temp"><Icon type="profile" />
                  {formatMessage({id:'userlist_useradd_template'})}
                </Radio.Button>
                <Radio.Button style={{width:270}} value="pro"><Icon type="bars" />
                  {formatMessage({id:'userlist_useradd_pro'})}
                </Radio.Button>
              </Radio.Group>
              </div>
              <Form layout="horizontal" onSubmit={this.handleSubmit} >
                <Row gutter={18} style={{margin:0}}>
                  <Col span={24} >
                    <Form.Item label={formatMessage({id:'userlist_useradd_field_parent'})+"(objectClass)"} >
                      {getFieldDecorator('objectClass', {
                          initialValue:selectedItems,
                        rules: [{ required: true, message: formatMessage({id:'userlist_useradd_field_choise'})+"(objectClass)" }],
                      })(
                        <Select
                          disabled={addmodel=='pro'?false:true}
                          mode="multiple" showArrow autoFocus allowClear
                          placeholder={formatMessage({id:'userlist_useradd_field_choise'})+"(objectClass)"}
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
                  </Col>
                  <Divider dashed style={{margin:"10px 0px"}}/>
                  {currField.map((i)=>{
                    let inputField
                    switch(i){
                      case "userPassword":
                        inputField = <Input.Password 
                          placeholder={(LDAP_MAP_FIELDS[i] ? LDAP_MAP_FIELDS[i] : i) + `(${i})`} />
                        break;
                      case "gidNumber":
                      case "uidNumber":
                        inputField = <InputNumber 
                          placeholder={(LDAP_MAP_FIELDS[i] ? LDAP_MAP_FIELDS[i] : i) + `(${i})`}
                          className={css.add_user_field_width}  min={2100} max={65535} />
                          break;
                      case "description":
                        inputField = <Input.TextArea 
                          placeholder={(LDAP_MAP_FIELDS[i] ? LDAP_MAP_FIELDS[i] : i) + `(${i})`} 
                          autosize={{ minRows: 2, maxRows: 5 }} />
                        break;
                      case "sshPublicKey":
                        inputField =<Input.TextArea 
                          placeholder={(LDAP_MAP_FIELDS[i] ? LDAP_MAP_FIELDS[i] : i) + `(${i})`} 
                          autosize={{ minRows: 3, maxRows: 5 }} />
                        break;
                      case "member":
                      case "manager":
                      case "uniqueMember":
                      case "seeAlso":
                        inputField=<Select
                                showArrow autoFocus allowClear showSearch
                                placeholder={formatMessage({id:'userlist_useradd_choise_commander'},{i})} >
                                {userselect.map(item => (
                                  <Option key={item['userdn']} value={item['userdn']}>
                                    <Icon type="user" style={{marginRight:5}} />{item['sn']}({item['uid']})
                                  </Option>
                                ))}
                              </Select>
                        break;
                      default:
                        inputField=<Input className={css.add_user_field_width}
                          type="text"
                          placeholder={(LDAP_MAP_FIELDS[i]?LDAP_MAP_FIELDS[i]:i)+`(${i})`}/>
                    }
                    return (
                      <Col span={24} key={i} >
                      <Form.Item  labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={LDAP_MAP_FIELDS[i]?LDAP_MAP_FIELDS[i]:i} hasFeedback required>
                        {getFieldDecorator(i, {
                            initialValue: i==='homeDirectory'?`/home/${getFieldValue('uid')||getFieldValue('sn')}`:(
                              i==='gidNumber'?getFieldValue('uidNumber'):(
                                i==='loginShell'?'/bin/bash':(i==='mail'?`${getFieldValue('uid')||getFieldValue('sn')}@iwubida.com`:"")
                              )),
                            rules: [{ required: true, 
                                message: formatMessage(
                                  {id:'userlist_useradd_input_tips'},
                                  {fieldname:LDAP_MAP_FIELDS[i],fieldval:i}
                                )
                              }],
                        })(inputField)}
                         {!mustField.includes(i)?<span className={css.field_control}>
                                <Tooltip placement="top" title={formatMessage({id:'userlist_useradd_del_field'})}>
                                  <Icon className={css.delete_field_icon}
                                    type="minus-circle-o"
                                    theme="twoTone"
                                    onClick={this.removeField.bind(this,i)} />
                                </Tooltip>
                                {i==='sshPublicKey' && (getFieldValue('uid')!==""||getFieldValue('sn')!=="")?
                                  <Tooltip placement="top" title={formatMessage({id:'userlist_useradd_generate_sshkey'})}>
                                    <Popover placement="bottom" 
                                      content={<Radio.Group size='small' 
                                        value={sshKeyType}
                                        onChange={this.handleChangeSSHKeyType}
                                        buttonStyle="solid">
                                      <Radio.Button value="rsa">RSA</Radio.Button>
                                      <Radio.Button value="ecdsa">ECDSA</Radio.Button>
                                      <Radio.Button value="dss">DSS</Radio.Button>
                                      <Radio.Button value="ed25519">ED25519</Radio.Button>
                                    </Radio.Group>} trigger="hover">
                                      <Icon className={css.sshkey_field_icon} 
                                        onClick={this.handleGenerateSSHkey.bind(this)}
                                        component={sshkeysvg} style={{fontSize:28}} />
                                    </Popover>
                                  </Tooltip>:""}
                              </span>:""}
                      </Form.Item>
                      </Col>
                    )
                  })}
                </Row>
                <Row align='middle' >
                  <div style={{width:"85%",margin: "0 auto"}} >
                    <Form.Item >
                      <SelectFieldButton addInputField={this.addInputField.bind(this)}
                          selectedItems={selectedItems} 
                          currField={currField}
                          mayField={mayField}
                          LDAP_MAP_FIELDS={LDAP_MAP_FIELDS}/>
                    </Form.Item>
                  </div>
                </Row>
              </Form>
              <div className={css.add_user_field_submit} >
                <Button  style={{ marginRight: 8 }} onClick={this.handleClose.bind(this)}>
                  {formatMessage({id:'userlist_useradd_cancel'})}
                </Button>
                <Button loading={loading.effects['users/postLDAPCreateUser']}
                  disabled={selectedItems.filter(i=>i!=='top').length>0?false:true} 
                  onClick={this.handleSubmit.bind(this)} type="primary">
                  <Icon type="save"  />
                    {formatMessage({id:'userlist_useradd_save'})}
                </Button>
              </div>
            </Drawer>
    );
  }
}

export default DrawerAddUser
