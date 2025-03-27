import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "js-cookie";

import { connectStripe } from "../../../api/stripe/service";
import { fetchUser } from "../../../api/users/service";
import { User } from "../../../api/users/types";
import { StripeLogoIcon } from "../../../assets/Icons";
import DeleteForm from "../../../components/Forms/DeleteForm/DeleteForm";
import Modal from "../../../components/Modal/Modal";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import styles from "./StripeAccountForm.module.css";
import { StripeAccountFormProps } from "./types";

const StripeAccountForm: React.FC<StripeAccountFormProps> = ({
  afterSave,
  requestType,
}) => {
  const { t } = useTranslation("Settings");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const email = Cookies.get("email") || "";
      const currentUser = await fetchUser(email, token);
      setCurrentUser(currentUser);
    })();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    afterSave();
  };

  const handleStripeConnect = async () => {
    try {
      if (!currentUser) {
        return;
      }
      await connectStripe(
        currentUser?.id,
        currentUser?.email,
        name,
        description,
      );
      afterSave();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {requestType === "DELETE" ? (
        <DeleteForm
          destructBtnLabel={t("payment.formContent.delete")}
          onSubmit={handleSubmit}
          className={styles.form}>
          <p>{t("payment.formContent.deleteMessage")}</p>
        </DeleteForm>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "8px" }}>
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="name">
                {t("payment.formContent.name")}
              </label>
              <input
                className={styles.input}
                required
                placeholder={t("payment.formContent.namePlaceholder")}
                id="name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className={`${styles.inputContainer}`}>
              <label className={styles.label} htmlFor="description">
                {t("payment.formContent.description")}
              </label>
              <input
                className={styles.input}
                placeholder={t("payment.formContent.descriptionPlaceholder")}
                id="description"
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.stripeBtnContainer}>
            <PrimaryButton
              className={styles.stripeBtn}
              onClick={handleStripeConnect}>
              {t("payment.formContent.connectStripe")}
              <StripeLogoIcon
                className={styles.stripeLogo}
                style={{
                  fill: "#FFFFFF",
                  width: "50px",
                }}
              />
            </PrimaryButton>

            <Modal.Close className={`${styles.btn} ${styles.cancelBtn}`}>
              {t("payment.formContent.cancel")}
            </Modal.Close>
          </div>
        </form>
      )}
    </>
  );
};

export default StripeAccountForm;
