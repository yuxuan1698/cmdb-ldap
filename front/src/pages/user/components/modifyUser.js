'use strict'

import { PureComponent } from 'react';
import css from './index.less'
import {
    Drawer, Form, Button, Row, Input, Select,
    Icon,InputNumber,Divider,Col,Tooltip,notification
} from 'antd';
import SelectFieldButton from "./SelectFieldButton";
import PropTypes from 'prop-types';
import {formatMessage} from 'umi/locale';
import {LDAP_MAP_FIELDS_FORMAT} from 'utils'

const LDAP_MAP_FIELDS=LDAP_MAP_FIELDS_FORMAT()

const { Option } = Select;
const sshkeysvg=props=><svg t="1562306719054" viewBox="0 0 1024 1024" version="1.1" p-id="31350" width="28" height="28"><path d="M512 512m-472.177778 0a472.177778 472.177778 0 1 0 944.355556 0 472.177778 472.177778 0 1 0-944.355556 0Z" fill="#31C5B3" p-id="31351"></path><path d="M91.022222 568.888889l62.577778-5.688889c0 17.066667 5.688889 34.133333 11.377778 39.822222 11.377778 11.377778 28.444444 17.066667 51.2 17.066667s34.133333-5.688889 45.511111-11.377778c11.377778-5.688889 11.377778-17.066667 11.377778-28.444444s-5.688889-17.066667-11.377778-22.755556c-5.688889-5.688889-17.066667-11.377778-45.511111-22.755555-22.755556-11.377778-39.822222-17.066667-51.2-28.444445-11.377778-5.688889-17.066667-11.377778-28.444445-22.755555-5.688889-11.377778-5.688889-28.444444-5.688889-39.822223 0-28.444444 11.377778-45.511111 28.444445-62.577777 17.066667-17.066667 45.511111-28.444444 79.644444-28.444445 34.133333 0 62.577778 5.688889 85.333334 22.755556 17.066667 17.066667 28.444444 39.822222 34.133333 68.266666H295.822222c0-17.066667-5.688889-28.444444-17.066666-34.133333-5.688889-5.688889-22.755556-5.688889-39.822223-5.688889-17.066667 0-28.444444 5.688889-39.822222 11.377778-5.688889 0-11.377778 11.377778-11.377778 17.066667 0 11.377778 5.688889 17.066667 11.377778 22.755555 5.688889 5.688889 22.755556 11.377778 45.511111 22.755556 39.822222 17.066667 62.577778 34.133333 68.266667 39.822222 17.066667 11.377778 22.755556 34.133333 22.755555 56.888889 0 28.444444-11.377778 51.2-34.133333 68.266666-22.755556 17.066667-51.2 28.444444-91.022222 28.444445-28.444444 0-51.2-5.688889-68.266667-11.377778s-28.444444-22.755556-39.822222-39.822222c-5.688889-17.066667-11.377778-34.133333-11.377778-51.2zM364.088889 568.888889l62.577778-5.688889c0 17.066667 5.688889 34.133333 11.377777 39.822222 11.377778 11.377778 28.444444 17.066667 51.2 17.066667s34.133333-5.688889 45.511112-11.377778c11.377778-5.688889 11.377778-17.066667 11.377777-28.444444s-5.688889-17.066667-11.377777-22.755556c-5.688889-5.688889-22.755556-11.377778-45.511112-22.755555s-39.822222-17.066667-51.2-28.444445c-11.377778-5.688889-22.755556-11.377778-28.444444-22.755555-5.688889-11.377778-5.688889-28.444444-5.688889-39.822223 0-28.444444 11.377778-45.511111 28.444445-62.577777 17.066667-22.755556 45.511111-28.444444 79.644444-28.444445 34.133333 0 62.577778 5.688889 85.333333 22.755556 17.066667 17.066667 28.444444 39.822222 28.444445 68.266666H563.2c0-17.066667-5.688889-28.444444-17.066667-34.133333-5.688889-5.688889-17.066667-5.688889-34.133333-5.688889s-28.444444 5.688889-39.822222 11.377778c-5.688889 0-11.377778 11.377778-11.377778 17.066667 0 11.377778 5.688889 17.066667 11.377778 22.755555 5.688889 5.688889 22.755556 11.377778 45.511111 22.755556 34.133333 17.066667 56.888889 28.444444 68.266667 39.822222 17.066667 11.377778 22.755556 34.133333 22.755555 56.888889 0 28.444444-11.377778 51.2-34.133333 68.266666-22.755556 17.066667-51.2 28.444444-91.022222 28.444445-28.444444 0-51.2-5.688889-68.266667-11.377778s-34.133333-22.755556-39.822222-39.822222c-5.688889-17.066667-11.377778-34.133333-11.377778-51.2zM830.577778 529.066667h-119.466667l-28.444444 136.533333h-62.577778L682.666667 358.4h62.577777l-22.755555 119.466667h119.466667l22.755555-119.466667h62.577778l-62.577778 307.2h-62.577778l28.444445-136.533333z" fill="#FFFFFF" p-id="31352"></path></svg>
const modifyusersvg=props=>
<svg t="1562309846256" viewBox="0 0 1024 1024" version="1.1" p-id="38722" width="20" height="20"><path d="M484.751579 529.237872c4.782757 0 9.621781 0.393874 14.517074 0.393874a264.795926 264.795926 0 1 0-145.227005-43.607489 471.861163 471.861163 0 0 0-172.404317 106.627344C95.435172 675.927837 38.661035 789.869986 21.724449 914.109128a99.593878 99.593878 0 0 0 23.238572 78.774819 88.509135 88.509135 0 0 0 66.452186 30.834714h345.315044a33.760637 33.760637 0 0 0 0-67.521273H111.358939a21.156666 21.156666 0 0 1-15.58616-7.708678 32.128872 32.128872 0 0 1-7.202269-25.545549c29.934431-219.162799 198.906417-385.884076 396.181069-393.705289zM303.850835 265.173426A195.474086 195.474086 0 1 1 499.043582 460.647512 195.699156 195.699156 0 0 1 303.850835 265.173426z" fill="#467CFD" p-id="38723"></path><path d="M991.83634 613.47066l-34.15451-34.041975a36.348952 36.348952 0 0 0-51.2599 0l-42.763473 42.538402 85.526946 85.133071 42.707205-42.482134a35.955078 35.955078 0 0 0-0.056268-51.147364zM615.292707 869.151214l85.526946 85.133072 232.385715-229.516061-85.470678-85.133072-232.441983 229.516061zM546.758615 1023.831197v0.168803l136.67431-53.848215-84.739197-84.345324-51.935113 138.024736z" fill="#8BAEF7" p-id="38724"></path></svg>
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
      currData:{}
    }
  }
  componentDidMount(){
    const {modifydata}=this.props
    if(modifydata) { 
      this.handleClassObjectsChange(modifydata['data']['objectClass'])
      this.setState({currField:Object.keys(modifydata['data']).filter(i=>i!=='objectClass').sort((i,b)=>i=='uid'?-1:0) })
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
    const { modifydata } = this.props;
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
    let username=getFieldValue('uid') || getFieldValue('sn')
    let email=getFieldValue('mail') 
    let payload={username,email}
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
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading,modifydata,userselect } = this.props;
    const { selectedItems,options,currField,mayField } = this.state;
    return (<Drawer
            destroyOnClose={true}
            title={<span><Icon style={{marginRight:4}}  component={modifyusersvg} />{formatMessage({id:'userlist_userupdate_new'})}</span>}
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
                        {!this.state.mustField.includes(i)?<span className={css.field_control}>
                                <Tooltip placement="top" title={formatMessage({id:'userlist_useradd_del_field'})}>
                                  <Icon className={css.delete_field_icon}
                                    type="minus-circle-o"
                                    theme="twoTone"
                                    onClick={this.removeField.bind(this,i)} />
                                </Tooltip>
                                {i==='sshPublicKey' && (!modifydata['data'].hasOwnProperty('sshPublicKey') ||
                                  (modifydata['data'].hasOwnProperty('sshPublicKey') && modifydata['data']["sshPublicKey"]===""))?<Tooltip placement="top" title={formatMessage({id:'userlist_useradd_generate_sshkey'})}>
                                    <Icon className={css.sshkey_field_icon} 
                                      onClick={this.handleGenerateSSHkey.bind(this)}
                                      component={sshkeysvg} />
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