
import React, { useState } from "react";
import { FlashMessage } from "./FlashMessage";
import { SignUpFun } from "../../utils";
import { Link, useNavigate } from "react-router-dom";

function SignUp(props) {
    let navigate=useNavigate();
    let [password, setPassword] = useState("");
    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [error, setError] = useState([]);
    let [isError, setIsError] = useState(0);
    function thereIsErorr(message){
        setError(message)
        setIsError(true)
    }
    function noErorr(){
        setError([]);
        setIserrorFalse()
    }
    function setIserrorFalse() {
        setIsError(0);
    }
    function onPasswordChange(e) {
        setPassword(e.target.value);
    }
    function onEmailChange(e) {
        setEmail(e.target.value);
    }
    function onNameChange(e) {
        setName(e.target.value);
    }
    function onFormSubmited(e) {
        e.preventDefault();
        let err=[];
        console.log(email,name,password,error);
        if(!email.trim()){
            err.push("The Email Field is Required !")
        }
        if(!password.trim()){
            err.push("The Password is Required !")
        }
        if(!name.trim()){
            err.push("The Name Field is Required !")
        }
        // return;
        if(err.length){thereIsErorr([...err]);return}
        SignUpFun(email,name, password).then(response => {
            console.log(response)
            let {body,status}=response
            console.log(status)
            if (status === 201) {
                let refresh=body.refresh;
                let access=body.access;
                props.setTokens(refresh,access);
                noErorr();
                navigate("/")

            } else {
                if(body.email){
                    err.push(`Email : ${body.email}`);
                }
                if(body.name){
                    err.push(`Name : ${body.name}`);
                }
                if(body.password){
                    err.push(`Password : ${body.password}`);
                }
                console.log(response)
                thereIsErorr(...[err])
            }
        });
    }

    return (
        <div className="authCardAndMessage">
            {isError ? <FlashMessage class="danger" message={error} delete={setIserrorFalse} /> : ""}
            <div className="authCard">
                <div className="title">SignUp</div>
                <form onSubmit={onFormSubmited}>
                    <label htmlFor="email">Your email</label>
                    <input onChange={onEmailChange} value={email} id="email" />
                    <label htmlFor="name">Your Name</label>
                    <input onChange={onNameChange} value={name} id="name" />
                    <label htmlFor="password">Your Password</label>
                    <input onChange={onPasswordChange} type="password" value={password} id="password" />
                    <button className="btn">Create Account</button>
                    <Link to={"/login"}>
                    <div>Login with existing account</div>
                    </Link>
                </form>
            </div>
        </div>

    )
}
export default SignUp;