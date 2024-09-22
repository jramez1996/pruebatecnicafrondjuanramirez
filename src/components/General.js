
import * as React from 'react';
import {useEffect} from 'react';
import {useHistory } from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import { useSelector } from 'react-redux';
import {useState} from 'react';
const General = (props) => {
const history = useHistory();

  const loaderSpiner = useSelector((state) => state.state.loaderSpiner);
const [collapsed, setCollapsed] = useState(false);
  useEffect(()=>{
    setCollapsed(false);
    if(history.location.pathname=="/login"){
      if(localStorage.getItem("tokenAdmin")!=null){
        history.push("/");
      }
     
    }else{
      if(localStorage.getItem("tokenAdmin")==null){
        history.push("/login");
      }
    }
    setCollapsed(true);
  },[history,props.children]);


  return (<div className="appGeneral">
  {
      
      props.children
    }
      
 
  </div>
  );
};

export default General;