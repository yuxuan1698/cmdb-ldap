'use strict'

import {PureComponent} from 'react';
import {
  Modal,Row,Col,Divider,Tag, Spin,Icon,Popover,Button,message
} from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {formatTimeAndZone,downloadSSHKey} from 'utils'
import css from './index.less'
import {formatMessage} from 'umi/locale';
import downloadsvg from 'svgicon/download.svg'
import copytoclipsvg from 'svgicon/copytoclip.svg'
const ButtonGroup=Button.Group
const color=["blue","cyan","geekblue","magenta","red","volcano","green","orange","gold","lime","purple"];

const base_profile={
  'uid':{name:formatMessage({id:'ldap_uid'}),col:12},
  'sn':{name:formatMessage({id:'ldap_sn'}),col:12},
  'cn':{name:formatMessage({id:'ldap_cn'}),col:12},
  'givenName':{name:formatMessage({id:'ldap_givenName'}),col:12},
  'ou':{name:formatMessage({id:'ldap_ou'}),col:12},
  'departmentNumber':{name:formatMessage({id:'ldap_departmentNumber'}),col:12},
  'uidNumber':{name:formatMessage({id:'ldap_uidNumber'}),col:12},
  'gidNumber':{name:formatMessage({id:'ldap_gidNumber'}),col:12},
  'loginShell':{name:formatMessage({id:'ldap_loginShell'}),col:12},
  'homeDirectory':{name:formatMessage({id:'ldap_homeDirectory'}),col:12},
  'mail':{name:formatMessage({id:'ldap_mail'}),col:12},
  'mobile':{name:formatMessage({id:'ldap_mobile'}),col:12},
  'entryDN':{name:formatMessage({id:'ldap_entryDN'}),col:12},
  'entryUUID':{name:formatMessage({id:'ldap_entryUUID'}),col:12},
  'objectClass':{name:formatMessage({id:'ldap_objectClass'}),col:24},
}
const extra_profile={
  'createTimestamp':{name:formatMessage({id:'ldap_createTimestamp'}),col:12},
  'modifyTimestamp':{name:formatMessage({id:'ldap_modifyTimestamp'}),col:12},
  'pwdChangedTime':{name:formatMessage({id:'ldap_pwdChangedTime'}),col:12},
  'hasSubordinates':{name:formatMessage({id:'ldap_hasSubordinates'}),col:12},
  'manager':{name:formatMessage({id:'ldap_manager'}),col:12},
  'creatorsName':{name:formatMessage({id:'ldap_creatorsName'}),col:12},
  'modifiersName':{name:formatMessage({id:'ldap_modifiersName'}),col:12},
  'memberOf':{name:formatMessage({id:'ldap_memberOf'}),col:24},
  'sshPublicKey':{name:formatMessage({id:'ldap_sshPublicKey'}),col:24}
}
const other_profile={
  'pwdFailureTime':{name:formatMessage({id:'ldap_pwdFailureTime'}),col:12},
  'pwdAccountLockedTime':{name:formatMessage({id:'ldap_pwdAccountLockedTime'}),col:12},
  'description':{name:formatMessage({id:'ldap_description'}),col:12},
  'structuralObjectClass':{name:formatMessage({id:'ldap_structuralObjectClass'}),col:12},
  'subschemaSubentry':{name:"subschemaSubentry",col:12},
  'entryCSN':{name:"entryCSN",col:24},
}
class UserInfo extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      downloadkey:false
    }
  }
  handleDownLoadPubicKey=(key)=>{
    let userinfo=this.props.userinfo
    downloadSSHKey({publickey:key},userinfo.uid||userinfo.cn)
  }
  DescriptionItemFun= ({ title, content,keyval }) => {
    let index=0
    let formatcontent=(<div className={css.userinfo_value}>{
      content instanceof Array?content.map(i=>{
          if(index>color.length) index=0
          index+=1
          if(keyval==='memberOf') return <Tag key={i} color={color[index-1]}>{i}</Tag>
          let datavalue=formatTimeAndZone(i)
          return content.length>1?<Tag key={i} color={color[index-1]}>{datavalue}</Tag>:
            <CopyToClipboard text={datavalue} onCopy={()=>message.success(`${datavalue}已经复制到剪贴板上`)} >
              <Tag key={i} style={{ background: '#fff', borderStyle: 'dashed' }} >{datavalue}</Tag>
            </CopyToClipboard>
          }):<CopyToClipboard text={content} onCopy={()=>message.success(`${content}已经复制到剪贴板上`)} >
              <Tag style={{ background: '#fff', borderStyle: 'dashed' }} >{content}</Tag>
            </CopyToClipboard>}
      </div>)
    if(keyval==='sshPublicKey'){
      formatcontent=<span><Tag style={{ background: '#fff', borderStyle: 'dashed' }} >{content[1]}</Tag>
      <Popover placement="top" content={
        <ButtonGroup size="small">
            <CopyToClipboard text={content[0]} onCopy={()=>message.success("SSHKey公钥已经复制到剪贴板上了。")} >
              <Button title="复制到剪贴板" ><Icon style={{cursor:"pointer",margin:1,fontSize:20}} component={copytoclipsvg} /></Button>
            </CopyToClipboard>
            <Button title="下载此公钥到本地" 
              loading={this.state.downloadkey} 
              onClick={this.handleDownLoadPubicKey.bind(this,content[0])}>
                <Icon style={{cursor:"pointer",margin:1,fontSize:20}} component={downloadsvg} />
            </Button>
        </ButtonGroup>
        } >
          <div className={css.userinfo_sshpublickey}>
            <span>{content[0]}</span>
          </div>
        </Popover>
      </span>
    }
    return <div className={css.userinfo_boxstyle} >
            <p className={css.userinfo_title} >
              {title}:
            </p>
            {formatcontent}
        </div>
  }
  render(){
    const DescriptionItem=this.DescriptionItemFun
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
      return i
    })
    Object.keys(extra_profile).filter(i=>userinfo.hasOwnProperty(i)).map(i=>{
      extra_profile_html.push(
        <Col key={i} span={extra_profile[i]['col']}>
          <DescriptionItem 
            title={`${extra_profile[i]['name']}(${i})`} 
            content={userinfo[i]} 
            keyval={i}/>
        </Col>)
      return i
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
      return i
    })
    const loading=this.props.loading.effects['users/getUserAttribute']
    return (
      <Modal  
        title={<span><Icon type='user'/>{formatMessage({id:'userlist_user_info'})}</span>}
        destroyOnClose
        centered
        visible={this.props.visible} 
        width={1000}
        footer={null}
        bodyStyle={{padding:"15px 25px",overflow:"auto"}}
        onCancel={this.props.handleDisplayModal} >
        <Spin tip="Loading..." spinning={loading}>
          <Divider style={{margin:"20px 0px"}} orientation="left">{formatMessage({id:'userlist_user_base_attr'})}</Divider>
          <Row style={{paddingLeft:20}}>
            {base_profile_html}
          </Row>
          <Divider style={{margin:"20px 0px"}} orientation="left">{formatMessage({id:'userlist_user_extra_attr'})}</Divider>
          <Row style={{paddingLeft:20}}>
            {extra_profile_html}
          </Row>
          <Divider style={{margin:"20px 0px"}} orientation="left">{formatMessage({id:'userlist_user_other_attr'})}</Divider>
          <Row style={{paddingLeft:20}}>
            {other_profile_html}
          </Row>
        </Spin>
      </Modal>
    );
  }
}


export default UserInfo