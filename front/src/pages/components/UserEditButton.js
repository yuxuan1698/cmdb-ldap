'use strict'
import {PureComponent} from 'react';
import {
  Modal,Menu, Dropdown,Button,Tooltip ,Icon,message
} from 'antd';
const ButtonGroup = Button.Group;


export class UserEditButton extends PureComponent {
  confirmDeletion=(delkey)=>{
    const {dispatch}=this.props
    dispatch({type:'users/postLDAPDeleteUser',payload: {uid:[delkey]},callback:(data)=>{
      message.info(data.status)
      dispatch({type:'users/getUserList'})
    }})
  }
  onDeleteUser=(delkey)=>{
    const modal = Modal.confirm({
      title: '删除用户提示',
      content: `你确定要删除用户[${delkey}]吗？删除后无法恢复！`,
      onCancel: ()=>{Modal.destroyAll()},
      onOk: this.confirmDeletion.bind(this,delkey)
    })
  }
  render(){
    const delkey=this.props.delkey
    return (
      <div>
        <ButtonGroup size="small">
          <Tooltip placement="topLeft" title={'编辑用户'} >
            <Button type="Default" icon="edit" />
          </Tooltip>
          <Tooltip placement="top" title='锁定用户' >
            <Button type="Default" icon="lock" />
          </Tooltip>
          <Tooltip placement="topRight" title='删除用户' >
            <Button type="danger" icon="delete" onClick={this.onDeleteUser.bind(this,delkey)} />
          </Tooltip>
        </ButtonGroup>
      </div>
    );
  }
}

export class UserBatchButton extends PureComponent {
  confirmDeletion=()=>{
    alert('确定删除了')
  }
  onDeleteUser=(userkey)=>{
    const modal = Modal.confirm({
      title: '删除用户提示',
      content: `你确定要删除这个用户吗？删除后无法恢复！`,
      onCancel: ()=>{Modal.destroyAll()},
      onOk: this.confirmDeletion.bind(this)
    })
  }
  
  render(){
    const delkey=this.props.delkey
    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" >批量删除</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a target="_blank" >批量锁定</a>
        </Menu.Item>
        <Menu.Item>
          <a >批量解锁</a>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu}>
        <Button >
          批量操作<Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}

