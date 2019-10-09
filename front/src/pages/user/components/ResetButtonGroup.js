'use strict'
import {PureComponent} from 'react';
import {
  Modal,Tooltip,notification,Icon
} from 'antd';
import {formatMessage} from 'umi/locale';

const restpasssvg=props=><svg width="21px" height="21px" viewBox="0 0 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" >
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="test" fill="#D4237A" fillRule="nonzero">
            <path d="M13.1031505,5.50219707 C12.5186582,6.08673926 12.8048222,7.32008184 13.7424837,8.25775518 C14.6800771,9.1941033 15.9133485,9.48171898 16.4978069,8.89714281 C17.0810081,8.31392588 16.7947761,7.08065127 15.8571147,6.14290996 C14.9195212,5.20523659 13.6863178,4.91898014 13.1031505,5.50219707 Z M10.4781174,4.90835442e-16 C4.6904028,4.90835442e-16 0,4.69145075 0,10.4781174 C0,16.2647841 4.69037662,20.9562348 10.4781174,20.9562348 C16.2647841,20.9562348 20.9562348,16.2647841 20.9562348,10.4781174 C20.9562348,4.69145075 16.2648103,0 10.4781174,4.90835442e-16 Z M17.487683,11.6693265 C16.2894705,12.9228175 14.122262,12.7523664 12.3102845,11.3860554 L6.78621352,17.1652746 C6.35865395,17.6126476 5.66403304,17.6113452 5.23522857,17.1627349 C4.80517921,16.7128547 4.80396542,15.9861178 5.23280101,15.53881 L5.65173969,15.0991862 L4.46093428,13.8546492 C4.24656318,13.6290417 4.24656318,13.2650546 4.45968939,13.0420193 C4.67412275,12.8190165 5.0220712,12.8190165 5.23647346,13.0433217 L6.42727885,14.2891611 L6.81441043,13.8828135 L6.40154063,13.4509065 C6.1858935,13.2266013 6.1858935,12.8625817 6.40029574,12.6395789 C6.6134842,12.4152738 6.96143266,12.4165436 7.17580379,12.6408488 L7.58867359,13.0727884 L7.97583627,12.6677758 L6.78621352,11.421969 C6.57059753,11.1976313 6.57059753,10.834914 6.78496863,10.6106414 C6.9981571,10.3863037 7.34610555,10.3876061 7.56050781,10.6119438 L8.7513132,11.8577506 L10.7568409,9.7595908 C9.45701369,7.86392096 9.29530169,5.60299418 10.4922382,4.34943808 C11.882756,2.89469439 14.5768046,3.35486343 16.5075763,5.37481441 C18.439624,7.39610034 18.878232,10.2145503 17.4877142,11.669294 L17.487683,11.6693265 Z" id="Shape"></path>
        </g>
    </g>
</svg>
const restsshkeysvg = props =><svg width="22px" height="22px" viewBox="0 0 22 22" version="1.1" >
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="test" transform="translate(1.000000, 1.000000)" fillRule="nonzero">
        <rect id="RANC" stroke="#90F3E7" strokeWidth="0.1" fillOpacity="0.9" fill="#31C5B3" x="-0.05" y="-0.05" width="20.1" height="20.1" rx="4"></rect>
        <path d="M16.6775351,10.7218997 L14.0474082,10.7218997 L13.4119101,14.2647757 L12.0110312,14.2647757 L13.4351035,6.33522427 L14.8313437,6.33522427 L14.2839804,9.39670184 L16.9141074,9.39670184 L17.4661093,6.33522427 L18.8623496,6.33522427 L17.442916,14.2647757 L16.0420371,14.2647757 L16.6775351,10.7218997 Z M6.70121673,11.6955146 L8.03251555,11.61438 C8.05107033,12.1084018 8.12374213,12.4419516 8.25053313,12.6150396 C8.45463572,12.8963074 8.83191059,13.0369393 9.38236907,13.0369393 C9.84005365,13.0369393 10.1709423,12.9413817 10.3750448,12.7502639 C10.5791474,12.5591459 10.6811972,12.3283654 10.6811972,12.0579156 C10.6811972,11.8235257 10.5977019,11.6251987 10.4307089,11.4629288 C10.3131953,11.3439308 9.99081083,11.1510128 9.46354583,10.8841689 C8.93628082,10.617325 8.55127491,10.3946579 8.30851653,10.2161609 C8.06575816,10.037664 7.87480141,9.80598208 7.73564055,9.52110818 C7.5964797,9.23623428 7.52690032,8.90268441 7.52690032,8.52044855 C7.52690032,7.8533388 7.73409226,7.2998263 8.14848235,6.85989446 C8.56287244,6.41996261 9.16280134,6.2 9.94828704,6.2 C10.7461426,6.2 11.3638529,6.41815964 11.8014365,6.85448548 C12.2390201,7.29081132 12.4794555,7.87136841 12.52275,8.59617415 L11.1821738,8.66649076 C11.1481567,8.28786091 11.0306448,7.99758236 10.8296347,7.79564644 C10.6286246,7.59371051 10.3317525,7.49274406 9.9390097,7.49274406 C9.55245177,7.49274406 9.27645356,7.57207484 9.11100677,7.73073879 C8.94555997,7.88940273 8.86283782,8.08953265 8.86283782,8.33113457 C8.86283782,8.55831248 8.93860204,8.7458216 9.09013274,8.89366755 C9.24166345,9.04511949 9.57719069,9.25246131 10.0967245,9.51569922 C10.8791178,9.90875306 11.3769969,10.2278792 11.5903769,10.4730871 C11.9089006,10.833687 12.0681601,11.2970508 12.0681601,11.8631926 C12.0681601,12.5627564 11.8308171,13.1604417 11.356124,13.6562665 C10.8814309,14.1520913 10.2204267,14.4 9.37309173,14.4 C8.78861615,14.4 8.28223287,14.2855113 7.85392669,14.0565303 C7.42562051,13.8275494 7.12333675,13.5093248 6.94706634,13.101847 C6.77079592,12.6943691 6.68884687,12.2255963 6.70121673,11.6955146 Z M1.10121672,11.6955146 L2.43251555,11.61438 C2.45107033,12.1084018 2.52374213,12.4419516 2.65053313,12.6150396 C2.85463572,12.8963074 3.23191059,13.0369393 3.78236907,13.0369393 C4.24005365,13.0369393 4.57094227,12.9413817 4.77504485,12.7502639 C4.97914743,12.5591459 5.0811972,12.3283654 5.0811972,12.0579156 C5.0811972,11.8235257 4.99770194,11.6251987 4.83070891,11.4629288 C4.71319531,11.3439308 4.39081083,11.1510128 3.86354583,10.8841689 C3.33628082,10.617325 2.95127491,10.3946579 2.70851653,10.2161609 C2.46575816,10.037664 2.27480141,9.80598208 2.13564055,9.52110818 C1.9964797,9.23623428 1.92690032,8.90268441 1.92690032,8.52044855 C1.92690032,7.8533388 2.13409226,7.2998263 2.54848235,6.85989446 C2.96287244,6.41996261 3.56280134,6.2 4.34828704,6.2 C5.14614259,6.2 5.76385288,6.41815964 6.20143645,6.85448548 C6.63902002,7.29081132 6.87945544,7.87136841 6.92274993,8.59617415 L5.58217376,8.66649076 C5.54815666,8.28786091 5.43064481,7.99758236 5.2296347,7.79564644 C5.02862458,7.59371051 4.73175254,7.49274406 4.3390097,7.49274406 C3.95245177,7.49274406 3.67645356,7.57207484 3.51100677,7.73073879 C3.34555997,7.88940273 3.26283782,8.08953265 3.26283782,8.33113457 C3.26283782,8.55831248 3.33860204,8.7458216 3.49013274,8.89366755 C3.64166345,9.04511949 3.97719069,9.25246131 4.49672454,9.51569922 C5.27911777,9.90875306 5.77699691,10.2278792 5.99037688,10.4730871 C6.30890061,10.833687 6.46816009,11.2970508 6.46816009,11.8631926 C6.46816009,12.5627564 6.23081708,13.1604417 5.75612395,13.6562665 C5.28143082,14.1520913 4.62042669,14.4 3.77309173,14.4 C3.18861615,14.4 2.68223287,14.2855113 2.25392669,14.0565303 C1.82562051,13.8275494 1.52333674,13.5093248 1.34706633,13.101847 C1.17079592,12.6943691 1.08884687,12.2255963 1.10121672,11.6955146 Z" id="合并形状" fill="#FFFFFF"></path>
      </g>
    </g>
  </svg>

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
  render(){
    const {restpassworddata,restsshkeyddata}=this.props
    return (
      <div>
          <Tooltip placement="top" 
            title={formatMessage({id:'userlist_table_resetpassword'},{username:restpassworddata.username})} 
            getPopupContainer={trigger => trigger.parentNode.parentNode} >
              <Icon style={{marginRight:4}} component={restpasssvg} onClick={this.handleResetPassword.bind(this,restpassworddata.userdn,restpassworddata.username)}/>
          </Tooltip>
          <Tooltip placement="top" 
            title={formatMessage({id:'userlist_userreset_sshkey'},{username:restpassworddata.username})} 
            getPopupContainer={trigger => trigger.parentNode.parentNode} >
              <Icon  onClick={this.handleResetSSHkey.bind(this,restsshkeyddata)} component={restsshkeysvg} />
          </Tooltip>
      </div>
    );
  }
}

