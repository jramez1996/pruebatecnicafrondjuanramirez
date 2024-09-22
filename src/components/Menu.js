
import * as React from 'react'
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
const { SubMenu } = Menu;

//const { Header, Sider, Content } = Layout;
// submenu keys of first level
const MenuGeneral = (props) => {
  const clickMenu=()=>{
    props.clickMenu();
  }
  const subItemMenu=(array)=>{
    console.log("array-array",array);//mostrar
    {return  array.map((item, i) => (
      item.mostrar ? 
       (
       <Menu.Item key={item.text}> <Link to={item.link} className="link" onClick={()=>{clickMenu()}}>{item.text}</Link></Menu.Item>) : 
       null
  
      )   
  )}
  }

  const componentListMenuGeneral = (props.listadoMenu ? props.listadoMenu : []).map( (item, i) => (
    (item.children && item.mostrar ? 
    <SubMenu  key={item.text}  icon={item.icon} title={item.text}>
      {
        subItemMenu(item.children) 
      }
     
    
    
    </SubMenu> : 
    (
      item.mostrar ?  (<Menu.Item  key={item.text} >
        <Link to={item.link} className="link" onClick={()=>{clickMenu()}}>{item.text}</Link>
       </Menu.Item>) : null
    )
      
       )
      
      
    )
  )

  return (<Menu
    mode="inline"
    defaultSelectedKeys={['1']}
    defaultOpenKeys={['sub1']}
    style={{ height: '100%',width:"100%" }}
    width={"100%"}
  >
    {componentListMenuGeneral}
 
  </Menu>
  );
};

export default MenuGeneral;