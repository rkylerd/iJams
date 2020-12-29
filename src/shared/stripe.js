
const axios = require('axios');
const STRIPE_PK = process.env.VUE_APP_STRIPE_KEY || "";
var stripe = Stripe(STRIPE_PK); //eslint-disable-line
const api = `${
  process.env.VUE_APP_NODE_ENV === 'local' ? 
  'http://localhost:3000/' : 
  'https://ijams-server.herokuapp.com/'
}api`;

const style = {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d"
      }
    },
    invalid: {
      fontFamily: 'Arial, sans-serif',
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

const createPaymentIntent = (items) => {
  axios.post(`${api}/stripe/`, { items })
  .then(function({data = {}} = {}) {
    const elements = stripe.elements();
    const card = elements.create("card", { style });
    
    // Stripe injects an iframe into the DOM
    card.mount("#card-element");
    card.on("change", function (event) {
        // Disable the Pay button if there are no card details in the Element
        document.querySelector("#stripe-button").disabled = event.empty;
        document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
    });
    
    let form = document.getElementById("payment-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        // Complete payment when the submit button is clicked
        payWithCard(stripe, card, data.clientSecret);
    });
  })
  .catch(error => {
    console.log(error.message);
    showError(error.message);
  });
};

// Calls stripe.confirmCardPayment
// If the card requires authentication Stripe shows a pop-up modal to
// prompt the user to enter authentication details without leaving your page.
var payWithCard = function(stripe, card, clientSecret) {
  loading(true);
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card
      }
    })
    .then(function(result) {
      if (result.error) {
        // Show error to your customer
        showError(result.error.message);
      } else {
        // The payment succeeded!
        orderComplete();
      }
    });
};

/* ------- UI helpers ------- */
// Shows a success message when the payment is complete
var orderComplete = function() {
  loading(false);
  document.querySelector(".result-message").textContent = "Congrats on your purchase! Your download will begin shortly.";
  document.querySelector(".result-message").classList.remove("hidden");
  document.querySelector("#stripe-button").disabled = true;
};

// Show the customer the error from Stripe if their card fails to charge
var showError = function(errorMsgText) {
  loading(false);
  var errorMsg = document.querySelector("#card-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};
// Show a spinner on payment submission
var loading = function(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#stripe-button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#stripe-button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};

export {createPaymentIntent};