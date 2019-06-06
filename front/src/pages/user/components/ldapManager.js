
'use strict'

import {Fragment,PureComponent} from 'react'
import {
  Form, Button, Input, Select, Layout,Spin,Row,Col,Alert,message,
  Icon,Dropdown,Menu,InputNumber,Divider,Tooltip,notification,Empty
} from 'antd';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import css from './index.less'
import SelectFieldButton from "./SelectFieldButton";

const { Option } = Select;
const { Content,Footer } = Layout;

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
  departmentNumber:'职位名称',
  homeDirectory:'用户目录',
  userPassword:'用户密码',
  sshPublicKey:'用户公钥',
  uniqueMember:'唯一成员',
  manager:'领导/上级',
  description:'描述内容',
  ou:'所属部门',
  o:'组织单位',
  member:'成员',
  memberUid:'Unix组成员'
}

@Form.create()
@connect(({users,loading})=>({userdnlist:Object.values(users.userlist),loading}))
class CMDBLDAPManager extends PureComponent {
  constructor(props){
    super(props)
    const { classobjects } =this.props
    this.state={
      options: Object.keys(classobjects),
      classobjects: classobjects,
      mayField:[],
      selectedItems:['top'],
      mustField:[],
      currField:[],
      currData:{}
    }
  }
  componentWillMount=()=>{
    const { selectdata }=this.props
    if(selectdata.hasOwnProperty('objectClass')){
      this.setState({
        currField:Object.keys(selectdata).filter(i=>!(i==='objectClass' || i==='hasSubordinates') ),
      })
    }else{
      this.setState({objectClass:['top']})
    }
  }
  componentDidMount(){
    const { selectdata }=this.props
    if(selectdata.hasOwnProperty('objectClass')){
      this.handleClassObjectsChange(selectdata['objectClass'])
    }
  }
  
  componentWillReceiveProps(nextProps){
    const { selectdata }=nextProps
    const { setFieldsValue }=this.props.form
    if(!Object.is(this.props.selectdata,selectdata)){
      if (selectdata.hasOwnProperty('objectClass')) {
        this.setState({
          currField:Object.keys(selectdata).filter(i=>!(i==='objectClass' || i==='hasSubordinates')),
          selectedItems:selectdata['objectClass'],
        })
        setTimeout(()=>{
          this.handleClassObjectsChange(selectdata['objectClass'])
          this.handleNewClassObject()
        },100)
      }else{
        this.setState({
          currField:[],
          selectedItems: ['top']
        })
        setFieldsValue({
          objectClass: ['top'],
        });
      }
    }
  }
  initSelectedItems(arr){
    const {classobjects}=this.state
    let supSet=[]
    if(!arr instanceof Array) return []
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
    const selectdn = this.props.currentDn
    const isNewDn = this.props.isNewDn
    let defautlMustfield=(selectdn!=='')?selectdn.split(',')[0].split('=')[0]:'uid'
    let supSet=this.initSelectedItems(e)
    let mayfiled=[], mustfiled=[]
    supSet.filter(i=>i!=='top').map(it=>{
      if(isNewDn){
        mustfiled=mustfiled.concat(classobjects[it][1].must)
      }else{
        mustfiled=mustfiled.concat([it==='simpleSecurityObject'?"cn":defautlMustfield],classobjects[it][1].must)
      }
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
    const {selectdata}=this.props
    let curSeleItem=getFieldValue('objectClass'),isIdent
    if(curSeleItem instanceof Array){
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
    // 更新INPUT initalValue值
    this.state.currField.filter(s=>s!=='userPassword').map(i=>{
      if(selectdata.hasOwnProperty(i)){
        if(getFieldValue(i)===selectdata[i]) return true
        if(i==='gidNumber' || i==='uidNumber') {
          setFieldsValue({[i]:parseInt(selectdata[i],10)})
        }else{
          setFieldsValue({[i]:selectdata.hasOwnProperty(i)?selectdata[i]:[]})
        }
      }
    })
  }
  addInputField=(name)=>{
    this.setState({ currField:this.state.currField.concat(name.key).sort((a,b)=>a==='uid'?-1:1)})
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {isNewDn,currentDn,dispatch}= this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(isNewDn){
          dispatch({type:'ldap/postLDAPCreateDN',payload: {...values,currentDn},callback: ()=>{
            message.success('Entry创建成功！',5)
            dispatch({type:'ldap/getLDAPGroupsList'})
            this.props.handleFlushAndReset()
          }})
        }else{
          dispatch({type:'ldap/postLDAPUpdateDN',payload: {...values,currentDn},callback: (data)=>{
            if(data.status.hasOwnProperty('newdn')){
              this.props.handleUpdateLocalDn(values,data.status.newdn)
            }else{
              this.props.handleUpdateLocalDn(values)
            }
            message.success('数据保存成功！',5)
          }})
        }
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
  handelOnSyncLoadUserDn=(e)=>{
    if(e){
      const {userdnlist,dispatch}=this.props
      if(userdnlist.length===0){
        dispatch({type:'users/getUserList'})
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      loading,
      selectdata,
      userdnlist,
      isNewDn
    } = this.props;
    const { selectedItems,options,currField,mayField } = this.state;
    const loaded=loading.effects['ldap/getLDAPGroupsSecendList']
    const loaded_update=loading.effects['ldap/postLDAPUpdateDN']
    let { getFieldValue }=this.props.form
    return (<Fragment>
              <Content style={{overflow:"auto"}}>
                <Spin tip="Loading..." spinning={Boolean(loaded||loaded_update)}>
                <Row gutter={38} style={{margin:0}}>
                  <Col span={16} >
                    <Form layout="horizontal" onSubmit={this.handleSubmit} >
                      <Row gutter={18} >
                        <Col span={24} >
                          <Form.Item label='字段归属(objectClass)' >
                            {getFieldDecorator('objectClass', {
                              initialValue:this.state.selectedItems,
                              rules: [{ required: true, message: '请选择属性归属类(objectClass)' }],
                            })(<Select
                                mode="multiple" showArrow autoFocus allowClear
                                placeholder="请选择属性归属类(objectClass)"
                                onChange={this.handleClassObjectsChange.bind(this)}
                                loading={loading.effects['users/getLDAPClassList']}
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
                          let inputField=<Input className={css.add_user_field_width}
                                          type="text"
                                          placeholder={(filedToName[i]?filedToName[i]:i)+`(${i})`}/>
                          if(i==='userPassword'){
                            inputField = <Input.Password 
                              placeholder={(filedToName[i] ? filedToName[i] : i) + `(${i})`} />
                          }
                          if(i==='gidNumber' || i==='uidNumber'){
                            inputField = <InputNumber 
                              placeholder={(filedToName[i] ? filedToName[i] : i) + `(${i})`}
                              className={css.add_user_field_width}  min={1000} max={65535} />
                          }
                          if(i==='sshPublicKey' || i==='description'){
                            inputField = <Input.TextArea 
                              placeholder={(filedToName[i] ? filedToName[i] : i) + `(${i})`} 
                              autosize={{ minRows: 2, maxRows: 5 }} />
                          }
                          if(['member','manager','uniqueMember','seeAlso','memberUid'].includes(i)){
                            let curval=getFieldValue(i)
                            inputField=<Select
                                      mode="multiple" showArrow autoFocus allowClear
                                      loading={loading.effects['users/getUserList']}
                                      notFoundContent={<div style={{textAlign:"center"}}><Icon type='loading' style={{ fontSize: 60 }} /></div>}
                                      onDropdownVisibleChange={this.handelOnSyncLoadUserDn.bind(this)}
                                      placeholder={`请选择属性领导/上级(${i})`} >
                                      {userdnlist.filter(s=>!(curval && curval.includes(s[0]))).map(item => {
                                        let value=(i==='memberUid'?item[0].split(',')[0].split('=')[1]:item[0])
                                        return (<Option key={value} value={value}>
                                                  {value} ({item[1].hasOwnProperty('sn')?item[1]['sn']:''})
                                                </Option>)
                                        }
                                      )}
                                    </Select>
                          }
                          return (
                            <Col span={24} key={i} >
                            <Form.Item  labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label={filedToName[i]?`${filedToName[i]}(${i})`:i} hasFeedback required>
                              {getFieldDecorator(i, {
                                  initialValue: (selectdata.hasOwnProperty(i) && i!=='userPassword')?(i==='gidNumber' || i==='uidNumber'?parseInt(selectdata[i],10):selectdata[i]):[],
                                  rules: [{ required: i==='userPassword'?false:true, message: `请输入${filedToName[i]?filedToName[i]:i}(${i})` }],
                              })(inputField)}
                              {!this.state.mustField.includes(i)?<Tooltip placement="top" title="删除字段">
                                    <Icon className={css.delete_field_icon}
                                      type="minus-circle-o"
                                      theme="twoTone"
                                      onClick={this.removeField.bind(this,i)} />
                                    </Tooltip>:""}
                            </Form.Item>
                            </Col>
                          )
                        })}
                      </Row>
                      <Row align='middle' >
                        <div style={{width:"96%",margin: "0 auto"}} >
                          <Form.Item >
                            <SelectFieldButton addInputField={this.addInputField.bind(this)}
                              selectedItems={selectedItems} 
                              currField={currField}
                              mayField={mayField}
                              filedToName={filedToName}/>
                          </Form.Item>
                        </div>
                      </Row>
                    </Form>
                  </Col>
                  <Col span={8} >
                    <Alert
                      style={{margin:"42px 0px 0px 0px",padding:"15px 15px 15px 44px"}}
                      message="温馨提示"
                      description={<ul style={{listStyle: "initial",padding:"5px 0px 0 5px"}}>
                        <li>在新建DN时，必须选择objectClass,所有字段规属objectClass。</li>
                        <li>在新建DN时，字段以uid,cn,o为顺序，做为dn 字段，优先级以从前到后。</li>
                        <li>密码字段默认不显示密码，如果不修改密码就留空但不要删除字段。</li>
                      </ul>}
                      type="info"
                      icon={<Icon type="warning" style={{left:10}} theme="twoTone" /> }
                      showIcon
                    />
                  </Col>
                </Row>
                </Spin>
              </Content>
              <Footer style={{padding:10,textAlign:"center"}}>
                {isNewDn?<Button icon='rollback' type="dashed" onClick={this.props.handleFlushAndReset} style={{marginRight:10}}>返回</Button>:""}
                <Button onClick={this.handleSubmit.bind(this)} 
                  loading={loaded}
                  disabled={selectedItems.filter(i=>i!=='top').length>0?false:true}
                  icon = {
                    isNewDn?'plus':"save"
                  }
                  type = "primary" > {
                    loaded||loaded_update ? "加载中.." : (isNewDn ?"新建":"保存")
                  } < /Button>
                 
              </Footer>
          </Fragment>           
    );
  }
}

CMDBLDAPManager.propTypes = {
  classobjects: PropTypes.object.isRequired,
  selectdata: PropTypes.object.isRequired,
  userdnlist: PropTypes.array,
  loading: PropTypes.object,
  isNewDn: PropTypes.bool.isRequired,
  currentDn: PropTypes.string.isRequired,
  handleFlushAndReset: PropTypes.func,
  handleNewDNItem: PropTypes.func,
  dispatch: PropTypes.func
};

export default CMDBLDAPManager;