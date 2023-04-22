import { Navigate } from "react-router-dom";
import { checkAccess } from "../../utils";

function Guest (props){
    checkAccess();
    let is_superuser=localStorage.getItem("is_superuser")
    
    return(
        <div>
            {
                is_superuser==="true"?props.children:<Navigate to={"/unauthorized"}/>
            }
        </div>
    );
}
export default Guest;