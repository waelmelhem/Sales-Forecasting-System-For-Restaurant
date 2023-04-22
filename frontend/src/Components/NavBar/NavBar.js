import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useEffect, } from "react";
import { navStruct,user_nav_struct,admin_nav_struct,guest_nav_struct } from "./Utils";
import { logout,select_nav_struct } from "../../utils";
import { useLocation } from "react-router-dom";
function NavBar(props) {
    let location=useLocation();
    let [navStructState,setNavStructState]=useState([...select_nav_struct(localStorage.getItem('access'))]);
    useEffect(()=>{
        let _navStruct=[...select_nav_struct(localStorage.getItem('access'))];
        _navStruct=_navStruct.map((e)=>{
            let path=location.pathname.split('/');
            if(e.name.toLowerCase()===path[path.length-1]){
                e.isActive=true;
            }else e.isActive=false; 
            return e;
        });
        console.log(_navStruct)
        setNavStructState(_navStruct)
    },[location]);
    function signOut(){
        logout().then(response => {
            props.setTokens();
            <Navigate to={"/login"}/>
            
        });  
    }
    return (
        <div className="navbar">
            <Link to={"/"}>
                <div className="logo ">
                    React Auth
                </div>
            </Link>
            <div className="navbuttons ">
                {navStructState.map((item, idx) => {
                    let ans=""
                    if(item.name!=="Logout"){
                        ans =<Link key={idx} to={item.path}>
                            <button className={(`btn ${item.isActive ? "active" : ""}`)}>{item.name}</button>
                        </Link>
                    }else{
                        ans=<button key={idx} onClick={signOut} className={(`btn ${item.isActive ? "active" : ""}`)}>{item.name}</button>
                    }
                    return ans;
                })}
            </div>
        </div>

    )
}
export default NavBar;