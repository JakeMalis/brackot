class ParticipantCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      name: 'Loading...',
      loading: true,
    }
  }
  componentDidMount() {
    const { participantId } = this.props;
    firebase.firestore().collection("users").doc(participantId).get().then(userDoc => {
      const { avatarUrl, name } = userDoc.data();
      this.setState({
        avatar: avatarUrl ? avatarUrl : 'media/BrackotLogo2.jpg',
        loading: false,
        name,
      })
    })
  }
  render() {
    const { avatar, name, loading } = this.state;
    return(
      <div className="participantCard">
        {loading ? <div className="participantCardPic">:</div> : <img className="participantCardPic" src={avatar} />}
        <p className="participantCardName">{name}</p>
      </div>
    );
  }
}

const renderParticipants = () => {
  const ParticipantCards = [];
  firebase.firestore().collection("tournaments").doc(tournamentId).get().then((doc) => {
      doc.data().players.forEach((participant, index) => {
        ParticipantCards.push(<ParticipantCard key={index+1} participantId={participant}/>);
      });
    }).then(() => {
      ReactDOM.render(
        ParticipantCards,
        document.getElementById("participantsTab")
      );
    });
}
