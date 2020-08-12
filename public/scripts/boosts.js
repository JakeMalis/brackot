function personalizeElements() {
  $('#allStarUnlimited').click(function(){
    startCheckout('price_1H9lSLCwIH03I9fOjH0MgLEh');
  });
  $('#coinBoost').click(function(){
    startCheckout('price_1H9lRPCwIH03I9fOb51Xqvyo');
  });
  $('#billingInfoButton').click(function(){
    openPortal();
  });

  firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
    if (idTokenResult.claims.subscription == "unlimited") {
      document.getElementById("boostsBorder").className = "gradientBorderAnimated";
    }
  });


}

async function openPortal() {
  const functionRef = firebase.app().functions('us-east1').httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
  const { data } = await functionRef({ returnUrl: window.location.origin });
  window.location.assign(data.url);
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
  // Wait for the CheckoutSession to get attached by the extension
  docRef.onSnapshot((snap) => {
    const { sessionId } = snap.data();
    if (sessionId) {
      // We have a session, let's redirect to Checkout
      // Init Stripe
      const stripe = Stripe('pk_test_Q5Jva7sim6yZzEDARaqK8j5m00BSs2z9Ww');
      stripe.redirectToCheckout({ sessionId });
    }
  });
}
