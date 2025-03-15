import { State } from "./types";

/**
 * Gets the title of the page based on the page number.
 * @param {number} pageNumber - The page number
 * @returns {string} The title of the page
 */
export const getTitle = (pageNumber: number) => {
  switch (pageNumber) {
    case 1:
      return "Welcome to Cascarita!";

    case 2:
      return "Account Information";

    case 3:
      return "Connect to Existing Organization";

    case 4:
      return "Organization Information";

    default:
      return "";
  }
};

/**
 * Gets the subtitle of the page based on the page number.
 * @param {number} pageNumber - The page number
 * @returns {string} The subtitle of the page
 */

export const getSubtitle = (pageNumber: number) => {
  switch (pageNumber) {
    case 1:
      return "Please accept our terms and conditions";

    case 2:
      return "We just need a few details before we begin";

    case 3:
      return "If you would like to connect to existing organization, please select 'Yes' and select from list";

    case 4:
      return "Last but not least! Please enter your organization details";

    default:
      return "";
  }
};

/**
 * Determines if the current registration page is complete based on the provided state and page number.
 *
 * @param {State} state - The current state of the registration form.
 * @param {number} pageNumber - The page number to check for completeness.
 * @returns {boolean} - Returns true if the page is complete, otherwise false.
 *
 * - Page 1 is complete if the terms and conditions have been accepted.
 * - Page 2 is complete if both first name and last name are provided.
 * - Page 3 is complete if both organization name and group code are provided.
 * - Page 4 is complete if the selected organization, address, city, state, and zip code are all provided.
 * - For any other page number, it returns false.
 */

export const getIsPageComplete = (state: State, pageNumber: number) => {
  switch (pageNumber) {
    case 1:
      return state.hasAcceptedTC === true;

    case 2:
      return state.firstName.trim() !== "" && state.lastName.trim() !== "";

    case 3:
      if (!state.isExistingOrg) {
        return true;
      }
      return state.org.trim() !== "" && state.group_code.trim() !== "";

    case 4:
      return (
        state.selectedOrg.trim() !== "" &&
        state.address.trim() !== "" &&
        state.city.trim() !== "" &&
        state.state !== "" &&
        state.zipCode.trim() !== ""
      );
    default:
      return false;
  }
};
