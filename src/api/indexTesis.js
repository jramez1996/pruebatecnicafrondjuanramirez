import axios from "axios";
export const hostUrl = `https://nodetesismonitoreo.herokuapp.com/`;
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
        url:  /*process.env.MODEDEV=='development' ? */ `http://localhost:3005/${endPoint}` /* :   `https://ramez-ecommerce.herokuapp.com/${endPoint}`*/, //Endpoint
        //url: `https://nodetesismonitoreo.herokuapp.com/${endPoint}`, //Endpoint
        method: method, //Método
        data: payload,
        responseType:responseType,
        headers: headers
    });
    return data.data;
};