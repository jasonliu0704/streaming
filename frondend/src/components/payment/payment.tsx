import { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { showToast, useLoad } from "@tarojs/taro";
import { PaymentInfo, updatePaymentInfo } from "src/store/config";
import { createPaymentIntent } from "src/server/payment";
import CheckoutForm from "./checkout-form";
import Mask from "../ui/mask/mask";

interface PaymentProps {
  onClose?: () => void;
  hide?: boolean;
}
export default function Payment({ hide, onClose }: PaymentProps) {
  const [stripe, setStripe] = useState<Stripe | null>(
    PaymentInfo.stripe ? PaymentInfo.stripe : null
  );
  const [clientSecret, setClientSecret] = useState<string>(
    PaymentInfo.clientSecret
  );
  useLoad(() => {
    if (!PaymentInfo.stripe) {
      loadStripe(process.env.TARO_APP_STRIPE_PUBLISHABLE_KEY).then(
        (_stripe) => {
          if (_stripe) {
            setStripe(_stripe);
            updatePaymentInfo({ ...PaymentInfo, stripe: _stripe });
          } else {
            showToast({ title: "An unexpected error occured.", icon: "error" });
          }
        }
      );
    }
  });

  useEffect(() => {
    if (!hide && !PaymentInfo.clientSecret) {
      setClientSecret("");
      createPaymentIntent(100, "usd", "2024-06-20")
        .then((clientSecret) => {
          setClientSecret(clientSecret);
        })
        .catch(() => {
          showToast({ title: "An unexpected error occured.", icon: "error" });
        });
    }
  }, [hide]);

  return (
    <>
      <Mask onClose={onClose} hide={hide}>
        {clientSecret && stripe && (
          <Elements stripe={stripe} options={{ clientSecret }}>
            <CheckoutForm onClose={onClose} />
          </Elements>
        )}
      </Mask>
    </>
  );
}
