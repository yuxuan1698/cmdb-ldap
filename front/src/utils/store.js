// index.js
import dva from 'dva';
// import { message } from 'antd';
import createLoading from 'dva-loading';
import { createBrowserHistory as createHistory } from 'history';

// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
app.use(createLoading());

// 3. Model
// app.model(require('./models/app/global').default);

// 4. Router
// app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store;