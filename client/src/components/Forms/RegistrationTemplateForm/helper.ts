export const APPLICATION_FEE = 2.0;

// include total in stripe fee to the customer if customer is paying
export const calculateFee = (amount: number): number => {
  const feePercentage = 0.029;
  const fixedFee = 0.3;
  let totalAmount = (amount + APPLICATION_FEE + fixedFee) / (1 - feePercentage);
  totalAmount = parseFloat(totalAmount.toFixed(2));
  return parseFloat((totalAmount - amount).toFixed(2));
};
