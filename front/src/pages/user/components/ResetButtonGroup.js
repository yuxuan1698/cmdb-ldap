'use strict'
import {PureComponent} from 'react';
import {
  Modal,Tooltip,notification,Icon
} from 'antd';
import {formatMessage} from 'umi/locale';
import sendmailsvg from 'svgicon/sendmail.svg'
import restpasssvg from 'svgicon/restpass.svg'
import restsshkeysvg from 'svgicon/resetsshkey.svg'

export class ResetButtonGroup extends PureComponent {
  handleResetPassword=(userdn,username)=>{
    Modal.confirm({
      title: formatMessage({id:'userlist_userreset_password'},{username}),
      content: formatMessage({id:'userlist_userreset_password_msg'},{username}),
      onCancel: ()=>{Modal.destroyAll()},
      onOk: ()=>{
        const {dispatch}=this.props
        dispatch({type:'users/resetPasswordAction',payload:{userdn},callback:(data)=>{
          notification.success({
            message: formatMessage({id:'userlist_userreset_success'}),
            description: data.status
          })
        }})
      }
    })
  }
  handleResetSSHkey=(payload)=>{
    Modal.confirm({
      title: formatMessage({id:'userlist_userreset_sshkey'},{username:payload.username}),
      content: formatMessage({id:'userlist_userreset_sshkey_msg'},{username:payload.username}),
      onCancel: ()=>{Modal.destroyAll()},
      onOk: ()=>{
        const {dispatch}=this.props
        dispatch({type:'users/generateSSHKeyAndDownLoad',payload,callback:(data)=>{
          notification.success({
            message: formatMessage({id:'userlist_userreset_sshkey_success_title'}),
            description: formatMessage({id:'userlist_userreset_sshkey_success'})
          })
        }})
      }
    })
  }
  handleReSendChangePasswordMail=(userdata)=>{
    Modal.confirm({
      title: formatMessage({id:'userlist_userresend_changepass'},{...userdata}),
      content: formatMessage({id:'userlist_userresend_changepass_msg'},{...userdata}),
      onCancel: ()=>{Modal.destroyAll()},
      onOk: ()=>{
        const {dispatch}=this.props
        dispatch({type:'users/reSendChangePasswordAction',payload: {...userdata},callback:(data)=>{
          notification.success({
            message: formatMessage({id:'userlist_userresend_success'}),
            description: formatMessage({id:'userlist_userresend_success'})
          })
        }})
      }
    })
  }
  render(){
    const {restpassworddata,restsshkeyddata}=this.props
    return (
      <div>
          <Tooltip placement="top" 
            title={formatMessage({id:'userlist_table_resetpassword'},{username:restpassworddata.username})} 
            getPopupContainer={trigger => trigger.parentNode.parentNode} >
              <Icon style={{fontSize:22}} component={restpasssvg} onClick={this.handleResetPassword.bind(this,restpassworddata.userdn,restpassworddata.username)}/>
          </Tooltip>
          <Tooltip placement="top" 
            title={formatMessage({id:'userlist_userreset_sshkey'},{username:restpassworddata.username})} 
            getPopupContainer={trigger => trigger.parentNode.parentNode} >
              <Icon style={{fontSize:22,margin:"0 3px"}} onClick={this.handleResetSSHkey.bind(this,restsshkeyddata)} component={restsshkeysvg} />
          </Tooltip>
          <Tooltip placement="top" 
            title={formatMessage({id:'userlist_userresend_changepass'},{...restpassworddata})} 
            getPopupContainer={trigger => trigger.parentNode.parentNode} >
              <Icon style={{fontSize:22}} onClick={this.handleReSendChangePasswordMail.bind(this,restpassworddata)} component={sendmailsvg} />
          </Tooltip>
      </div>
    );
  }
}

