/**
 * Maps a stripe payment status to a user-friendly string.
 *
 * @param {string} status - the status of the stripe payment
 * @param {string} defaultValue - the default value to return if status is not "approved" or "rejected"
 * @returns {string} - the user-friendly string to display
 */
export const getStatusOfStripePayment = (
  status: string,
  defaultValue: string
) => {
  switch (status) {
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return defaultValue;
  }
};
