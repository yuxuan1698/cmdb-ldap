'use strict'

import { connect } from 'dva';
import {PureComponent} from 'react'
import { routerRedux } from 'dva/router';

function mapStateToProps(state) {  
  return {...state};  
}  

class CMDB extends PureComponent {
  constructor(props){
    super(props)
    let {login,dispatch}=this.props
    console.log(this.props)
    if(!login.islogin){
      dispatch(routerRedux.push({
        pathname:'login'
      }))
    }
  }
  componentDidMount() {
    // console.log()
  }
  render(){
    return <div>1</div>
  }
}

export default connect(mapStateToProps)(CMDB);
// export default CMDB