'use strict'

import {PureComponent} from 'react';
import {
  Modal,Row,Col,Divider,Tag, Spin,Icon,Popover,Button,message
} from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {formatTimeAndZone,downloadSSHKey} from 'utils'
import css from './index.less'
import {formatMessage} from 'umi/locale';

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
const downloadsvg=props=><svg t="1562295924938" viewBox="0 0 1279 1024" version="1.1" p-id="9531" width="20" height="20"><path d="M602.079848 807.392611a47.880904 47.880904 0 0 0 16.768711 10.255244 49.613209 49.613209 0 0 0 19.60969 4.088239c1.663013 0 3.118149-0.762214 4.850453-0.900798a49.266748 49.266748 0 0 0 34.646096-13.511978l389.837867-371.752605a44.27771 44.27771 0 0 0 0-64.857491 49.821085 49.821085 0 0 0-68.114224 0l-312.784951 297.956422V45.871431a48.504534 48.504534 0 0 0-96.316145 0v620.650155L280.009744 370.921099a49.890378 49.890378 0 0 0-68.114224 0 44.347002 44.347002 0 0 0 0 64.857491z m628.272297-116.341589a48.088781 48.088781 0 0 0-49.197456 46.841521v145.513601a48.088781 48.088781 0 0 1-49.197455 46.841521H147.800244a48.088781 48.088781 0 0 1-49.197456-46.841521v-145.513601a49.197456 49.197456 0 0 0-98.325619 0v145.513601c0 77.537962 66.174042 140.593856 147.523075 140.593856h983.949113c81.349032 0 147.523075-63.055894 147.523075-140.593856v-145.513601a48.088781 48.088781 0 0 0-48.920287-46.910813z" fill="#0091ff" p-id="9532"></path></svg>
const copytoclipsvg=props=><svg t="1562297756616" viewBox="0 0 1024 1024" version="1.1" p-id="27970" width="20" height="20"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#B7EB81" p-id="27971"></path><path d="M245.76 286.72c0-16.96768 13.70112-30.72 30.73024-30.72H747.52A30.6688 30.6688 0 0 1 778.24 286.72v491.52c0 16.96768-13.70112 30.72-30.73024 30.72H276.48A30.6688 30.6688 0 0 1 245.76 778.24V286.72z m194.56 133.12c0 11.38688 9.18528 20.48 20.52096 20.48h214.95808A20.44928 20.44928 0 0 0 696.32 419.84c0-11.38688-9.18528-20.48-20.52096-20.48H460.84096A20.44928 20.44928 0 0 0 440.32 419.84z m0 122.88c0 11.38688 9.18528 20.48 20.52096 20.48h214.95808A20.44928 20.44928 0 0 0 696.32 542.72c0-11.38688-9.18528-20.48-20.52096-20.48H460.84096A20.44928 20.44928 0 0 0 440.32 542.72z m0 122.88c0 11.38688 9.18528 20.48 20.52096 20.48h214.95808A20.44928 20.44928 0 0 0 696.32 665.6c0-11.38688-9.18528-20.48-20.52096-20.48H460.84096A20.44928 20.44928 0 0 0 440.32 665.6z m-71.68-204.8a40.96 40.96 0 1 0 0-81.92 40.96 40.96 0 0 0 0 81.92z m0 122.88a40.96 40.96 0 1 0 0-81.92 40.96 40.96 0 0 0 0 81.92z m0 122.88a40.96 40.96 0 1 0 0-81.92 40.96 40.96 0 0 0 0 81.92z" fill="#FFFFFF" p-id="27972"></path><path d="M451.40992 194.56h-52.06016C376.69888 194.56 358.4 212.91008 358.4 235.54048v61.46048c0 5.64224 4.57728 10.19904 10.21952 10.19904h286.76096c5.632 0 10.21952-4.56704 10.21952-10.19904v-61.46048A40.96 40.96 0 0 0 624.64 194.56h-52.04992a61.46048 61.46048 0 0 0-121.18016 0z" fill="#00BB74" p-id="27973"></path></svg>
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
          <Tag key={i} style={{ background: '#fff', borderStyle: 'dashed' }} >{datavalue}</Tag>
          }):<Tag style={{ background: '#fff', borderStyle: 'dashed' }} >{content}</Tag>}</div>)
    if(keyval==='sshPublicKey'){
      formatcontent=<Popover placement="top" content={
        <ButtonGroup size="small">
            <CopyToClipboard text={content} onCopy={()=>message.info("SSHKey公钥已经复制到剪贴板上了。")} >
              <Button title="复制到剪贴板" ><Icon style={{cursor:"pointer"}} style={{margin:1}} component={copytoclipsvg} /></Button>
            </CopyToClipboard>
            <Button title="下载此公钥到本地" 
              loading={this.state.downloadkey} 
              onClick={this.handleDownLoadPubicKey.bind(this,content)}>
                <Icon style={{cursor:"pointer"}} style={{margin:1}} component={downloadsvg} />
            </Button>
        </ButtonGroup>
        } >
          <div className={css.userinfo_sshpublickey}>
            <span>{content}</span>
          </div>
        </Popover>
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