'use strict'
import {PureComponent} from 'react';
import {
  Modal,Menu, Dropdown,Button,Tooltip ,Icon
} from 'antd';
import {formatMessage} from 'umi/locale';
const ButtonGroup = Button.Group;


export class UserEditButton extends PureComponent {
  onDeleteUser=(delkey)=>{
    Modal.confirm({
      title: formatMessage({id:'userlist_useredit_del'}),
      content: formatMessage({id:'userlist_useredit_del_content'},{delkey}),
      onCancel: ()=>{Modal.destroyAll()},
      onOk: this.props.confirmDeletion.bind(this,[delkey])
    })
  }
  render(){
    const {delkey,pwdAccountLockedTime}=this.props
    return (
      <div>
        <ButtonGroup size="small">
          <Tooltip placement="topLeft" title={formatMessage({ id: 'userlist_useredit_edit' })} getPopupContainer={trigger => trigger.parentNode.parentNode} >
            <Button type="Default" icon="bars" onClick={()=>{
           this.props.showHideUserDrawer('update',delkey)
          }}/>
          </Tooltip>{
            pwdAccountLockedTime===""?(
              <Tooltip placement="top" title={formatMessage({ id: 'userlist_useredit_lock' })} getPopupContainer={trigger => trigger.parentNode.parentNode} >
              <Button type="Default" icon="lock"onClick={()=>{
                Modal.confirm({
                  title: formatMessage({id:'userlist_useredit_lock'}),
                  content: formatMessage({id:'userlist_useredit_lock_content'},{delkey}),
                  onCancel: ()=>{Modal.destroyAll()},
                  onOk: ()=>{
                    this.props.onLockUnLockUser({dn:delkey,lock:true})
                    Modal.destroyAll()
                  }
                })
              }} />
            </Tooltip>):(
                <Tooltip placement="top" title={formatMessage({ id: 'userlist_useredit_unlock' })} getPopupContainer={trigger => trigger.parentNode.parentNode} >
              <Button type="Default" icon="unlock"onClick={()=>{
                Modal.confirm({
                  title: formatMessage({id:'userlist_useredit_unlock'}),
                  content: formatMessage({id:'userlist_useredit_lock_content'},{delkey}),
                  onCancel: ()=>{Modal.destroyAll()},
                  onOk: ()=>{
                    this.props.onLockUnLockUser({dn:delkey,lock:false})
                    Modal.destroyAll()}
                })
              }} />
            </Tooltip>)
          }
          <Tooltip placement="topRight" title={formatMessage({ id: 'userlist_useredit_del' })} getPopupContainer={trigger => trigger.parentNode.parentNode} >
            <Button type="danger" icon="delete" onClick={this.onDeleteUser.bind(this,delkey)} />
          </Tooltip>
        </ButtonGroup>
      </div>
    );
  }
}

export class UserBatchButton extends PureComponent {

  onDeleteUser=(userkeys)=>{
    Modal.confirm({
      title: formatMessage({id:'userlist_useredit_del'}),
      content: formatMessage({id:'userlist_useredit_delall_content'}),
      onCancel: ()=>{Modal.destroyAll()},
      onOk: this.props.confirmDeletion.bind(this,userkeys)
    })
  }
  
  render(){
    const {delkeys}=this.props
    const menu = (
      <Menu>
        <Menu.Item>
          <div onClick={this.onDeleteUser.bind(this,delkeys)} ><Icon type="usergroup-delete" />
            {formatMessage({id:'userlist_useredit_batchdel'})}
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <div target="_blank" ><Icon type="lock" theme="twoTone" />
          {formatMessage({id:'userlist_useredit_batchlock'})}
          </div>
        </Menu.Item>
        <Menu.Item>
          <div><Icon type="unlock" theme="twoTone" />
          {formatMessage({id:'userlist_useredit_batchunlock'})}
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <div><Icon type="export" />
          {formatMessage({id:'userlist_useredit_exportuser'})}
          </div>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu}>
        <Button  {...this.props} >
          {formatMessage({id:'userlist_useredit_batch'})}
          <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}

