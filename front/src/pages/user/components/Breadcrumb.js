'use strict'

import {PureComponent} from 'react'
import { Breadcrumb, Icon, Badge } from 'antd';
import Link from 'umi/link';
import css from './index.less'
class CMDBBreadcrumb extends PureComponent {
  constructor(props){
    super(props)
  }
  
  render(){
    return (
    <div className={css.breadcrumb}>
      <Breadcrumb separator="/" >
        <Breadcrumb.Item>
          <Link to='/' >
          <Icon type='home' />主页</Link>
        </Breadcrumb.Item>
        {Object.keys(this.props.route).map(it=>{
          return (<Breadcrumb.Item key={`${it}${Math.random()}`}  >
            {this.props.route[it]===""?it:(<Link to={this.props.route[it]} >{it}</Link>)}
            </Breadcrumb.Item>)
        })}
      </Breadcrumb>
        <h1><Badge status="success" />{this.props.title}</h1>
    </div>)
  }
}

export default CMDBBreadcrumb;