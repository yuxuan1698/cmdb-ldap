'use strict'

import {PureComponent} from 'react';
import PropTypes from 'prop-types';
import css from './index.less'
import {
  Button, Empty,Icon,Dropdown,Menu,Input
} from 'antd';
import {formatMessage} from 'umi/locale';

const {Search}=Input

class SelectFieldButton extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      searchValue:""
    }
  }
  initAddFieldMenu=()=>{
    const {mayField,currField,addInputField,LDAP_MAP_FIELDS}=this.props
    let items=mayField
    .filter(it=>{
      return !currField.includes(it) && it.indexOf(this.state.searchValue)>-1?true:false
    }).map(it=>{
      return (<Menu.Item onClick={addInputField.bind(this)} key={it}>
          <span>{LDAP_MAP_FIELDS.hasOwnProperty(it)?`${it}(${LDAP_MAP_FIELDS[it]})`:it}</span>
        </Menu.Item>)
    })
    if(items.length===0){
      items= <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={formatMessage({id:'userlist_useradd_notfount_field'})} />
    }
    return (
      <Menu>
        <div className={css.field_search_class}>
          <Search value={this.state.searchValue} onChange={this.handleSearchChange.bind(this)}  placeholder="Search Field"  />
        </div>
        {items}
      </Menu>
    )
  }
  handleSearchChange=(e)=>{
    this.setState({
      searchValue:e.target.value
    })
  }
  render(){
    const { selectedItems }=this.props
    return (
      <Dropdown trigger={['click']} 
        overlayStyle={{maxHeight:300,overflow:"auto",boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"}}
        disabled={selectedItems.filter(i=>i!=='top').length>0?false:true}
        overlay={this.initAddFieldMenu.bind(this)} >
        <Button block type="dashed"  >
          <Icon type="plus" /> 
          {formatMessage({id:'userlist_useradd_addfield_button'})}
        </Button>
      </Dropdown>
    )
  }
}
SelectFieldButton.propTypes = {
    mayField: PropTypes.array.isRequired,
    currField: PropTypes.array.isRequired,
    selectedItems: PropTypes.array,
    addInputField: PropTypes.func,
    LDAP_MAP_FIELDS: PropTypes.object
  }; 
export default SelectFieldButton