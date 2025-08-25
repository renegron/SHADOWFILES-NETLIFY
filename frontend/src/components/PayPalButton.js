import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";

const PayPalButton = ({ item, onSuccess, onError }) => {
  const createOrder = async (data, actions) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id: item.id,
          item_name: item.name,
          amount: item.price,
          currency_code: "USD"
        }),
      });

      const orderData = await response.json();
      
      if (!response.ok) {
        throw new Error(orderData.detail || "Failed to create payment order");
      }

      return orderData.order_id;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      toast.error("Failed to create payment order");
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/capture-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: data.orderID,
        }),
      });

      const orderData = await response.json();
      
      if (!response.ok) {
        throw new Error(orderData.detail || "Failed to capture payment");
      }

      // Verify payment
      const verifyResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/verify/${data.orderID}`);
      const verifyData = await verifyResponse.json();

      if (verifyData.verified) {
        onSuccess(item);
        toast.success(`🎉 Payment successful! ${item.name} purchased!`);
      } else {
        throw new Error("Payment verification failed");
      }

    } catch (error) {
      console.error("Error capturing PayPal payment:", error);
      toast.error("Payment processing failed");
      onError(error);
    }
  };

  const onErrorHandler = (err) => {
    console.error("PayPal Error:", err);
    toast.error("Payment failed. Please try again.");
    onError(err);
  };

  const onCancel = (data) => {
    console.log("PayPal payment cancelled:", data);
    toast.info("Payment cancelled");
  };

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onErrorHandler}
      onCancel={onCancel}
      style={{
        layout: "vertical",
        height: 40,
        color: "gold",
        shape: "rect",
        label: "paypal"
      }}
    />
  );
};

export default PayPalButton;