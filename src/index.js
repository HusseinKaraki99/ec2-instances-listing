import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initJsStore } from "./Storage_service/idb_service";
import axios from 'axios';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
axios.get('https://raw.githubusercontent.com/vantage-sh/ec2instances.info/master/www/instances.json')
  .then(res => {
    initJsStore(res.data)
  })
  .catch(err => {
    initJsStore()
    console.log(err)
  })



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
