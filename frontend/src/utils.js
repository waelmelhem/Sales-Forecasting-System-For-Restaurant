const HOST_NAME="http://127.0.0.1:8000"
export const REFRESH_TIME_LIFE=(24 * 60 * 60 * 1000)
export const ACCESS_TIME_LIFE=(5 * 60 * 1000)
export async function SignUpFun(email,name,password) {
    let url=`${HOST_NAME}/api/user/create/`
    console.log(email,name,password);
    let data={
        "email":email.toLowerCase(),
        "user_name":name,
        "password":password,
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "accept":"application/json",
        },
        body: JSON.stringify(data)
    });
    return {
        status:response.status,
        body:await response.json()
    }
}
export async function LoginFun(email,password) {

    let url=`${HOST_NAME}/api/token/`
    let data={
        "email":email.toLowerCase(),
        password,
        returnSecureToken:true,
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "accept":"application/json",
        },
        body: JSON.stringify(data)
    });
    // console.log(response);
    return {
        body:await response.json(),
        status:response.status
    }
}
export async function getAllProduct() {

    let url=`${HOST_NAME}/api/allproduct/`
    await checkAccess();
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "accept":"application/json",
            "Authorization":`JWT ${localStorage.getItem("access")}`
        }
    });
    // console.log(response);
    return {
        body:await response.json(),
        status:response.status
    }
}
export async function logout() {
    let url=`${HOST_NAME}/api/user/logout/`
    console.log(localStorage.getItem("refresh"))
    let data={
        "refresh":localStorage.getItem("refresh")
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "accept":"application/json",
        },
        body: JSON.stringify(data)
    });
    return {
        // body:await response.json(),
        status:response.status
    }
}
export async function resetPasswordFun(idToken,password) {
    let url="https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAgc6CeBl2gLw4_SreAgku7_AG8NY4Jtu4"
    let data={
        idToken,
        password,
        returnSecureToken:true,
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return {
        ok:response.status,
        response:await response.json()
    }
}

export async function checkAccess(){
    const accessToken = localStorage.getItem('access');
    let final_access="";
    const tokenExpiration = localStorage.getItem('accessExpiration');
    if (accessToken && tokenExpiration && Date.now() > tokenExpiration) {
        const refreshToken = localStorage.getItem('refresh');
        const refreshExpiration = localStorage.getItem('refreshExpiration');
        if (refreshToken && refreshExpiration && Date.now() < refreshExpiration) {
            console.log(222222);
            let result =await refreshTokenFun()
            if(result){
                //refresh valid 
                localStorage.setItem("access",result.access);
                localStorage.setItem("accessExpiration",Date.now()+ACCESS_TIME_LIFE);
            }
            else{
                //refresh is not falid
                removeStorage()
            }
        }else{
            removeStorage()
        }
    }
    return localStorage.getItem('accessExpiration');
}
export async function refreshTokenFun(){
    const refreshToken = localStorage.getItem('refresh');
    // console.log(refreshToken)
    let url=`${HOST_NAME}/api/token/refresh/`
    let data={
        "refresh":refreshToken,
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if(response.status===200){
        return  await response.json()
    }else{
        return null
    }

}
export function removeStorage(){
    localStorage.setItem("refresh","");
    localStorage.setItem("access","");
    localStorage.setItem("accessExpiration","");
    localStorage.setItem("email","");
    localStorage.setItem("refreshExpiration","");
    localStorage.setItem("name","");
    localStorage.setItem("is_superuser","");
}
export function setStorage(data,refresh,access){
    localStorage.setItem("refresh",refresh);
    localStorage.setItem("access",access);
    localStorage.setItem("name",data.name);
    localStorage.setItem("email",data.email);
    localStorage.setItem("is_superuser",data.is_superuser);
    localStorage.setItem("accessExpiration",Date.now()+ACCESS_TIME_LIFE);
    localStorage.setItem("refreshExpiration",Date.now()+REFRESH_TIME_LIFE);
}
export function decodeJWT(token)
{
    if(!token)return{
        email:"",
        name:"",
        is_superuser:"",
      }
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
export let set_user_data=function (JWTDecoded){
    let data={
        email:JWTDecoded["email"],
        name:JWTDecoded["name"],
        is_superuser:JWTDecoded["is_superuser"],
    }
    return data;
}
import { user_nav_struct,admin_nav_struct,guest_nav_struct } from "./Components/NavBar/Utils";
export function  select_nav_struct(token){
    console.log(token,"token")
    token=localStorage.getItem("access")
    if(token){
        if(decodeJWT(token).is_superuser){
            return admin_nav_struct
        }
        return user_nav_struct;
    }
    return guest_nav_struct;
}
export async function get_product_Production(id) {

    let url=`${HOST_NAME}/api/predict/${id}/`
    await checkAccess();
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "accept":"application/json",
            "Authorization":`JWT ${localStorage.getItem("access")}`
        }
    });
    // console.log(response);
    return {
        body:await response.json(),
        status:response.status
    }
}
export async function UplodeDataFile(label,file) {
    console.log(label,file)
    let url=`${HOST_NAME}/api/file/`
    await checkAccess();
    const formData = new FormData();
    formData.append('label',label);
    formData.append('file', file);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Authorization":`JWT ${localStorage.getItem("access")}`
        },
        body: formData
    });
    console.log(response);
    return {
        body:await response.json(),
        status:response.status,
    }
}

export async function get_user_files() {

    let url=`${HOST_NAME}/api/user/files/`
    await checkAccess();
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "accept":"application/json",
            "Authorization":`JWT ${localStorage.getItem("access")}`
        }
    });
    return {
        body:await response.json(),
        status:response.status,
    }
}
export async function download_file(id) {

    let url=`${HOST_NAME}/api/file/${id}`
    await checkAccess();
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "accept":"application/json",
            "Authorization":`JWT ${localStorage.getItem("access")}`
        }
    });
    
    return {
        body:await response.json(),
        status:response.status,
    }
    
}
export async function getOrdersPrediction() {

    let url=`${HOST_NAME}/api/predict/orders`
    await checkAccess();
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "accept":"application/json",
            "Authorization":`JWT ${localStorage.getItem("access")}`
        }
    });
    // console.log(response);
    return {
        body:await response.json(),
        status:response.status
    }
}