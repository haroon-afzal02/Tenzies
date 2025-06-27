export default function Die(props){
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    return(
        <button onClick={props.onClick} style = {styles} className="Die-button">{props.value}</button>
    )
}