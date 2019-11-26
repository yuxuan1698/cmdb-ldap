'use strict'

import {PureComponent} from 'react'
import { Breadcrumb, Icon, Badge } from 'antd';
import Link from 'umi/link';
import {formatMessage} from 'umi/locale';
import css from './index.less'
class CMDBBreadcrumb extends PureComponent {
  constructor(props){
    super(props)
    this.state={}
  }
  
  render(){
    const {route,title}=this.props
    return (
    <div className={css.breadcrumb}>
      <Breadcrumb separator="/" >
        <Breadcrumb.Item>
          <Link to='/' >
          <Icon type='home' />{formatMessage({id:'breadcrumb_homepage'})}</Link>
        </Breadcrumb.Item>
        {Object.keys(route).map(it=>{
          return (<Breadcrumb.Item key={`${it}${Math.random()}`}  >
            {route[it]===""?formatMessage({id:it}):(<Link to={route[it]} >{formatMessage({id:it})}</Link>)}
            </Breadcrumb.Item>)
        })}
      </Breadcrumb>
        <h1><Badge status="success" />{formatMessage({id:title})}</h1>
    </div>)
  }
}

export default CMDBBreadcrumb;