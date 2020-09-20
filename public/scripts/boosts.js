function personalizeElements() {
  $('#brackotUnlimited').click(function(){
    startCheckout('price_1HSqVcCwIH03I9fOAWygPFxU');
  });

  firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
    if (idTokenResult.claims.stripeRole == "unlimited") {
      document.getElementById("boostsBorder").className = "gradientBorderAnimated";
    }
  });
}

async function startCheckout(product) {
  const docRef = await firebase.firestore()
  .collection('customers')
  .doc(firebase.auth().currentUser.uid)
  .collection('checkout_sessions')
  .add({
    price: product,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  });
  docRef.onSnapshot((snap) => {
    const { sessionId } = snap.data();
    if (sessionId) {
      const stripe = Stripe('pk_live_48p50wmjPpHken3hZmYJlCRf00NMqdQBlz');
      stripe.redirectToCheckout({ sessionId });
    }
  });
}
