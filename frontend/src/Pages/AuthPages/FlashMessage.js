export function FlashMessage(props){
    let message=props.message;
    if(typeof(props.message)==="object"){
        message.map(e => <li>e</li>)
    }
    return(
        
        <div className={`flashmessage alert alert-${props.class}`} role="alert">
        {typeof(message)==='object'?<ul >{message.map((e,idx)=><li key={idx}>{e}</li>)}</ul>:message}
        <button onClick={props.delete} >X</button>
        </div>
    )
}