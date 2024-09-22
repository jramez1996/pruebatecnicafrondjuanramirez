
import React, { useState } from 'react';
import {useHistory} from "react-router-dom";
import GeneralComponent from '../components/General';
import { Form, Input, Button } from 'antd';
import { Card } from 'antd';
import { Layout } from 'antd';
import {requestApi} from '../api/index.js';
import {  useDispatch } from "react-redux";
import {loaderSpiner} from '../redux/actions';
import swal from 'sweetalert';
import { CheckOutlined,CloseOutlined } from '@ant-design/icons';

import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { Header } = Layout;
const FormLayoutDemo = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('vertical');
  const [errorMensaje, setErrorMensaje] = useState(null);
  const [tipoVista, setTipoVista] = useState(1);
  const [listRestricciones, setListRestricciones] = useState([
    {
      keyUnique:"length8",
      text:"Elegir una contraseña de no menos de ocho caracteres.",
      check:null
    },
    {
      keyUnique:"letranumber",
      text:"Utilizar combinaciones de letras con números.",
      check:null
    },
    {
      keyUnique:"especial",
      text:"Insertar algún caracter especial como.",
      check:null
    },
    {
      keyUnique:"mayusculasminusculas",
      text:"Utilizar letras mayúsculas y minúsculas.",
      check:null
    }
  ]);
 
  const myArrListRestricciones = listRestricciones.map( (item, i) => (

    item.check==true ?
      (<li key={i} className="CheckOutlined"><CheckOutlined  />{item.text}</li>)
    : 
    
    (item.check==false ?
      (<li key={i} className="CloseOutlined"><CloseOutlined  />{item.text}</li>)
    : 
    (
      item.check==null ?
        (<li key={i} className="listRestrict">{item.text}</li>)
      : 
        null
    )
      
    )
    
  )  
  );
  const history = useHistory();
  const dispatch = useDispatch();

  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };
  const validarContrasenia=(e)=>{
    let listlistRestricciones=[...listRestricciones];
    listlistRestricciones.forEach(element => {
      if(element.keyUnique=="length8"){
        if(e.target.value.length<8){
          element.check=false;
        }else{
          element.check=true;
        }
      }
      if(element.keyUnique=="letranumber"){
        element.check=null;
        
        if(checkPasswordComplexity(e.target.value)){
          element.check=true;
        }else{
          element.check=false;
        }
      
      }
      if(element.keyUnique=="mayusculasminusculas"){
        element.check=null;
        //console.log("e.target.value.search(/[a-zñáéíóú]/)",e.target.value.search(/[a-zñáéíóú]/));
        if(validarMayusculasMininusculas(e.target.value)){
          element.check=true;
        }else{
          element.check=false;
        }

      }
      if(element.keyUnique=="especial"){
        //e.target.value.search(/[a-zA-Z1-9ñÁÉÍÓÚáéíóú]/)
        if(validarCaracterEspecial(e.target.value)){
          element.check=true;
        }else{
          element.check=false;
        }
      }
      
    });
    setListRestricciones(listlistRestricciones);
  }
  const validarMayusculasMininusculas= (pwd)=> {
    var reMayusculas = new RegExp("(?=.*[A-ZÑ])");
    var reMinusculas = new RegExp("(?=.*[a-zñ])");
    var reNumero = new RegExp("(?=.*[0-9])");
    return (reMayusculas.test(pwd) && reMinusculas.test(pwd))  && reNumero.test(pwd);
  }
  const validarCaracterEspecial= (pwd)=> {
    return /[.*+\-?^♠${}()@|[\]\\]/g.test(pwd);
  }
  const checkPasswordComplexity= (pwd)=> {
    var reMinusculas = new RegExp("(?=.*[a-zñ])");
    var reMayusculas = new RegExp("(?=.*[A-ZÑ])");
    var reNumero = new RegExp("(?=.*[0-9])");
    return (reMayusculas.test(pwd) || reMinusculas.test(pwd))  && reNumero.test(pwd);
  }
  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 14,
          },
        }
  : null;
  const iniciarSession=async()=>{
    dispatch(loaderSpiner({
      loaderSpiner:true
    }));
    try{
      const dataRequest={
        "userName":form.getFieldValue("Correo") ,
        "password": form.getFieldValue("Contrasena") 
      }
      let respon=await requestApi(
        `auth/authenticate`,
        dataRequest,
        "post"
      );
      if(respon.token){
       await localStorage.setItem("tokenAdmin",respon.token);
       await localStorage.setItem("_dataadmin",JSON.stringify(respon));
       setErrorMensaje(null);
       await history.push("/");
      }else{
        setErrorMensaje(respon.mensaje);
      }
    }catch(e){
      console.log("e-e-e",e);
      return e;
    }finally{
      dispatch(loaderSpiner({
        loaderSpiner:false
      }));
    }
  }
  const restablecerContrasenia=()=>{
    setTipoVista(2);
    
  }
  const restablecerContraseniaConfirmar=async()=>{
    form.validateFields()
			.then(async(values) => {
        dispatch(loaderSpiner({
          loaderSpiner:true
        }));
        try{
          const dataRequest={
            "usuario":form.getFieldValue("Correo") 
          }
          let respon=await requestApi(
            `usuarioAdmin/restablecerContrasenia`,
            dataRequest,
            "post"
          );
          if(respon.estado){
           setTipoVista(3);
           setErrorMensaje(null);
           //await history.push("/");
          }else{
            setErrorMensaje(respon.mensaje);
          }
        }catch(e){
          return e;
        }finally{
          dispatch(loaderSpiner({
            loaderSpiner:false
          }));
        }
			})
			.catch((errorInfo) => {
      });
  }
  const restablecerContraseniaConfirmarActualizar=()=>{
    form.validateFields()
			.then(async(values) => {
        let validar=listRestricciones.filter((val)=>{
          return !(val.check===true);
        });
        if(validar.length==0){
          dispatch(loaderSpiner({
            loaderSpiner:true
          }));
          try{
            const dataRequest={
              "correo":form.getFieldValue("Correo") ,
              "contrasenia":form.getFieldValue("Contrasenia") ,
              "codigo":form.getFieldValue("Codigo") 
            }
            let respon=await requestApi(
              `usuarioAdmin/actualizarContrasenia`,
              dataRequest,
              "post"
            );
            if(respon.estado){
              swal({
                title: "Restablecer Contraseña",
                text: respon.mensaje,
                icon:  respon.estado ? "success":"error",
                button: "aceptar"
              });
              await history.push("/");
            }else{
              setErrorMensaje(respon.mensaje);
            }
          }catch(e){
            console.log("e-e-e",e);
            return e;
          }finally{
            dispatch(loaderSpiner({
              loaderSpiner:false
            }));
            
          }
        }



			})
			.catch((errorInfo) => {
      });
  }
  return (
    <GeneralComponent>
      <Header  className="headTitleApp" style={{ background:"#006FC0" }}>
       SISTEMA DE VENTAS
      </Header>
      {
        tipoVista==1 ?
        <Card className="carLogin" style={{ margin:"auto"}}>
        <Form
          {...formItemLayout}
          layout={formLayout}
          form={form}
          initialValues={{
            layout: formLayout,
          }}
          onValuesChange={onFormLayoutChange}
          layout="vertical"
        >
          <Form.Item name="Correo" label="Correo"
          rules={[{ required: true, message: 'Se Requiere de usuario.' }]}>
            <Input placeholder="" autoComplete="off" />
          </Form.Item>
          <Form.Item name="Contrasena" label="Contraseña">
            <Input type="password" placeholder=""  autoComplete="off" />
          </Form.Item>
          {
            errorMensaje!=null ? 
         
            <span className="errorMensaje"> {errorMensaje}</span>
          
          :
          null
          }

          <Form.Item>
            <Button className="iniciarLogin" style={{ margin:"auto",display:"block" }} 
            type="primary"
            onClick={()=>{iniciarSession()}}>Iniciar Sessión</Button>
          </Form.Item>
        </Form>
        </Card> :
         null
      }
    {
        tipoVista==2 ?
        <Card className="carLogin" style={{ margin:"auto"}}>
        <Form
          {...formItemLayout}
          layout={formLayout}
          form={form}
          initialValues={{
            layout: formLayout,
          }}
          onValuesChange={onFormLayoutChange}
          layout="vertical"
        >
          <Form.Item name="Correo" label="Correo"
           rules={[{ required: true, message: 'Se Requiere de Correo.' },{
            type: "email",
            message: "El formato del correo es invalido."
          }]}>
            <Input placeholder="" autoComplete="off"  onChange={(e)=>{setErrorMensaje(null)}}  />
          </Form.Item>
          {
            errorMensaje!=null ? 
            <span className="errorMensaje"> {errorMensaje}</span>
          :
          null
          }
          <div className="formItemOlvideContrasenia">
            <a className="linkForm" onClick={()=>{setTipoVista(1); }}>{'<'} Iniciar Sessión</a>
          </div>
          <Form.Item>
            <Button className="iniciarLogin" style={{ margin:"auto",display:"block" }} 
            type="primary"
            onClick={()=>{restablecerContraseniaConfirmar()}}>restablecer</Button>
          </Form.Item>
        </Form>
        </Card> :
         null
      }
    {
        tipoVista==3 ?
        <Card className="carLogin" style={{ margin:"auto"}}>
        <span className="mensajeExitoso"></span>
        <ul className="listRestric">
          {
            myArrListRestricciones
          }
        </ul>
        <Form
          {...formItemLayout}
          layout={formLayout}
          form={form}
          initialValues={{
            layout: formLayout,
          }}
          onValuesChange={onFormLayoutChange}
          layout="vertical"
        >
          <Form.Item name="Codigo" label="Còdigo"
            rules={[{ required: true ,
              message: 'Se requiere de Còdigo.',}]}>
            <Input placeholder="" autoComplete="off" />
          </Form.Item>
          <Form.Item 
            name="Contrasenia" label="Contraseña"
            rules={[{ required: true, message: 'Se Requiere de contraseña.' }]}
            >
              <Input.Password
                  placeholder=""
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  onChange={(e)=>{validarContrasenia(e)}} 
            />
          </Form.Item>
          <Form.Item 
          name="ContraseniaConfirm"
          label="Contraseñia Confirmación"
          rules={[
            {
              required: true,
              message: 'Se Requiere de Contraseña.',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('Contrasenia') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Las dos contraseñas que ingresó no coinciden'));
              },
            }),
          ]}>
            <Input.Password
                  placeholder=""
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          {
            errorMensaje!=null ? 
            <span className="errorMensaje"> {errorMensaje}</span>
          :
          null
          }
          <Form.Item>
            <Button className="iniciarLogin" style={{ margin:"auto",display:"block" }} 
            type="primary"
            onClick={()=>{restablecerContraseniaConfirmarActualizar()}}>restablecer</Button>
          </Form.Item>
        </Form>
        </Card> :
         null
      }
    </GeneralComponent>
  );
};
export default FormLayoutDemo;