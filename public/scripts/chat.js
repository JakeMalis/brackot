const userConstants = {
    GET_REALTIME_USERS: 'GET_REALTIME_USERS',
    GET_REALTIME_MESSAGES: 'GET_REALTIME_MESSAGES'
}
const user = [
];

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
        <Message/>,
        document.getElementById("messageSections")

    );
}
class Message extends React.Component {
    render(){
        return (
            <div>
                {
                    db.collection('tournaments').doc(tournamentId).collection('chat')
                    .orderBy('createdAt', 'asc')
                    .onSnapshot((querySnapshot) => {
                        querySnapshot.forEach(doc => {
                            if(!user.conversations.includes)
                            {
                                user.conversations.push(doc.data())
                            }
                            
                        });
                        console.log(conversations);
                    })
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
