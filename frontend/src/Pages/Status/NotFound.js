import React from "react";

class NotFound extends React.Component{
    
    constructor(props){
        super(props);
        this.state={};
    }
    
    render(){
        
        return (
            <div className="NotFound">
                <div className="title">
                    404, NOT FOUND
                </div>
            </div>
            
        )
    }
}
export default NotFound;