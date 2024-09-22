import {useState,useEffect} from 'react';
import  {requestApi}  from '../../api/index';
import { Table } from 'antd';
import swal from 'sweetalert';
import {  Input } from 'antd';
import {
  Form,
  Button,
  Select,
} from 'antd';

import { Card } from 'antd';
import * as React from 'react';
import {  useDispatch } from "react-redux";
import {loaderSpiner} from '../../redux/actions';
import { Transfer } from 'antd';

const { Option } = Select;

const  GestionPermisos=(props)=> {
      const mockData = [];
      for (let i = 0; i < 20; i++) {
        mockData.push({
          key: i.toString(),
          title: `content${i + 1}`,
          description: `description of content${i + 1}`,
        });
    }
    const columnsOrden = [
      {
        title: 'Fecha Registro',
        dataIndex: 'fecharegistro',
        key: 'fecharegistro',
        width: "40%",
        render: data =><> 
        {data.substr(0,10)}
       </>
       
      },
      {
        title: 'Moneda Origen',
        dataIndex: 'origen',
        key: 'origen',
        width: "20%",
      },
      //sending

      {
        title: 'valor',
        dataIndex: 'valor',
        key: 'valor',
        width: "20%",
      },
 
      {
        title: 'Acción',
        dataIndex: 'id',
        sorter: false,
        render: (data,obj) =><> 
         <Button  type="primary"  onClick={()=>{verDatos(obj)}}>
          Editar
        </Button>
        </>
        ,
        width: '20%'
      },
    ];
    const [loading,setLoading] = useState(false);
    const [form] = Form.useForm();
    const [componentSize, setComponentSize] = useState('large');
    const listRef = React.createRef();
    const [idEdit, setIdEdit] = React.useState(null);
    //const [listadoOpcionesSinAsignar, setListadoOpcionesSinAsignar] = React.useState([]);
    //const [listadoOpcionesAsignados, setListadoOpcionesnAsignados] = React.useState([]);
    const [listDataMoneda, setListDataMoneda] = React.useState([]);
    const [listadoData,setListadoData] = useState([]);
    const [editObj,sEditObj] = useState(null);
    const [listadoOpciones,setListadoOpciones] = useState([]);

    const [tipoFormulario, setTipoFormulario] = React.useState(1);

    const dispatch = useDispatch();
    const onFormLayoutChange = ({ size }) => {
      setComponentSize(size);
    };
    useEffect(()=>{
        let isSubscribed = true
        if(listRef?.current!=null){
          cargarDataMonedas();
          listarData();
          //listadoOpcionesSistema();
          setListadoOpciones([]);
          //listadoOpcionesSistema();
          if (!isSubscribed) return;
        }
        
        return () => isSubscribed = false;
    },[]);

    useEffect(()=>{
      let isSubscribed = true
      if(listRef?.current!=null){
       
        if(editObj!=null){
          form.setFieldsValue({
            currencyFrom: editObj.monedaOrigen,
            currencyTo:editObj.monedaDestino,
            exchangeRate:editObj.valor
          });
          
        }
        if (!isSubscribed) return;
      }
      
      return () => isSubscribed = false;
  },[editObj]);
    //editObj
   //verDatos(datos)
   const verDatos=(datos)=>{
    console.log("datos:",datos);
    setIdEdit(datos.id);
    
    setTipoFormulario(3);
    cargarDataMonedas();
    sEditObj(datos);

//exchangeRate
    console.log("datos.monedaOrigen:",datos.monedaOrigen);
    console.log("form.monedaOrigen:",form);

    //form
  }
    const cargarDataMonedas = async() => {
      dispatch(loaderSpiner({
        loaderSpiner:true
      }));
      try{
        let respon=await requestApi(
          `moneda/obtenerMonedas`,
          {},
          "get"
        );
        console.log("respon:",respon);
        if(Array.isArray(respon)){
          setListDataMoneda(respon );

        }else{
          setListDataMoneda([] );

        }
        dispatch(loaderSpiner({
          loaderSpiner:false
        }));
      }catch(e){
        return [];
      }finally{
        dispatch(loaderSpiner({
          loaderSpiner:false
        }));      
      }
    
    };

    const listarData = async() => {
      dispatch(loaderSpiner({
        loaderSpiner:true
      }));

      try{
        let respon=await requestApi(
          `tipoCambio/listado`,
          {},
          "get"
        );
        console.log("respon.ssssss:",respon.data );
        console.log("respon.respon.state:",respon.status );
        if(respon.status){

          setListadoData(respon.data ) 
        }else{
          
          setListadoData([]) 
        }
       
        

      }catch(e){
        return [];
      }finally{
        dispatch(loaderSpiner({
          loaderSpiner:false
        }));      
      }
    
    };
  

  const registrarTipoCambio=async()=>{
    dispatch(loaderSpiner({
      loaderSpiner:true
    }));
    try{
     // let targetKeys;

      let respon=await requestApi(
        `tipoCambio/nuevoTipoCambio`,
        {
          "valor":parseFloat(form.getFieldValue("exchangeRate")),//exchangeRate
          "monedaOrigen":form.getFieldValue("currencyFrom"),
          "monedaDestino":(form.getFieldValue("currencyTo")),
      },
        "post"
      );
      if(respon.status){
        swal({
          title: "tipo de Cambio",
          text:"Se registro el tipo de Cambio con Exito.",
          icon: "success",
          button: "aceptar"
        });
      }else{
        swal({
          title: "tipo de Cambio",
          text:"El tipo de Cambio ya se Registro.",
          icon:"error",
          button: "aceptar"
        });
      }
    }catch(e){
      return e;
    }finally{
      dispatch(loaderSpiner({
        loaderSpiner:false
      }));
    }
   
  }
  const actualizarTipoCambio=async()=>{
    dispatch(loaderSpiner({
      loaderSpiner:true
    }));
    try{
     // let targetKeys;

      let respon=await requestApi(
        `tipoCambio/actualizarTipoCambio`,
        {
          "id":editObj.id,
          "valor":parseFloat(form.getFieldValue("exchangeRate")),//exchangeRate
          "monedaOrigen":form.getFieldValue("currencyFrom"),
          "monedaDestino":(form.getFieldValue("currencyTo")),
      },
        "put"
      );
      if(respon.status){
        swal({
          title: "tipo de Cambio",
          text:"Se Actualizo el tipo de Cambio con Exito.",
          icon: "success",
          button: "aceptar"
        });
      }else{
        swal({
          title: "tipo de Cambio",
          text:"El tipo de Cambio ya se Registro.",
          icon:"error",
          button: "aceptar"
        });
      }
    }catch(e){
      return e;
    }finally{
      dispatch(loaderSpiner({
        loaderSpiner:false
      }));
    }
   
  }
  const onFinish = (values) => {
    console.log('Form values:', values);
    swal({
      title: "Tipo de cambio",
      text: idEdit==null ? " ¿Deseas Registrar Tipo de Cambio?" : " ¿Deseas Editar Tipo de Cambio?",
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
        if(idEdit==null){
          registrarTipoCambio();
          setTipoFormulario(1);setIdEdit(null);sEditObj(null);
          listarData();
        }else{
          actualizarTipoCambio();
          setTipoFormulario(1);setIdEdit(null);sEditObj(null);
          listarData();
        }
      }
    });
    // Aquí puedes enviar los valores a tu API o realizar alguna acción con ellos
  };
  const formStyle = {
    display: idEdit ? 'block' : 'none',
  };
  return (
    <div ref={listRef}   className="contentPago">
      <Card title={idEdit==null ? "Gestionar Cambio" : "Editar Cambio"} bordered={false} style={{ width: "100%" }}>

      <Form               form={form}  style={formStyle} onFinish={onFinish}>
                  <Form.Item
                    name="currencyFrom"
                    id="currencyFrom"
                    label="Moneda de origen"
                    rules={[{ required: true, message: 'Por favor, selecciona la moneda de origen' }]}
                  >
                    <Select  disabled={idEdit!=null ? true : false}  placeholder="Selecciona la moneda de origen">
                    {listDataMoneda.map((item, i) => (
                            (<Option value={item.id} key={i} >{item.nombre}</Option>)
            
                            )  
                        )}
                      {/* Agrega aquí más opciones de monedas según tus necesidades */}
                    </Select>
                  </Form.Item>
            
                  <Form.Item
                    name="currencyTo"
                    label="Moneda destino"
                    rules={[{ required: true, message: 'Por favor, selecciona la moneda destino' }]}
                  >
                    <Select disabled={idEdit!=null ? true : false} placeholder="Selecciona la moneda destino">
                    {listDataMoneda.map((item, i) => (
                            (<Option value={item.id} key={i} >{item.nombre}</Option>)
            
                            )  
                        )}        
                    </Select>
                  </Form.Item>
            
                  <Form.Item
                    name="exchangeRate"
                    label="Valor de la moneda"
                    rules={[{ required: true, message: 'Por favor, ingresa el valor de la moneda' }]}
                  >
                    <Input type="number"  placeholder="Ingrese el valor de la moneda" />
                  </Form.Item>
            
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      {idEdit!=null ? 'Editar tipo de cambio' : 'Registrar tipo de cambio'}
                    </Button>
                    <Button  style={{marginLeft:10,background:"#fff"}} onClick={()=>{setTipoFormulario(1);setIdEdit(null);sEditObj(null);listarData();}}>
                      Regresar
                    </Button>
                  </Form.Item>
                    </Form>

        {
          tipoFormulario==1 ?
          <>
          
          <Button type="primary" htmlType="button" onClick={()=>{setTipoFormulario(2)}}>
            
            {idEdit!=null ? 'Editar' : 'Nuevo'}
          </Button>
          </>

      :
      null
     }
{
!(  tipoFormulario==2 || tipoFormulario==3) ?
  <>
    <Table
        scroll={{ x: 'calc(700px + 50%)', y: 340 }}
        columns={columnsOrden}
        dataSource={listadoData}
        rowKey={record => record.id}
        pagination={true}
        loading={loading}
      />

  </>
   : 
   null
}

      </Card>
    </div>
    );
 
}
export default GestionPermisos;