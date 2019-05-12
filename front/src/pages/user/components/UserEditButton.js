'use strict'
import {PureComponent} from 'react';
import {
  Modal,Menu, Dropdown,Button,Tooltip ,Icon
} from 'antd';
const ButtonGroup = Button.Group;


export class UserEditButton extends PureComponent {
  onDeleteUser=(delkey)=>{
    const modal = Modal.confirm({
      title: '删除用户提示',
      content: `你确定要删除用户[${delkey}]吗？删除后无法恢复！`,
      onCancel: ()=>{Modal.destroyAll()},
      onOk: this.props.confirmDeletion.bind(this,[delkey])
    })
  }
  render(){
    const delkey=this.props.delkey
    return (
      <div>
        <ButtonGroup size="small">
          <Tooltip placement="topLeft" title={'编辑用户'} getPopupContainer={trigger => trigger.parentNode} >
            <Button type="Default" icon="bars" onClick={()=>{
           this.props.showHideUserDrawer('update',delkey)
          }}/>
          </Tooltip>
          <Tooltip placement="top" title='锁定用户' getPopupContainer={trigger => trigger.parentNode} >
            <Button type="Default" icon="lock"onClick={()=>{
           const modal = Modal.confirm({
            title: '貌似有此功能',
            content: `你确定要锁定用户[${delkey}]吗？`,
            onCancel: ()=>{Modal.destroyAll()},
            onOk: ()=>{Modal.destroyAll()}
          })
          }} />
          </Tooltip>
          <Tooltip placement="topRight" title='删除用户' getPopupContainer={trigger => trigger.parentNode} >
            <Button type="danger" icon="delete" onClick={this.onDeleteUser.bind(this,delkey)} />
          </Tooltip>
        </ButtonGroup>
      </div>
    );
  }
}

export class UserBatchButton extends PureComponent {

  onDeleteUser=(userkeys)=>{
    const modal = Modal.confirm({
      title: '删除用户提示',
      content: `你确定要删除这些用户吗？删除后无法恢复哦！`,
      onCancel: ()=>{Modal.destroyAll()},
      onOk: this.props.confirmDeletion.bind(this,userkeys)
    })
  }
  
  render(){
    const {delkeys}=this.props
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={this.onDeleteUser.bind(this,delkeys)} ><Icon type="usergroup-delete" />批量删除</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a target="_blank" ><Icon type="lock" theme="twoTone" />批量锁定</a>
        </Menu.Item>
        <Menu.Item>
          <a ><Icon type="unlock" theme="twoTone" />批量解锁</a>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu}>
        <Button  {...this.props} >
          批量操作<Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}

