
import * as React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import { Card } from 'antd';
import { Layout } from 'antd';
import { Menu, Dropdown } from 'antd';
import {  Button } from 'antd';
import { Upload } from 'antd';
import { FileExcelOutlined ,ImportOutlined} from '@ant-design/icons';

const SincronizacionDatos = (props) => {
  const {  Content } = Layout;
  React.useEffect(()=>{
    console.log(" <SettingOutlined/>");

  },[]);
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="#">Excel</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="#">Pdf</a>
      </Menu.Item>
    </Menu>
  );

  return (<div
   
  >
      <Card title="Importar Ciudadanos" bordered={false} style={{ width: "100%" }}>
      <Content> 
        <Row>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} >
            <div className="formGroup">
              <Button type="primary"  icon={<ImportOutlined />} size={50} >
                Importar
              </Button >
             
            </div>                
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} >
            <div className="dowExport">
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  Exportar <DownOutlined />
                </a>
              </Dropdown>
          </div>              
          </Col>
          
        </Row>
      </Content>
     
      <div className="contentFiltroBtn">
        <Button  className="btnAccion btnFiltrar" onClick={()=>{}} >Limpiar</Button>
        <Button type="primary" className="btnAccion btnFiltrar" onClick={()=>{}} >Filtrar</Button>
      </div>
  </Card>

  </div>
  );
};

export default SincronizacionDatos;