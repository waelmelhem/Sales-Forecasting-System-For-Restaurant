import React from "react";

class WelcomePage extends React.Component{
    
    constructor(props){
        super(props);
        this.state={};
    }
    
    render(){
        
        return (
            <div className="welcome">
                <div className="title">
                    Welcome on Board!
                </div>
            </div>
            
        )
    }
}
export default WelcomePage;