const userConstants = {
    GET_REALTIME_USERS: 'GET_REALTIME_USERS',
    GET_REALTIME_MESSAGES: 'GET_REALTIME_MESSAGES'
}
const user = [
]
async function updateMessage(msgObj) {
    const db = firebase.firestore();
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
async function getRealtimeConversations(user) {
        const db = firebase.firestore();
        db.collection('tournaments').doc(tournamentId).collection('chat')
        .orderBy('createdAt', 'asc')
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach(doc => {
                if(!user.includes(doc)) {
                    user.push(doc)
                }
            });
            
        })
    
}
function initChat() {
    getRealtimeConversations(firebase.auth().currentUser.uid);
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
        Message,
        document.getElementById("messageSections")
    );
}
class Message extends React.Component {
    render(){
        return (
            <div>
                {
                    user.conversations.map(con =>
                        <div style={{ textAlign: con.userSent == firebase.auth().currentUser.uid
                            ? 'right' : 'left' }}>
                        <p className="messageStyle" >{con.message}</p>
                        </div>)    
                }
            </div>
            
        );
    }
}
