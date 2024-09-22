import { useEffect } from 'react';
import {useState} from 'react';
import {useHistory } from "react-router-dom";
import GeneralComponent from '../components/General';
import { Layout} from 'antd';
import * as React from 'react'
import { Menu } from 'antd';
import { HiDocumentReport } from 'react-icons/hi';
import { FcMoneyTransfer } from "react-icons/fc";
import { MdPerson } from "react-icons/md";
import MediaQuery from 'react-responsive';
import { Drawer } from 'antd';
import {  Dropdown } from 'antd';
import { Modal} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {requestApi} from '../api/index.js';
import {  useDispatch } from "react-redux";
import {
  MenuOutlined,
  UserOutlined,
  ImportOutlined
} from '@ant-design/icons';

import { Avatar } from 'antd';
import { CheckOutlined,CloseOutlined } from '@ant-design/icons';
import MenuComponent from './Menu';
import swal from 'sweetalert';
import { Form, Input } from 'antd';
import {loaderSpiner} from '../redux/actions';
const { Header, Sider, Content } = Layout;
const ConentGeneral = (props) => {
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(null);
  const [dataUser, setDataUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('vertical');
  //
//  layout={"vertical"}

  const [errorMensaje, setErrorMensaje] = useState(null);
  const dispatch = useDispatch();
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
  const IconAll = ({type, ...rest}) => {
    if(type=="MdPerson"){
      return <MdPerson/>
    }
    if(type=="FcMoneyTransfer"){
      return <FcMoneyTransfer/>
    }

    //FcMoneyTransfer
    const icons = require(`@ant-design/icons`);
    const Component = icons[type];
    return <Component {...rest}/>
    //<MdPerson/> --MdPerson
  }
  const [listadoMenu,setListadoMenu] = React.useState([
    {
      "code":"OPTPER",
      "text":"Tipo de Cambio",
      "icon": <IconAll type="SecurityScanOutlined" /> ,
      "mostrar":true,
      "children":[
       
        {
          "code":"OPTPERGEST",
          "text":"Gestionar Tipo de Cambio",
          "link":"gestionTipoCambio",
          "mostrar":true
        }
      ]
    }
   
  ]);
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
 
    useEffect(()=>{
      let itemData=localStorage.getItem("_dataadmin")==null || localStorage.getItem("_dataadmin")=="" ? null : JSON.parse(localStorage.getItem("_dataadmin"));
      if(itemData==null){
        setDataUser(null);
      }else{
        setDataUser(itemData);
        (async()=>{
        // await cargarOpcionesMenu();
        })();
      }
    },[]);
    const toggle = () => {
      showDrawer();
      setCollapsed(!collapsed);
    };
    const cargarOpcionesMenu=async()=>{
      dispatch(loaderSpiner({
        loaderSpiner:true
      }));
      try{
        let respon=await requestApi(
          `security/opcionesSistema`,
          {},
          "get"
        );
        let opcionSistemaRender=[];
       // let templistadoMenu=[...listadoMenu];
        let data =respon.estado ? respon.data : {};
  
        for (let index = 0; index < listadoMenu.length; index++) {
          const element = listadoMenu[index];
          console.log("submenuI:",submenuI);
          let submenuI=listadoMenu[element].submenu;
          console.log("submenuI:",submenuI);
          let clavesSub = Object.keys(submenuI);
          let subChildren=[];
          for (let subIndex = 0; subIndex < clavesSub.length; subIndex++) {
            const elementSub = clavesSub[subIndex];
            subChildren.push(              {
              "code":elementSub,
              "text":data[element].submenu[elementSub].r_name,
              "link":data[element].submenu[elementSub].r_link,
              "mostrar":true
            });
          }
          opcionSistemaRender.push(      {
            "code":element,
            "text":data[element].name,
            "icon": <IconAll type="SecurityScanOutlined" /> ,
            "mostrar":true,
            "children":subChildren
          });
          
        }
        setListadoMenu(opcionSistemaRender);

       
      
      }catch(e){
        return e;
      }finally{
        dispatch(loaderSpiner({
          loaderSpiner:false
        }));
      }


    }
    const cerrarSession=()=>{
      swal({
        title: "Sessión",
        text: " ¿Deseas Cerrar Sessión?",
        icon: "warning",
      // buttons: true,
        dangerMode: true,
        buttons: {
          cancel: "Cancelar",
          catch: {
            text: "Aceptar",
            value: "catch",
          }
        }
      })
      .then((willDelete) => {
        if (willDelete) {
          localStorage.removeItem("tokenAdmin");
          localStorage.removeItem("_dataadmin");
          history.push("/");
        }
      });
    }
    const showModal = () => {
      setIsModalVisible(true);
    };

    const handleOk = async() => {
      //setIsModalVisible(false);

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
              "correo": dataUser.correo ,
              "contraseniaActual":form.getFieldValue("ContraseniaActual") ,
              "contraseniaNueva":form.getFieldValue("Contrasenia") 
            }
            let respon=await requestApi(
              `usuarioAdmin/actualizarContraseniaCambio`,
              dataRequest,
              "post"
            );
            if(respon.estado){
              swal({
                title: "Actualizar Contraseña",
                text: respon.mensaje,
                icon:  respon.estado ? "success":"error",
                button: "aceptar"
              });
              form.setFieldsValue({
                ContraseniaActual: ""
              });
              form.setFieldsValue({
                Contrasenia: ""
              });
              form.setFieldsValue({
                ContraseniaConfirm: ""
              });
              let listlistRestricciones=[...listRestricciones];
              listlistRestricciones.forEach(element => {
                element.check=null;
              });
              setListRestricciones(listlistRestricciones);
              handleCancel();
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
    };
    
    const handleCancel = () => {
      setIsModalVisible(false);
    };
  const myArrListRestricciones = listRestricciones.map( (item, i) => (

    item.check==true ?
      (<li key={item.text+"-"+i} className="CheckOutlined"><CheckOutlined  />{item.text}</li>)
    : 
    
    (item.check==false ?
      (<li key={item.text+"-"+i} className="CloseOutlined"><CloseOutlined  />{item.text}</li>)
    : 
    (
      item.check==null ?
        (<li key={item.text+"-"+i} className="listRestrict">{item.text}</li>)
      : 
        null
    )
      
    )
    
  )  
  );
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
        if(validarMayusculasMininusculas(e.target.value)){
          element.check=true;
        }else{
          element.check=false;
        }

      }
      if(element.keyUnique=="especial"){
        if(validarCaracterEspecial(e.target.value)){
          element.check=true;
        }else{
          element.check=false;
        }
       


      }
      
    });
    setListRestricciones(listlistRestricciones);
    //setListRestricciones
  }
  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };
  const checkPasswordComplexity= (pwd)=> {
    var reMinusculas = new RegExp("(?=.*[a-zñ])");
    var reMayusculas = new RegExp("(?=.*[A-ZÑ])");
    var reNumero = new RegExp("(?=.*[0-9])");
    return (reMayusculas.test(pwd) || reMinusculas.test(pwd))  && reNumero.test(pwd);
  }
  const validarCaracterEspecial= (pwd)=> {
    return /[.*+\-?^♠${}()@|[\]\\]/g.test(pwd);
  }
  const validarMayusculasMininusculas= (pwd)=> {
    var reMayusculas = new RegExp("(?=.*[A-ZÑ])");
    var reMinusculas = new RegExp("(?=.*[a-zñ])");
    var reNumero = new RegExp("(?=.*[0-9])");
    return (reMayusculas.test(pwd) && reMinusculas.test(pwd))  && reNumero.test(pwd);
  }
  const menuSession  = (
    <Menu>
      <Menu.Item key="3" onClick={()=>{cerrarSession()}}>Cerrar Sessión</Menu.Item>
    </Menu>
  );
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  return (<GeneralComponent> 
    <Layout>
    <Modal title="Mi Información" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form
          {...formItemLayout}
          layout={formLayout}
          form={form}
          initialValues={{
            layout: formLayout,
          }}
        >
        <span><strong>Correo:</strong>{ dataUser==null ? null : dataUser.correo}</span>   
        <ul className="listRestric">
          {
            myArrListRestricciones
          }
        </ul>
        <Form.Item 
          name="ContraseniaActual" label="Contraseña Actual"
          rules={[{ required: true, message: 'Se Requiere de contraseña Actual.' }]}
          >
            <Input.Password
                placeholder=""
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        <Form.Item 
            name="Contrasenia" label="Contraseña Nueva"
            rules={[{ required: true, message: 'Se Requiere de Nueva contraseña .' }]}
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
              message: 'Se Requiere de Contraseña Confirmación.',
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
        </Form>
    </Modal>
    <MediaQuery minWidth={750}>
     <Sider  width={250} className="Sider-content" trigger={null} collapsible collapsed={collapsed}>
        <div className="contentHeadGeneral">
          <span className="spanHeadGeneral">{!collapsed ? 'Sistema Venta': null }</span>
        </div>
        <MenuComponent listadoMenu={listadoMenu} clickMenu={()=>{setVisible(false)}}/>
     </Sider>
    </MediaQuery>
    <MediaQuery minResolution={"2dppx"} maxWidth={749}>
      <div>
        <Drawer title='Sistema Tipo' placement="left" onClose={onClose} open={visible}>
            <MenuComponent listadoMenu={listadoMenu} clickMenu={()=>{setVisible(false)}}/>
        </Drawer>
        <Layout className="site-layout">
          <Header className="site-layout-background site-layout-header" style={{ padding: 0,height:58 }}>
            {React.createElement(collapsed ? MenuOutlined : MenuOutlined, {
              className: 'trigger',
              onClick: ()=>{toggle()},
            })}
            <Dropdown overlay={menuSession} trigger={['click']}>
            <div  className="avatarUserLogin">
              <Avatar  size={40} icon={<UserOutlined />} >
                
              </Avatar>
            </div>
            </Dropdown>
     
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
              {props.children}
          </Content>
        </Layout>
      </div>
    </MediaQuery>
    <MediaQuery minWidth={750}>
    <Layout className="site-layout">
          <Header className="site-layout-background site-layout-header" style={{ padding: 0 }}>
            {React.createElement(collapsed ? MenuOutlined : MenuOutlined, {
              className: 'trigger',
              onClick: ()=>{toggle()},
            })}
            <Dropdown overlay={menuSession} trigger={['click']}>
            <div  className="avatarUserLogin">
              <Avatar  size={40} icon={<UserOutlined />} >
                
              </Avatar>
            </div>
            </Dropdown>
     
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            {props.children}
          </Content>
        </Layout>

    </MediaQuery>


  </Layout></GeneralComponent>
  );
};

export default ConentGeneral;