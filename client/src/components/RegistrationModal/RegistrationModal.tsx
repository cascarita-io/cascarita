import React, { useReducer } from "react";
import Modal from "../Modal/Modal";
import { ModalProps } from "../Modal/types";
import styles from "./RegistrationModal.module.css";
import SelectMenu from "../SelectMenu/SelectMenu";
import states from "./states.json";
import RadioSelect from "../RadioSelect/RadioSelect";
import { useGetAllGroups } from "../../api/groups/query";
import { useRegisterUser } from "../../api/users/mutation";
import { GroupType } from "../../api/groups/types";
import { RegisterUser } from "../../api/users/types";
import { useAuth0 } from "@auth0/auth0-react";
import { Action, State } from "./types";
interface RegisterModalProps extends ModalProps {
  onRegistrationComplete: () => void;
}

const initialState = {
  page: 1,
  isExistingOrg: false,
  org: "",
  selectedOrg: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
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

const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  onOpenChange,
  onRegistrationComplete,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { getAccessTokenSilently } = useAuth0();
  const registerUserMutation = useRegisterUser();
  const { data } = useGetAllGroups();

  const handleFieldChange =
    (field: keyof State) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      dispatch({ type: "SET_FIELD", field, value: e.target.value });
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
      group_id: state.org,
      name: state.selectedOrg,
      streetAddress: state.address,
      city: state.city,
      state: state.state,
      zipCode: state.zipCode,
      logoUrl: null,
      token: token,
    };
    registerUserMutation.mutate(payload as RegisterUser);

    onRegistrationComplete();
    dispatch({ type: "RESET_FORM" }); // Reset form after completion
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content
        title={
          state.page === 1
            ? "Connect Existing Organization"
            : "Register Your Organization"
        }
        subtitle={
          state.page === 1
            ? "If you would like to connect to existing organization, please select 'Yes' and select from list"
            : "We just need a few details before we begin"
        }
      >
        {state.page === 1 && (
          <form
            onSubmit={handleRegistrationComplete}
            className={styles.formContainer}
          >
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
                required
              >
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
                <SelectMenu
                  placeholder="Select an Organization"
                  value={state.org}
                  onValueChange={(value) =>
                    dispatch({ type: "SET_FIELD", field: "org", value })
                  }
                  name="groupId"
                  className={styles.selectMenu1}
                >
                  {data?.map((group: GroupType) => (
                    <SelectMenu.Item key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectMenu.Item>
                  ))}
                </SelectMenu>
              )}
            </div>

            {state.isExistingOrg ? (
              <button className={styles.finishRegisterBtn}>Finish</button>
            ) : (
              <button
                onClick={incrementPageNumber}
                className={styles.finishRegisterBtn}
              >
                Next
              </button>
            )}
          </form>
        )}

        {state.page === 2 && (
          <form
            onSubmit={handleRegistrationComplete}
            className={styles.formContainer}
          >
            <div className={styles.inputContainer}>
              <label htmlFor="orgName">Organization Name</label>
              <input
                id="orgName"
                required
                name="orgName"
                placeholder="Organization Name"
                type="text"
                value={state.selectedOrg}
                onChange={handleFieldChange("selectedOrg")}
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="address">Address</label>
              <input
                id="address"
                required
                name="address"
                placeholder="Address"
                type="text"
                value={state.address}
                onChange={handleFieldChange("address")}
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="city">City</label>
              <input
                id="city"
                required
                name="city"
                placeholder="City"
                type="text"
                value={state.city}
                onChange={handleFieldChange("city")}
              />
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.inputContainer}>
                <label htmlFor="state">State</label>
                <SelectMenu
                  placeholder="State"
                  required
                  value={state.state}
                  onValueChange={(value) =>
                    dispatch({ type: "SET_FIELD", field: "state", value })
                  }
                  name="state"
                  className={styles.selectMenu2}
                >
                  {states.map((state, idx) => (
                    <SelectMenu.Item key={idx} value={state.abbreviation}>
                      {state.abbreviation}
                    </SelectMenu.Item>
                  ))}
                </SelectMenu>
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="zip-code">Zip Code</label>
                <input
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

            <div className={styles.btnContainer}>
              <button className={styles.backBtn} onClick={decrementPageNumber}>
                Go Back
              </button>
              <button className={styles.registerBtn}>Register</button>
            </div>
          </form>
        )}
      </Modal.Content>
    </Modal>
  );
};

export default RegisterModal;
