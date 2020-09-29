import 

const userConstants = {
    GET_REALTIME_USERS: 'GET_REALTIME_USERS',
    GET_REALTIME_MESSAGES: 'GET_REALTIME_MESSAGES'
}
const user = useSelector(state => state.user);
const intiState = {
    users: [],
    conversations: []
}

const updateState = (state = intiState, action) => {
    console.log(action)
    switch(action.type){
        case userConstants.GET_REALTIME_MESSAGES:
            state = {
                ...state,
                conversations: action.payload.conversations
            }
            break;
        case `${userConstants.GET_REALTIME_MESSAGES}_FAILURE`:
            state = {
                ...state,conversations: []
            }
        break;
    }


    return state;

}
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
const getRealtimeConversations = (user) => {
    
        console.log("gotintorealtimeconvos")
        const db = firebase.firestore();
        db.collection('tournaments').doc(tournamentId).collection('chat')
        .orderBy('createdAt', 'asc')
        .onSnapshot((querySnapshot) => {

            const convos = [];

            querySnapshot.forEach(doc => {
                conversations.push(doc.data())  
            });
            updateState({intiState,
                type: 'GET_REALTIME_MESSAGES',
                payload: {conversations}
            })
            state = {
                ...state,
                conversations: convos
            }
            console.log(conversations);
        })
    
}
function initChat() {
    console.log("into init chat")
    getRealtimeConversations(firebase.auth().currentUser.uid);
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
