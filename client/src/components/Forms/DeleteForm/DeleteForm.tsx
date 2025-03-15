import React from "react";
import styles from "../Form.module.css";
import { DeleteFormProps } from "./types";
import Modal from "../../Modal/Modal";
import { useTranslation } from "react-i18next";

const DeleteForm: React.FC<DeleteFormProps> = ({
  destructBtnLabel,
  children,
  ...delegated
}) => {
  const { t } = useTranslation("DeleteForm");
  return (
    <form {...delegated}>
      {children}
      <div className={styles.formBtnContainer}>
        <Modal.Close className={`${styles.btn} ${styles.cancelBtn}`}>
          {t("cancel")}
        </Modal.Close>

        <button type="submit" className={`${styles.btn} ${styles.submitBtn}`}>
          {destructBtnLabel ? destructBtnLabel : t("deleteLabel")}
        </button>
      </div>
    </form>
  );
};

export default DeleteForm;
