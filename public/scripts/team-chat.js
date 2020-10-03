const user = {
    conversations : []
};

const db = firebase.firestore()
async function updateMessage(msgObj) {
    db.collection('tournaments').doc(tournamentId).collection('chat')
        .add({
            ...msgObj,
            createdAt: new Date(),
        })
        .catch(error => {
            console.log('error')
        });
    console.log('complete') 
}
function initChat() {
    console.log("into init chat")
    renderChat()
}
function submitMessage() {
    console.log('hello')
    var message = document.getElementById("textHolder").value;
    console.log(message)
    const msgObj = {
        sentUID: firebase.auth().currentUser.uid,
        message
    }
    if(message !== ""){
        console.log("into if statement")
        updateMessage(msgObj)
        
    };
    console.log("out of if")
}
function renderChat() {
    ReactDOM.render(
        <Messages/>,
        document.getElementById("messageSections")

    );
}
function getRealTimeMessages() {
    user.conversations = [] 
    console.log(user.conversations);
    db.collection('tournaments').doc(tournamentId).collection('chat')
                    .orderBy('createdAt', 'asc')
                    .onSnapshot((querySnapshot) => {
                        querySnapshot.forEach(doc => {
                            
                            user.conversations.push(doc.data())
                            
                        });
                        console.log(user.conversations);
                    })
}
class Messages extends React.Component {
    render(){
        return (
            <div>
                {
                    getRealTimeMessages()
                }
                {
                    user.conversations.map(con =>
                        <div style={{ textAlign: con.userSent == firebase.auth().currentUser.uid
                            ? 'right' : 'left' }}>
                        <p className="messageStyle" >{con.message}</p>
                        <p className='messageSentBy'>{con.sentUID}</p>
                        </div>)    
                }
            </div>
            
        );
    }
}
