const userConstants = {
    GET_REALTIME_USERS: 'GET_REALTIME_USERS',
    GET_REALTIME_MESSAGES: 'GET_REALTIME_MESSAGES'
}
const user = {
    'tournamentConversations': [],
    'teamConversations': []
}
    


        

const db = firebase.firestore();
function initChat() {
    console.log("into init chat")
    getRealtimeConversations(firebase.auth().currentUser.uid);
    
}
function submitMessage() {
    var message = document.getElementById("textHolder").value;
    document.getElementById("textHolder").value = '';
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
function updateMessage(msgObj) {
    db.collection('tournaments')
        .doc(tournamentId)
        .collection('chat')
        .add({
            ...msgObj,
            createdAt: new Date(),
        })
        .then (
            console.log(msgObj)
        )
}
function renderChat() {
    ReactDOM.render(
        <Message/>,
        document.getElementById("messageSections")
        
    );
    console.log(user.tournamentConversations)
}
function getRealtimeConversations() {
    console.log(user.tournamentConversations)

    db.collection('tournaments').doc(tournamentId).collection('chat')
    .orderBy('createdAt', 'asc')
    .onSnapshot((querySnapshot) => {
        user.tournamentConversations = []


        querySnapshot.forEach(doc => {
            user.tournamentConversations.push(doc.data())  
        });
        console.log(user.tournamentConversations)
        user.tournamentConversations.map(con => console.log(con.sentUID))
        renderChat()

        
    })
}
class Message extends React.Component {
    render(){
        return (
            <div>
                {   

                        user.tournamentConversations.map(con =>
                            <div style={{ textAlign: con.sentUID == firebase.auth().currentUser.uid
                            ? 'right' : 'left' }}>
                            <p className="messageBlurb">{con.message}</p>
                            </div>
                        )    
                }
            </div>
        );
    }
}