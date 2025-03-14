export const formatCurrency = (amounts: number[]): string[] => {
  const formattedAmounts = amounts.map((amount) => (amount / 100).toFixed(2));
  return formattedAmounts;
};
