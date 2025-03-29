import React, { useReducer } from "react";

import { useAuth0 } from "@auth0/auth0-react";

import { useGetAllGroups } from "../../api/groups/query";
import { GroupType } from "../../api/groups/types";
import { useRegisterUser } from "../../api/users/mutation";
import { RegisterUser } from "../../api/users/types";
import formStyles from "../Forms/Form.module.css";
import Modal from "../Modal/Modal";
import { ModalProps } from "../Modal/types";
import RadioSelect from "../RadioSelect/RadioSelect";
import SelectMenu from "../SelectMenu/SelectMenu";
import styles from "./RegistrationModal.module.css";
import TCRegistration from "./TCRegistration";
import { getIsPageComplete, getSubtitle, getTitle } from "./helpers";
import states from "./states.json";
import { Action, State } from "./types";

interface RegisterModalProps extends ModalProps {
  onRegistrationComplete: () => void;
}

const initialState = {
  page: 1,
  firstName: "",
  lastName: "",
  language_id: "english",
  isExistingOrg: false,
  org: "",
  selectedOrg: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  group_code: "",
  hasAcceptedTC: false,
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "NEXT_PAGE":
      return {
        ...state,
        page: state.page + 1,
      };
    case "PREVIOUS_PAGE":
      return {
        ...state,
        page: state.page - 1,
      };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}
//TODO: UNCOMMENT ONCE WE HAVE LANGUAGES
// const VALID_LANGUAGES = [
//   {
//     label: "English",
//     value: "english",
//   },
//   {
//     label: "Spanish",
//     value: "spanish",
//   },
// ];

const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  onOpenChange,
  onRegistrationComplete,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = React.useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const registerUserMutation = useRegisterUser();
  const { data } = useGetAllGroups();

  const handleFieldChange =
    (field: keyof State) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | boolean) => {
      const value =
        typeof e === "boolean"
          ? e
          : e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value;

      dispatch({ type: "SET_FIELD", field, value });
    };

  const incrementPageNumber = () => {
    dispatch({ type: "NEXT_PAGE" });
  };

  const decrementPageNumber = () => {
    dispatch({ type: "PREVIOUS_PAGE" });
  };

  const handleRegistrationComplete = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const token = await getAccessTokenSilently();

    const payload = {
      group_id: state.page === 3 ? null : state.org,
      first_name: state.firstName,
      last_name: state.lastName,
      language_id: state.language_id,
      name: state.selectedOrg,
      streetAddress: state.address,
      city: state.city,
      state: state.state,
      zipCode: state.zipCode,
      logoUrl: null,
      group_code: state.group_code,
      token: token,
      hasChecked: state.hasAcceptedTC,
    };
    try {
      const data = await registerUserMutation.mutateAsync(
        payload as RegisterUser,
      );
      // Handle successful registration here
      if (data.error) {
        setError(data.error);
        setTimeout(() => setError(null), 5000);
        return;
      }
    } catch (error) {
      // Handle registration error here
      console.error("Registration failed:", error);
    }

    onRegistrationComplete();
    dispatch({ type: "RESET_FORM" }); // Reset form after completion
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content
        title={getTitle(state.page)}
        subtitle={getSubtitle(state.page)}>
        <form className={formStyles.form} onSubmit={handleRegistrationComplete}>
          {state.page === 1 && (
            <>
              <TCRegistration
                value={state.hasAcceptedTC}
                onValueChange={(value) =>
                  handleFieldChange("hasAcceptedTC")(value)
                }
              />

              <button
                className={styles.registerBtn}
                onClick={incrementPageNumber}
                disabled={!getIsPageComplete(state, 1)}>
                Next
              </button>
            </>
          )}

          {state.page === 2 && (
            <>
              <div style={{ display: "grid", gap: "24px" }}>
                <div className={formStyles.inputContainer}>
                  <label htmlFor="first_name">First Name </label>
                  <input
                    type="text"
                    id="first_name"
                    value={state.firstName}
                    onChange={handleFieldChange("firstName")}
                    required
                    name="first_name"
                    placeholder="First Name"
                    className={formStyles.input}
                  />
                </div>
                <div className={formStyles.inputContainer}>
                  <label htmlFor="last_name">Last Name </label>
                  <input
                    type="text"
                    id="last_name"
                    value={state.lastName}
                    onChange={handleFieldChange("lastName")}
                    required
                    name="last_name"
                    placeholder="Last Name"
                    className={formStyles.input}
                  />
                </div>

                {/* TODO: UNCOMMENT ONCE WE HAVE LANGUAGES
                <fieldset className={formStyles.inputContainer}>
                  <legend>Select Preferred Language:</legend>

                  {VALID_LANGUAGES.map(({ label, value }) => (
                    <div key={label} className={formStyles.radioInputContainer}>
                      <input
                        type="radio"
                        name="language"
                        id={label}
                        value={value}
                        checked={value === state.language_id}
                        onChange={handleFieldChange("language_id")}
                      />
                      <label htmlFor={label}>{label}</label>
                    </div>
                  ))}
                </fieldset> */}
              </div>

              <div className={formStyles.formBtnContainer}>
                <button
                  className={styles.backBtn}
                  onClick={decrementPageNumber}>
                  Go Back
                </button>

                <button
                  className={styles.registerBtn}
                  onClick={incrementPageNumber}
                  disabled={!getIsPageComplete(state, 2)}>
                  Next
                </button>
              </div>
            </>
          )}

          {state.page === 3 && (
            <>
              <div style={{ display: "grid", gap: "24px" }}>
                <div className={styles.inputContainer}>
                  <p>Are you connecting to an existing organization?</p>

                  <RadioSelect
                    className={styles.radioContainer}
                    groupName="rd-existingOrg"
                    value={state.isExistingOrg ? "Yes" : "No"}
                    onValueChange={(value) => {
                      const updatedValue = value === "Yes";
                      dispatch({
                        type: "SET_FIELD",
                        field: "isExistingOrg",
                        value: updatedValue,
                      });
                    }}
                    required>
                    <div>
                      <label htmlFor="rd-Yes">Yes</label>
                      <RadioSelect.Item value="Yes" id="rd-Yes" />
                    </div>

                    <div>
                      <label htmlFor="rd-No">No</label>
                      <RadioSelect.Item value="No" id="rd-No" />
                    </div>
                  </RadioSelect>

                  {state.isExistingOrg && (
                    <>
                      <SelectMenu
                        placeholder="Select an Organization"
                        value={state.org}
                        onValueChange={(value) =>
                          dispatch({ type: "SET_FIELD", field: "org", value })
                        }
                        name="groupId"
                        className={styles.selectMenu1}>
                        {data?.map((group: GroupType) => (
                          <SelectMenu.Item
                            key={group.id}
                            value={group.id.toString()}>
                            {group.name}
                          </SelectMenu.Item>
                        ))}
                      </SelectMenu>
                      <div className={formStyles.inputContainer}>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <label htmlFor="group_code">Enter Group Code </label>
                        <input
                          type="text"
                          id="group_code"
                          value={state.group_code}
                          onChange={handleFieldChange("group_code")}
                          required
                          name="group_code"
                          placeholder="00000000"
                          className={formStyles.input}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className={formStyles.formBtnContainer}>
                <button
                  className={styles.backBtn}
                  onClick={decrementPageNumber}>
                  Go Back
                </button>

                {state.isExistingOrg ? (
                  <button
                    type="submit"
                    className={styles.registerBtn}
                    disabled={!getIsPageComplete(state, 3)}>
                    Finish
                  </button>
                ) : (
                  <button
                    className={styles.registerBtn}
                    onClick={incrementPageNumber}
                    disabled={!getIsPageComplete(state, 3)}>
                    Next
                  </button>
                )}
              </div>
            </>
          )}

          {state.page === 4 && (
            <>
              <div style={{ display: "grid", gap: "24px" }}>
                <div className={formStyles.inputContainer}>
                  <label htmlFor="orgName">Organization Name</label>
                  <input
                    className={formStyles.input}
                    id="orgName"
                    required
                    name="orgName"
                    placeholder="Organization Name"
                    type="text"
                    value={state.selectedOrg}
                    onChange={handleFieldChange("selectedOrg")}
                  />
                </div>

                <div className={formStyles.inputContainer}>
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    className={formStyles.input}
                    required
                    name="address"
                    placeholder="Address"
                    minLength={5}
                    maxLength={100}
                    type="text"
                    value={state.address}
                    onChange={handleFieldChange("address")}
                  />
                </div>

                <div className={formStyles.inputContainer}>
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    className={formStyles.input}
                    required
                    name="city"
                    placeholder="City"
                    type="text"
                    value={state.city}
                    onChange={handleFieldChange("city")}
                  />
                </div>

                <div className={styles.inlineFields}>
                  <div className={formStyles.inputContainer}>
                    <label htmlFor="state">State</label>
                    <SelectMenu
                      placeholder="State"
                      required
                      value={state.state}
                      onValueChange={(value) =>
                        dispatch({ type: "SET_FIELD", field: "state", value })
                      }
                      name="state"
                      className={formStyles.selectMenu2}>
                      {states.map((state, idx) => (
                        <SelectMenu.Item key={idx} value={state.abbreviation}>
                          {state.abbreviation}
                        </SelectMenu.Item>
                      ))}
                    </SelectMenu>
                  </div>

                  <div className={formStyles.inputContainer}>
                    <label htmlFor="zip-code">Zip Code</label>
                    <input
                      className={formStyles.input}
                      id="zip-code"
                      required
                      name="zipCode"
                      placeholder="Zip-code"
                      type="text"
                      value={state.zipCode}
                      onChange={handleFieldChange("zipCode")}
                    />
                  </div>
                </div>
              </div>

              <div className={formStyles.formBtnContainer}>
                <button
                  className={styles.backBtn}
                  onClick={decrementPageNumber}>
                  Go Back
                </button>

                <button
                  type="submit"
                  className={styles.registerBtn}
                  disabled={!getIsPageComplete(state, 4)}>
                  Register
                </button>
              </div>
            </>
          )}
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default RegisterModal;
