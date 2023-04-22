import React, { useState } from "react";
import { FlashMessage } from "./FlashMessage";
import { LoginFun } from "../../utils";
import { Link, useNavigate } from "react-router-dom";
function Login(props) {
    let navigate=useNavigate();
    let [password, setPassword] = useState("");
    let [email, setEmail] = useState("");
    let [error, setError] = useState("");
    let [isError, setIsError] = useState(0);
    function setIserrorFalse() {
        setIsError(0);
    }
    function onPasswordChange(e) {
        setPassword(e.target.value);
    }
    function onEmailChange(e) {
        setEmail(e.target.value);
    }
    function thereIsErorr(message){
        setError(message);
        setIsError(true)
    }
    function noErorr(message){
        setError(message);
        setIsError(true)
    }
    function onFormSubmited(e) {
        e.preventDefault();
        if(!email){
            thereIsErorr("The Email Field is Required !")
            return;
        }
        if(!password){
            thereIsErorr("The Password is Required !")
            return;
        }
        
        LoginFun(email, password).then(response => {
            console.log(response)
            let {body,status}=response
            if (status === 200) {
                let refresh=body.refresh;
                let access=body.access;
                props.setTokens(refresh, access)
                noErorr();
                navigate("/")

            } else {
                thereIsErorr("Wrong Email/Password")
            }
        });
    }

    return (
        <div className="authCardAndMessage">
            {isError ? <FlashMessage class="danger" message={error} delete={setIserrorFalse} /> : ""}
            <div className="authCard">
                <div className="title">Login</div>
                <form onSubmit={onFormSubmited}>
                    <label htmlFor="email">Your email</label>
                    <input onChange={onEmailChange} value={email} id="email" />
                    <label htmlFor="password">Your Password</label>
                    <input onChange={onPasswordChange} type="password" value={password} id="password" />
                    <button className="btn">Login</button>
                    <Link to={"/signup"}>
                        <div >Create new account</div>
                    </Link>
                </form>
            </div>
        </div>

    )
}

export default Login;