import { Navigate } from "react-router-dom";
import { checkAccess } from "../../utils";
function Guest (props){
    checkAccess();
    const auth=localStorage.getItem('accessExpiration');
    return(
        <div>
            {
                !auth?props.children:<Navigate to={"/"}/>
            }
        </div>
    );
}
export default Guest;