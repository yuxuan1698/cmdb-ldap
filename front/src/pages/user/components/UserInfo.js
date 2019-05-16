'use strict'

import {PureComponent} from 'react';
import {
  Modal,Row,Col,Divider,Tag, Spin
} from 'antd';
import moment from 'moment'
import css from './index.less'

const color=["blue","cyan","geekblue","magenta","red","volcano","green","orange","gold","lime","purple"];
const DescriptionItem = ({ title, content,keyval }) => {
  let index=0
  let formatcontent=(<div className={css.userinfo_value}>{
    content instanceof Array?content.map(i=>{
        if(index>color.length) index=0
        index+=1
        if(keyval==='memberOf') return <Tag key={i} color={color[index-1]}>{i}</Tag>
        let datavalue=""
        if(i.match(/^(\d{8})(\d{6}Z)$/g)===null){
          datavalue=i
        }else{
          datavalue=moment(i.replace(/^(\d{8})(\d{6}Z)$/g,"$1T$2")).format("YYYY/MM/DD HH:mm:ss")
        }
        return content.length>1?<Tag key={i} color={color[index-1]}>{datavalue}</Tag>:
        <Tag key={i} style={{ background: '#fff', borderStyle: 'dashed' }} >{datavalue}</Tag>
        }):<Tag style={{ background: '#fff', borderStyle: 'dashed' }} >{content}</Tag>}</div>)
  if(keyval==='sshPublicKey'){
    formatcontent=<div className={css.userinfo_sshpublickey}>{content}</div>
  }
  return <div className={css.userinfo_boxstyle} >
          <p className={css.userinfo_title} >
            {title}:
          </p>
          {formatcontent}
      </div>
}
const base_profile={
  'uid':{name:"用户名",col:12},
  'sn':{name:"用户姓名",col:12},
  'cn':{name:"用户别名",col:12},
  'givenName':{name:"用户附名",col:12},
  'ou':{name:"用户部门",col:12},
  'departmentNumber':{name:"用户职位",col:12},
  'uidNumber':{name:"用户UID",col:12},
  'gidNumber':{name:"用户组ID",col:12},
  'loginShell':{name:"用户登陆Shell",col:12},
  'homeDirectory':{name:"用户目录",col:12},
  'mail':{name:"邮箱地址",col:12},
  'mobile':{name:"手机号码",col:12},
  'entryDN':{name:"用户DN",col:12},
  'entryUUID':{name:"用户UUID",col:12},
  'objectClass':{name:"用户属性",col:24},
}
const extra_profile={
  'createTimestamp':{name:"创建时间",col:12},
  'modifyTimestamp':{name:"修改时间",col:12},
  'pwdChangedTime':{name:"密码修改时间",col:12},
  'hasSubordinates':{name:"有无下属",col:12},
  'manager':{name:"用户上级",col:12},
  'creatorsName':{name:"创建人",col:12},
  'modifiersName':{name:"修改人",col:12},
  'memberOf':{name:"用户权限",col:24},
  'sshPublicKey':{name:"用户公钥",col:24}
}
const other_profile={
  'description':{name:"备注/描述",col:12},
  'structuralObjectClass':{name:"结构对象类",col:12},
  'subschemaSubentry':{name:"subschemaSubentry",col:12},
  'entryCSN':{name:"entryCSN",col:24},
}
class UserInfo extends PureComponent {
  constructor(props){
    super(props)
  }
  onDeleteUser=(delkey)=>{
    const modal = Modal.confirm({
      title: '删除用户提示',
      content: `你确定要删除用户[${delkey}]吗？删除后无法恢复！`,
      onCancel: ()=>{Modal.destroyAll()},
      onOk: this.props.confirmDeletion.bind(this,[delkey])
    })
  }
  render(){
    const base_profile_html=[]
    const extra_profile_html=[]
    const other_profile_html=[]
    let userinfo=this.props.userinfo
    Object.keys(base_profile).filter(i=>userinfo.hasOwnProperty(i)).map(i=>{
      base_profile_html.push(
        <Col key={i} span={base_profile[i]['col']}>
          <DescriptionItem 
            title={`${base_profile[i]['name']}(${i})`} 
            content={userinfo[i]} 
            keyval={i} />
        </Col>
        )
    })
    Object.keys(extra_profile).filter(i=>userinfo.hasOwnProperty(i)).map(i=>{
      extra_profile_html.push(
        <Col key={i} span={extra_profile[i]['col']}>
          <DescriptionItem 
            title={`${extra_profile[i]['name']}(${i})`} 
            content={userinfo[i]} 
            keyval={i}/>
        </Col>)
    })
    Object.keys(userinfo).filter(i=>{
      return !(base_profile.hasOwnProperty(i) || 
      extra_profile.hasOwnProperty(i) ||
      i==='userPassword' ||
      i==='pwdHistory' )
    }).map(i=>{
      other_profile_html.push(
        <Col key={i} span={other_profile.hasOwnProperty(i)?other_profile[i]['col']:12}>
          <DescriptionItem 
            title={`${other_profile.hasOwnProperty(i)?other_profile[i]['name']:i}(${i})`} 
            content={userinfo[i]}
            keyval={i} />
        </Col>
        )
    })
    const loading=this.props.loading.effects['users/getUserAttribute']
    return (
      <Modal  
        title={<span>用户属性</span>}
        destroyOnClose
        centered
        visible={this.props.visible} 
        width={1000}
        footer={null}
        bodyStyle={{padding:"15px 25px",overflow:"auto"}}
        onCancel={this.props.handleDisplayModal} >
        <Spin tip="Loading..." spinning={loading}>
          <Divider style={{margin:"20px 0px"}} orientation="left">基本属性</Divider>
          <Row style={{paddingLeft:20}}>
            {base_profile_html}
          </Row>
          <Divider style={{margin:"20px 0px"}} orientation="left">扩展属性</Divider>
          <Row style={{paddingLeft:20}}>
            {extra_profile_html}
          </Row>
          <Divider style={{margin:"20px 0px"}} orientation="left">其它属性</Divider>
          <Row style={{paddingLeft:20}}>
            {other_profile_html}
          </Row>
        </Spin>
      </Modal>
    );
  }
}


export default UserInfo