export const processPayment = async (amount: number, cardDetails: any): Promise<{ success: boolean; transactionId?: string }> => {
  console.log(`Processing payment of $${amount} for card ending in ${cardDetails.number?.slice(-4)}`);
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Mock success response
  return {
    success: true,
    transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`
  };
};