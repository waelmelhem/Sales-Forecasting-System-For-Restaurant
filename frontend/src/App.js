import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import { navStruct } from './Components/NavBar/Utils';
import './App.scss'
import NavBar from './Components/NavBar/NavBar';
import Login from './Pages/AuthPages/Login';
import SignUp from './Pages/AuthPages/SignUp';
import AllProducts from './Pages/Admin/AllProducts'; 
import Data from './Pages/Admin/Data'; 
import Orders from './Pages/Admin/Orders'; 
import Profile from "./Pages/Dashboard/Profile"
import WelcomePage from "./Pages/Dashboard/WelcomePage"
import { SignUpFun,LoginFun,resetPasswordFun,REFRESH_TIME_LIFE,ACCESS_TIME_LIFE,removeStorage,checkAccess,setStorage,decodeJWT,set_user_data,} from './utils';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RequireAuth from './Components/RequireAuth/RequireAuth';
import SuperUser from './Components/RequireAuth/SuperUser';
import S_401 from './Pages/Status/S_401';
import Guest from './Components/RequireAuth/Guest';
import NotFound from './Pages/Status/NotFound';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      access:""||checkAccess(),
      // email:""||localStorage.getItem("email"),
      navStruct:navStruct,
    };

  }
  setTokens(refresh="",access=""){
    let data=set_user_data(decodeJWT(access));    
    if(access){
      setStorage(data,refresh,access)
      this.setState({
        "access":access,
        "refresh":refresh,
        "name":data.name,
        "email":data.email,
        "is_superuser":data.is_superuser,
      });
    }else{
      removeStorage()
      this.setState({
        "access":"",
        "refresh":"",
        "name":"",
        "email":"",
        "is_superuser":null,
      });
    }
    
  }
  render() {
    
    console.log(REFRESH_TIME_LIFE)
    console.log(this.state.email);
    return (
      <BrowserRouter>
      <div className={"app "}>
        <header className="app__header">
          <NavBar setTokens={this.setTokens.bind(this)}/>
        </header>
        <main className="app__main">
          {/* <Login setTokens={this.setTokens.bind(this)}/> */}
          {/* <SignUp setTokens={this.set  `IdToken.bind(this)}/>
          <Profile setTokens={this.setTokens.bind(this)} idToken={this.state.idToken}/> */}
        <Routes>
          <Route path='/' element={<RequireAuth idToken={this.state.access}><WelcomePage/></RequireAuth>}/>
          <Route path='/login' element={<Guest idToken={this.state.access}><Login setTokens={this.setTokens.bind(this)}/></Guest>}/>
          <Route path='/signup' element={<Guest idToken={this.state.access}><SignUp setTokens={this.setTokens.bind(this)}/></Guest>}/>
          <Route path='/products' element={
            <RequireAuth idToken={this.state.access}>
              <SuperUser is_super={this.state.is_superuser}>
                <AllProducts/>
              </SuperUser>
            </RequireAuth>
          }/>
          <Route path='/orders' element={
            <RequireAuth idToken={this.state.access}>
              <SuperUser is_super={this.state.is_superuser}>
                <Orders/>
              </SuperUser>
            </RequireAuth>
          }/>
          <Route path='/data' element={
            <RequireAuth idToken={this.state.access}>
              <SuperUser is_super={this.state.is_superuser}>
                <Data/>
              </SuperUser>
            </RequireAuth>
          }/>
          <Route path='/unauthorized' element={<RequireAuth><S_401/></RequireAuth>}/>
          <Route path='*' element={<NotFound/>}/>

        </Routes>
        </main>
      </div>
      </BrowserRouter>
    );
  }
}


export default App;
