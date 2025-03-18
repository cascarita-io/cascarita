import Papa from "papaparse";

const DAYS_BEFORE_EXPIRY = 3;
/**
 * Maps a stripe payment status to a user-friendly string.
 *
 * @param {string} status - the status of the stripe payment
 * @param {string} defaultValue - the default value to return if status is not "approved" or "rejected"
 * @returns {string} - the user-friendly string to display
 */
export const getStatusOfStripePayment = (
  status: string,
  defaultValue: string,
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

/**
 * Formats a given date string into a human-readable string, with the option to add a certain number of days.
 *
 * @param {string} dateString - the date string to format
 * @param {number} [daysAhead=0] - the number of days to add to the date
 * @returns {string} - the formatted date string
 */
export const formatDate = (
  dateString: string,
  daysAhead: number = 0,
): string => {
  const date = new Date(dateString);
  if (daysAhead > 0) {
    date.setDate(date.getDate() + daysAhead);
  }
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
};

/**
 * Gets the expiry date for a given date string. The expiry date is
 * three days after the given date.
 *
 * @param {string} dateString - the date string to get the expiry date for
 * @returns {Date} - the expiry date
 */
export const getExpiryDate = (dateString: string): Date => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + DAYS_BEFORE_EXPIRY);
  return date;
};

export const exportToCsv = async <T>(
  filename: string,
  data: T[],
): Promise<void> => {
  if (data.length === 0) {
    console.error("No data to export");
    return;
  }

  // Preprocess data to convert objects to strings
  const processedData = data.map((row) => {
    const processedRow: { [key: string]: string } = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        const value = row[key];
        processedRow[key] =
          typeof value === "object" && value !== null
            ? JSON.stringify(value)
            : String(value);
      }
    }
    return processedRow;
  });

  // Use PapaParse to convert data to CSV format
  const csv = Papa.unparse(processedData);

  // Create a downloadable CSV file
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
