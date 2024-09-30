import {
  PaymentElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { useState, FormEvent } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { showToast } from "@tarojs/taro";
import { View } from "@tarojs/components";

import "./checkout-form.less";
import { PaymentInfo } from "src/store/config";

interface CheckoutFormProps {
  onClose?: () => void;
}
export default function CheckoutForm({ onClose }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        showToast({ title: error.message!, icon: "error" });
      } else {
        showToast({ title: "An unexpected error occured.", icon: "error" });
      }
    }
    if (paymentIntent) {
      console.log("paymentIntent", paymentIntent);
      PaymentInfo.paymentIntent = paymentIntent;
      //if success, clear the clientSecret
      PaymentInfo.clientSecret = "";
      showToast({ title: "Payment successful", icon: "success" });
      onClose && onClose();
    }
    setIsLoading(false);
  };

  return (
    <View className="payment-form-wapper">
      <form onSubmit={handleSubmit}>
        <LinkAuthenticationElement
          id="link-authentication-element"
          // Access the email value like so:
          // onChange={(event) => {
          //  setEmail(event.value.email);
          // }}
          //
          // Prefill the email field like so:
          // options={{defaultValues: {email: 'foo@bar.com'}}}
        />
        <PaymentElement id="payment-element" />
        <button id="submit" className="button">
          Pay now($1.00)
        </button>
      </form>
    </View>
  );
}
