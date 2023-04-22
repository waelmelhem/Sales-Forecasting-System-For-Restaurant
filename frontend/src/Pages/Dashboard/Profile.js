import React from "react";
import { FlashMessage } from "../AuthPages/FlashMessage";
import { resetPasswordFun, refreshToken,checkAccess,decodeJWT } from "../../utils";
class Proflie extends React.Component{

    constructor(props){
        super(props);
        this.state={
            password:"",
            "error":"",
            "iserror":false,
            "success":false,
        };
    }
    setIserrorFalse(){
        this.setState({"iserror":false});
    }
    setSuccessFalse(){
        this.setState({"success":false});
    }
    onPasswordChange(e){

        this.setState({
            "password":e.target.value,
        });
    }
    onFormSubmited(e){
        e.preventDefault();
        console.log(decodeJWT());
    }
    render(){
        return (
            <div>
                {this.state.iserror?<FlashMessage class="danger" message={this.state.error} delete={this.setIserrorFalse.bind(this)}/>:""}
                {this.state.success?<FlashMessage message={"Password Changed Successflly"} class="success" delete={this.setSuccessFalse.bind(this)}/>:""}
                <div className="profile">
                <div className="title">
                    Your User Profile
                </div>
                <br/>
                
                <form onSubmit={this.onFormSubmited.bind(this)}>
                    <label htmlFor="password">New Password</ label>
                    <input onChange={this.onPasswordChange.bind(this)} type="password" value={this.state.password} id="password" />
                    <button className="btn">Change Password</button>
                </form>
            </div>
            </div>
            
        )
    }
}
export default Proflie;