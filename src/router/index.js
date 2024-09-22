import React, { useEffect }  from 'react';
import { useHistory } from "react-router-dom";
import { BrowserRouter, Switch } from 'react-router-dom';
import { Route} from 'react-router';

import ComponentNotFound from '../components/NotFound';
import GestionPermisosComponent from '../components/gestionPermisos/GestionPermisos';
//import ListadoGestionImpuestoComponent from '../components/Impuesto/ListadoGestionImpuesto';
//import GestionListadoGestionImpuestoCiudadano from '../components/Impuesto/gestionImpuestoCiudadano/ListadoGestionImpuestoCiudadano';
import ComponentContent from '../components/ContentGeneral';
import LoginComponent from '../components/login';

///GestionKeyLogger
const AppPrincipal=(props)=>{
  const history = useHistory();
  useEffect(()=>{
  },[history]);

  return (
    <BrowserRouter >
           
          <Switch>
          <Route
              path="/login"
              exact 
              render={() =><LoginComponent /> } />
            <Route
              path="/"
              exact 
              render={() =><ComponentContent> <GestionPermisosComponent /> </ComponentContent> } />
            
          <Route
              exact 
              path="/gestionTipoCambio"
              render={() =><ComponentContent> <GestionPermisosComponent /> </ComponentContent> } />
          
                     <Route render={() =><> <ComponentNotFound  /> </> } />
     
          </Switch>
 
        </BrowserRouter>
      );
}
export default AppPrincipal;
//gestionKeyLogger