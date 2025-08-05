import { useWalletClient } from "wagmi";
import { useCallback } from "react";
import axios from "axios";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";
import { PRICING_PLANS, USAGE_PRICING } from "../config/monetization";

export function usePaymentContext() {
  const { data: walletClient, isError, isLoading } = useWalletClient();

  const createSession = useCallback(async (planId, billingCycle = 'monthly') => {
    if (!walletClient || !walletClient.account) throw new Error("please connect your wallet");
    if (isError) throw new Error("wallet not connected");
    if (isLoading) throw new Error("wallet is loading");
    
    // Get pricing based on plan and billing cycle
    let amount;
    let planDetails;
    
    if (PRICING_PLANS[planId]) {
      planDetails = PRICING_PLANS[planId];
      amount = billingCycle === 'yearly' && planDetails.yearlyPrice 
        ? planDetails.yearlyPrice 
        : planDetails.price;
    } else if (USAGE_PRICING[planId]) {
      planDetails = USAGE_PRICING[planId];
      amount = planDetails.price;
    } else {
      throw new Error(`Invalid plan ID: ${planId}`);
    }
    
    const baseClient = axios.create({
      baseURL: "https://payments.vistara.dev",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const apiClient = withPaymentInterceptor(baseClient, walletClient);
    const response = await apiClient.post("/api/payment", { 
      amount: `$${amount}`,
      planId,
      billingCycle,
      planName: planDetails.name
    });
    
    const paymentResponse = response.config.headers["X-PAYMENT"];
    if (!paymentResponse) throw new Error("payment response is absent");
    
    const decoded = decodeXPaymentResponse(paymentResponse);
    console.log(`decoded payment response: ${JSON.stringify(decoded)}`);
    
    return {
      success: true,
      planId,
      amount,
      billingCycle,
      transactionId: decoded.transactionId || 'mock-transaction-id'
    };
  }, [walletClient, isError, isLoading]);

  const getPlanDetails = useCallback((planId) => {
    return PRICING_PLANS[planId] || USAGE_PRICING[planId] || null;
  }, []);

  const calculateSavings = useCallback((planId, billingCycle) => {
    const plan = PRICING_PLANS[planId];
    if (!plan || !plan.yearlyPrice || billingCycle !== 'yearly') return 0;
    
    const monthlyTotal = plan.price * 12;
    const yearlyPrice = plan.yearlyPrice;
    return monthlyTotal - yearlyPrice;
  }, []);

  return { 
    createSession, 
    getPlanDetails, 
    calculateSavings 
  };
}
