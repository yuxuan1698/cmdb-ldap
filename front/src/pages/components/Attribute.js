
'use strict'

import {Fragment,PureComponent} from 'react'
import {
  Form, Button, Row, Input, Select, Layout,
  Icon,Dropdown,Menu,InputNumber,Divider,Col,Tooltip,notification
} from 'antd';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import css from './index.less'
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
}

@Form.create()
@connect(({users,loading})=>({userdnlist:users.userdnlist,loading}))
class CMDBLDAPAttribute extends PureComponent {
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
  componentDidMount(){
    const { selectdata }=this.props
    this.handleClassObjectsChange(selectdata['objectClass'])
  }
  componentWillReceiveProps(nextProps){
    // console.log(this.props.form)
    const { selectdata }=nextProps
    const { setFieldsValue }=nextProps.form
    if(this.props.selectdata!==selectdata){
      this.setState({
        currField:Object.keys(selectdata).filter(i=>!(i==='objectClass' || i==='selectkey')),
        selectedItems:selectdata['objectClass'],
        currUserDn:selectdata['uniqueMember']
      })
      setTimeout(()=>{
        this.handleClassObjectsChange(selectdata['objectClass'])
        this.handleNewClassObject()
      },100)
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
    const {selectkey}=this.props.selectdata
    let defautlMustfield=(selectkey instanceof Array && selectkey[0]!=='')?selectkey[0].split(',')[0].split('=')[0]:'uid'
    let supSet=this.initSelectedItems(e)
    let mayfiled=[], mustfiled=[]
    supSet.filter(i=>i!=='top').map(it=>{
      mustfiled=mustfiled.concat([it==='simpleSecurityObject'?"cn":defautlMustfield],classobjects[it][1].must)
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
    const { loading,selectdata,userdnlist } = this.props;
    const { selectedItems,options } = this.state;
    let { getFieldValue }=this.props.form
    return (
            <Fragment>
            <Content style={{overflow:"auto"}}>
              <Form layout="horizontal" onSubmit={this.handleSubmit} >
                <Row gutter={18} style={{margin:0}}>
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
                                    type={i==='userPassword'?"password":"text"}
                                    placeholder={(filedToName[i]?filedToName[i]:i)+`(${i})`}/>
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
                    if(i==='manager' || i==='member' || i==='uniqueMember'){
                      let curval=getFieldValue(i)
                      inputField=<Select
                                mode="multiple" showArrow autoFocus allowClear
                                loading={loading.effects['users/getUserList']}
                                notFoundContent={<div style={{textAlign:"center"}}><Icon type='loading' style={{ fontSize: 60 }} /></div>}
                                onDropdownVisibleChange={this.handelOnSyncLoadUserDn.bind(this)}
                                placeholder={`请选择属性领导/上级(${i})`} >
                                {userdnlist.filter(s=>!(curval && curval.includes(s))).map(item => (
                                  <Option key={item} value={item}>
                                    {item}
                                  </Option>
                                ))}
                              </Select>
                    }
                    return (
                      <Col span={24} key={i} >
                      <Form.Item  labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={filedToName[i]?`${filedToName[i]}(${i})`:i} hasFeedback required>
                        {getFieldDecorator(i, {
                            initialValue: (selectdata.hasOwnProperty(i) && i!=='userPassword')?selectdata[i]:[],
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
                  <div style={{width:"80%",margin: "0 auto"}} >
                    <Form.Item >
                      <Dropdown trigger={['click']} 
                      loading={loading.effects['users/getLDAPClassList']}
                      overlayStyle={{maxHeight:300,overflow:"auto",boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"}}
                      disabled={this.state.selectedItems.filter(i=>i!=='top').length>0?false:true}
                      overlay={this.initAddFieldMenu.bind(this)} >
                        <Button block type="dashed"  >
                          <Icon type="plus" /> 添加字段信息
                        </Button>
                      </Dropdown>
                    </Form.Item>
                  </div>
                </Row>
              </Form>
            </Content>
            <Footer style={{padding:10,textAlign:"center"}}>
              <Button onClick={this.handleSubmit.bind(this)} type="primary">保存</Button>
            </Footer>
          </Fragment>           
    );
  }
}

CMDBLDAPAttribute.propTypes = {
  classobjects: PropTypes.object.isRequired,
  selectdata: PropTypes.object.isRequired,
  userdnlist: PropTypes.array,
  loading: PropTypes.object,
  dispatch: PropTypes.func
};

export default CMDBLDAPAttribute;