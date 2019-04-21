import React from 'react';
import {connect} from 'dva';
import LoginFrom from '../components/login';


const RouterLogin = ({login, loading,dispatch }) => {
  return (
    <LoginFrom login={login} loading={loading} dispatch={dispatch} />
  );
}
 
export default connect(({ login, loading }) => ({ login, loading }))(RouterLogin);
