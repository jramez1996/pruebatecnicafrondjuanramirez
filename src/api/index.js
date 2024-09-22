import axios from "axios";
import swal from 'sweetalert';
export const requestApi = async (
    endPoint,
    payload = {},
    method = "POST",
    headers = {},
    responseType="json"
) => {
    headers= {
        'Authorization': 'Bearer ' + localStorage.getItem("tokenAdmin")
      };

        let data=await axios({
            url: /* process.env.MODEDEV=='development' ? */ `http://localhost:8080/${endPoint}` /*:   `https://ramez-ecommerce.herokuapp.com/${endPoint}`*/, //Endpoint
            //url: `https://nodetesismonitoreo.herokuapp.com/${endPoint}`, //Endpoint
            method: method, //Método
            data: payload,
            responseType:responseType,
            headers: headers
        });
        if(data.data.errorApi){
            swal({
                title: "Restablecer Contraseña",
                text: "Mensaje del error",
                icon:"error",
                button: "aceptar"
              }).then(function() {
                localStorage.clear();
                window.location = "/";
            });
            console.log("errorApi",data.data.errorApi);
        }
        return data.data;        
};