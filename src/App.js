
import './App.css';
import * as React from 'react'
import 'antd/dist/antd.css';
import es_ES from 'antd/es/locale/es_ES';
import { ConfigProvider } from 'antd';
import ComponentRouter from './router/index';

//import useStore from '../src/redux/store';
import useStore from '../src/redux/store';
import { Provider } from 'react-redux';
function App() {

  return (
   
    <ConfigProvider locale={es_ES}>
     <Provider store={useStore}>  
       <ComponentRouter/>
       </Provider>
    </ConfigProvider>
    
    
  );
}

export default App;
