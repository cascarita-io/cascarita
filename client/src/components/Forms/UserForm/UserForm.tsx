import React from "react";
import { useState } from "react";

import {
  useAddUser,
  useDeleteUser,
  useUpdateUser,
} from "../../../api/users/mutations";
import Modal from "../../Modal/Modal";
import DeleteForm from "../DeleteForm/DeleteForm";
import styles from "../Form.module.css";
import { PlayerRequest } from "../PlayerForm/types";
import { DeleteUserData, UpdateUserData, UserFormProps } from "./types";

const UserForm: React.FC<UserFormProps> = ({
  afterSave,
  requestType,
  selectedUserId,
  parentUserGroupId,
}) => {
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  const deleteUserMutation = useDeleteUser();
  const updateUserMutation = useUpdateUser();
  const addUserMutation = useAddUser();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { userFirstName, userLastName, userEmail, userRole } =
      Object.fromEntries(new FormData(event.currentTarget));

    const data = {
      formData: {
        user_id: selectedUserId,
        first_name: userFirstName,
        last_name: userLastName,
        email: userEmail,
        role_id: userRole,
        group_id: parentUserGroupId ? parentUserGroupId : 0,
      },
    };

    switch (requestType) {
      case "POST":
        addUserMutation.mutate(data as PlayerRequest);
        break;
      case "PATCH":
        updateUserMutation.mutate({
          id: selectedUserId,
          ...data,
        } as UpdateUserData);
        break;
      case "DELETE":
        deleteUserMutation.mutate({
          id: selectedUserId ? selectedUserId : 0,
        } as DeleteUserData);
        break;
      default:
        break;
    }

    afterSave();
  };

  return (
    <>
      {requestType == "DELETE" ? (
        <DeleteForm
          destructBtnLabel="Yes, I'm sure"
          onSubmit={handleSubmit}
          className={styles.form}>
          <p>Are you sure you want to delete?</p>
        </DeleteForm>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "24px" }}>
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="userFirstName">
                First Name
              </label>
              <input
                className={styles.input}
                id="userFirstName"
                name="userFirstName"
                type="text"
                value={userFirstName}
                onChange={(e) => setUserFirstName(e.target.value)}
                required={requestType === "POST"}
              />
              <span className={styles.spacer} />
              <label className={styles.label} htmlFor="userLastName">
                Last Name
              </label>
              <input
                className={styles.input}
                id="userLastName"
                name="userLastName"
                type="text"
                value={userLastName}
                onChange={(e) => setUserLastName(e.target.value)}
                required={requestType === "POST"}
              />
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="userEmail">
                Email
              </label>
              <input
                className={styles.input}
                id="userEmail"
                name="userEmail"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required={requestType === "POST"}
              />
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="userRole">
                Role
              </label>
              <select
                className={styles.input}
                id="userRole"
                name="userRole"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                required={requestType === "POST"}>
                <option value="1">Staff</option>
              </select>
            </div>
          </div>

          <div className={styles.formBtnContainer}>
            <button
              type="submit"
              className={`${styles.btn} ${styles.submitBtn}`}>
              {requestType === "POST" ? "Add User" : "Update User"}
            </button>

            <Modal.Close className={`${styles.btn} ${styles.cancelBtn}`}>
              Cancel
            </Modal.Close>
          </div>
        </form>
      )}
    </>
  );
};

export default UserForm;
