'use strict'

import { PureComponent } from 'react';
import css from './index.less'
import {
    Drawer, Form, Button, Row, Input, Select,Radio,Popover,
    Icon,InputNumber,Divider,Col,Tooltip,notification
} from 'antd';
import SelectFieldButton from "./SelectFieldButton";
import PropTypes from 'prop-types';
import {formatMessage} from 'umi/locale';
import {LDAP_MAP_FIELDS_FORMAT} from 'utils'
import sshkeysvg from 'svgicon/sshkey.svg'
import modifyusersvg from 'svgicon/modifyuser.svg'

const LDAP_MAP_FIELDS=LDAP_MAP_FIELDS_FORMAT()

const { Option } = Select;
@Form.create()
class DrawerUpdateUser extends PureComponent {
  constructor(props){
    super(props)
    const { classobjects } =this.props
    this.state={
      options: Object.keys(classobjects),
      classobjects: classobjects,
      visible: true,
      addmodel:'temp',
      selectedItems:['top'],
      mayField:[],
      mustField:[],
      currField:['uid'],
      currData:{},
      sshKeyType: 'ecdsa'
    }
  }
  componentDidMount(){
    const {modifydata}=this.props
    if(modifydata) { 
      this.handleClassObjectsChange(modifydata['data']['objectClass'])
      this.setState({currField:Object.keys(modifydata['data']).filter(i=>i!=='objectClass').sort((i,b)=>i==='uid'?-1:0) })
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
      return it
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
      return it
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
    setTimeout(this.props.showHideUserDrawer,500,'update')
  }
  addInputField=(name)=>{
    this.setState({ currField:this.state.currField.concat(name.key)})
  }
 
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {dispatch,modifydata} =this.props
        let modData=values
        modData['userdn']=modifydata['userdn']
        dispatch({type:'users/postLDAPUpdateUser',payload: modData,callback:(data)=>{
          this.props.form.resetFields()
          notification.info({
            message:formatMessage({id:'userlist_usermodify_tips'}),
            description: formatMessage({id:'userlist_usermodify_content'})
          })
          this.handleClose()
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
    const { getFieldDecorator } = this.props.form;
    const { loading,modifydata,userselect } = this.props;
    const { selectedItems,options,currField,mayField,mustField,sshKeyType } = this.state;
    return (<Drawer
            destroyOnClose={true}
            title={<span><Icon style={{marginRight:4,fontSize:18}}  component={modifyusersvg} />{formatMessage({id:'userlist_userupdate_new'})}</span>}
            width={750}
            bodyStyle={{padding:"10px 24px",overflow:"auto",height:"calc(100% - 106px)"}}
            onClose={this.handleClose.bind(this)}
            visible={this.state.visible} >
              <Form layout="horizontal" onSubmit={this.handleSubmit} >
                <Row gutter={18} style={{margin:0}}>
                  <Col span={24} >
                    <Form.Item label={formatMessage({id:'userlist_useradd_field_parent'})+"(objectClass)"} >
                      {getFieldDecorator('objectClass', {
                        initialValue:this.state.selectedItems,
                        rules: [{ 
                          required: true, 
                          message: formatMessage({id:'userlist_useradd_field_choise'})+"(objectClass)" 
                        }],
                      })(
                        <Select
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
                  {this.state.currField.map((i)=>{
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
                        inputField = <Input.TextArea 
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
                            initialValue: i==='userPassword'?"":(modifydata && modifydata['data'][i]?modifydata['data'][i][0]:(i==='loginShell'?'/bin/bash':"")),
                            rules: [{ required: i==='userPassword'?false:true,
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
                                {i==='sshPublicKey' && (!modifydata['data'].hasOwnProperty('sshPublicKey') ||
                                  (modifydata['data'].hasOwnProperty('sshPublicKey')))?<Tooltip placement="top" title={formatMessage({id:'userlist_useradd_generate_sshkey'})}>
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
                  <div style={{width:"80%",margin: "0 auto"}} >
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

DrawerUpdateUser.propTypes = {
  modifydata: PropTypes.object.isRequired,
  userselect: PropTypes.array
}; 
export default DrawerUpdateUser