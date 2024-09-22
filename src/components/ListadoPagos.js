import {useState,useEffect} from 'react';
import { Table } from 'antd';
import { Select } from 'antd';
import reqwest from 'reqwest';
import { Card } from 'antd';
import * as React from 'react';
import { Row, Col } from 'antd';
import { Form } from 'antd';
import { DatePicker, Space  } from 'antd';
import {  Button } from 'antd';
import { Layout } from 'antd';
import moment from 'moment';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;

const { Option } = Select;
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    render: name => `${name.first} ${name.last}`,
    width: '20%',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
    ],
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];

const getRandomuserParams = params => (

    {
  
  results:  params.pagination.pageSize,
  page: params.pagination.current,
  ...params,
});

const  App=()=> {
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="https://www.antgroup.com">Excel</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="https://www.aliyun.com">Pdf</a>
      </Menu.Item>
    </Menu>
  );
  const [loading,setLoading] = useState(false);
  const listRef = React.createRef();
  const {  Content } = Layout;
  const [form] = Form.useForm();
  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);
  const [predioSeleccionado, setPredioSeleccionado] = useState();
  const [ciudadanoSeleccionado, setCiudadanoSeleccionado] = useState();
  const [listadoCiudadano, setListadoCiudadano] = useState([
  {
    "id":"1",
    "descripcion":"DIRECCION CARBALLIO"
  },
  {
    "id":"2",
    "descripcion":"DIRECCION CARBALLIO 2"
  }]);
  const [listadoPredio, setListadoPredio] = useState([
    {
      "id":"1",
      "descripcion":"DIRECCION CARBALLIO"
    },
    {
      "id":"2",
      "descripcion":"DIRECCION CARBALLIO 2"
    }]);

  const [pagination,setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [data,setData] = useState([]);
  useEffect(()=>{
      let isSubscribed = true
      if(listRef?.current!=null){
        if (!isSubscribed) return;
        (async()=>{
          await fetch({ pagination });
        })();
      }
      
      return () => isSubscribed = false;
  },[]);
  const  handleTableChange = (pagination, filters, sorter) => {
    fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };
  const children = [];
  for (let i = 0; i < 10; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
  }

  const fetch = (params = {}) => {
    //this.setState({ loading: true });
    setLoading(true);
    reqwest({
      url: 'https://randomuser.me/api',
      method: 'get',
      type: 'json',
      data: getRandomuserParams(params),
    }).then(data => {
      console.log(data);
      setLoading(false);
      setPagination({
        ...params.pagination,
        total: 100,
       
      });
     let dataResponse=data.results;
     dataResponse.forEach(element => {
       //element["width"]="50%";
     });
     setData(dataResponse);
    });
  };

  const limpiarFiltro=()=>{
    console.log("limpiar");
    setFechaHasta(null);
    setFechaDesde(null);
    setPredioSeleccionado(undefined);
    setCiudadanoSeleccionado(null);
  }
  return (
    <div ref={listRef}   className="contentPago">
      <Card title="Filtro  de Pagos" bordered={false} style={{ width: "100%" }}>
          <Content> 
            <Row>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} >
                <div className="formGroup">
                  <label>Ciudadano</label>
                  <Select   
                    allowClear
                    showSearch
                    name="ciudadano"
                    style={{ width: "100%" }} 
                    className="formControlform formControl"
                    label="Ciudadano"
                    placeholder="Seleccione Ciudadano"  
                    onChange={(e)=>{setCiudadanoSeleccionado(e) }} 
                    bordered={true} 
                    value={ciudadanoSeleccionado}
                    >
                    {listadoCiudadano.map((item, i) => (
                      (<Option value={item.descripcion} key={i} >{item.descripcion}</Option>)

                      )  
                  )}
                  </Select>
                </div>                
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} >
                <div className="formGroup">
                  <label>Predio</label>
                  <Select   
                    allowClear  
                    name="predio"
                    showSearch
                    mode="multiple"
                    style={{ width: "100%" }} 
                    className="formControlform formControl"
                    label="Predio"
                    placeholder="Seleccione Ciudadano"  
                    bordered={true}  
                    onChange={(e)=>{setPredioSeleccionado(e) }}
                    value={predioSeleccionado}
                    >
                    {listadoPredio.map((item, i) => (
                      (<Option value={item.id} key={i} >{item.descripcion}</Option>)

                      )  
                  )}
                  </Select>
                </div>                
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} >
                  <div className="formGroup" style={{width:"100%"}}>
                      <label>Periodo Inicial</label><br/>
                      <DatePicker 
                        name="peridoInicial"
                        allowClear
                        style={{width:"100%"}}
                        label=""  
                        placeholder="" 
                        defaultValue={null} 
                        value={fechaDesde==null ? null :  moment(fechaDesde, 'YYYY-MM-DD')}   
                        onChange={(value)=>{value._d!=undefined ? setFechaDesde(value._d) : setFechaDesde(null) } }
                        disabledDate={(current) => {
                          let customDate = moment().format("YYYY-MM-DD");
                          return current && current > moment(customDate, "YYYY-MM-DD");
                        }} 
                        />
                    </div>      
                

              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} >
              <div className="formGroup" style={{width:"100%"}}>
                      <label>Periodo Final</label><br/>
                      <DatePicker
                        name="peridoFinal" 
                        allowClear
                        style={{width:"100%"}}
                        label="" 
                        value={fechaHasta==null ? null :  moment(fechaHasta, 'YYYY-MM-DD')}   
                        placeholder="" //moment(e._d).format("YYYY-MM-DD")
                        onChange={(e)=>{if(e!=null){console.log("e",e);setFechaHasta(e._d);}else{setFechaHasta(null);}  }} 
                        disabledDate={(current) => {
                          let customDate = moment().format("YYYY-MM-DD");
                          return current && current > moment(customDate, "YYYY-MM-DD");
                        }}  />
                    </div>
              </Col>
            </Row>
          </Content>
          <div className="dowExport">
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  Exportar <DownOutlined />
                </a>
              </Dropdown>
          </div>
          <div className="contentFiltroBtn">
            <Button  className="btnAccion btnFiltrar" onClick={()=>{limpiarFiltro();}} >Limpiar</Button>
            <Button type="primary" className="btnAccion btnFiltrar" onClick={()=>{}} >Filtrar</Button>
          </div>
      </Card>
    
      <Table
        scroll={{ x: 'calc(700px + 50%)', y: 340 }}
        columns={columns}
        dataSource={data}
        rowKey={record => record.login.uuid}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
    );
 
}
export default App;