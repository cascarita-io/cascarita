import React, { useState } from "react";
import styles from "../Form.module.css";
import Modal from "../../Modal/Modal";
import {
  CreateNewDivisionData,
  DeleteDivisionData,
  DivisionFormProps,
  UpdateDivisionData,
} from "./types";
import {
  useCreateDivision,
  useUpdateDivision,
  useDeleteDivision,
} from "../../../api/divisions/mutations";
import DeleteForm from "../DeleteForm/DeleteForm";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { SeasonType } from "../../../pages/Seasons/types";

const DivisionForm: React.FC<DivisionFormProps> = ({
  afterSave,
  divisionId,
  requestType,
  // seasonId,
  seasonData,
}) => {
  const { t } = useTranslation("Divisions");
  const [divisionName, setDivisionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [seasonId, setSeasonId] = useState(0);

  const groupId = Cookies.get("group_id") || 0;

  const createDivisionMutation = useCreateDivision();
  const updateDivisionMutation = useUpdateDivision();
  const deleteDivisionMutation = useDeleteDivision();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const { divisionName } = Object.fromEntries(
      new FormData(event.currentTarget),
    );

    const data = {
      formData: {
        name: divisionName,
        group_id: groupId,
        season_id: seasonId,
      },
    };

    switch (requestType) {
      case "POST":
        createDivisionMutation.mutate(data as CreateNewDivisionData);
        break;
      case "PATCH":
        updateDivisionMutation.mutate({
          id: divisionId,
          ...data,
        } as UpdateDivisionData);
        break;
      case "DELETE":
        deleteDivisionMutation.mutate({
          id: divisionId ? divisionId : 0,
        } as DeleteDivisionData);
        break;
      default:
        throw Error("No request type was supplied");
    }

    afterSave();
  };

  return (
    <>
      {requestType === "DELETE" ? (
        <DeleteForm
          className={styles.form}
          destructBtnLabel={t("formContent.delete")}
          onSubmit={handleSubmit}
        >
          <p>{t("formContent.deleteMessage")}</p>
        </DeleteForm>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "24px" }}>
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="seasonName">
                {t("formContent.name")}
              </label>
              <input
                className={styles.input}
                required
                placeholder={t("formContent.namePlaceholder")}
                id="divisionName"
                name="divisionName"
                value={divisionName}
                onChange={(event) =>
                  setDivisionName(event.target.value.replaceAll("/", ""))
                }
              />
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.label}>{t("formContent.season")}</label>
              <select
                required
                id="seasonId"
                name="seasonId"
                value={seasonId}
                onChange={(e) => setSeasonId(Number(e.target.value))}
                className={styles.input}
              >
                <option>Select a season</option>
                {seasonData?.map((season: SeasonType) => (
                  <option key={season.id} value={season.id}>
                    {season.name} - {season.league_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formBtnContainer}>
            <button
              type="submit"
              className={`${styles.btn} ${styles.submitBtn}`}
            >
              {isLoading === true
                ? t("formContent.submitting")
                : t("formContent.submit")}
            </button>

            <Modal.Close className={`${styles.btn} ${styles.cancelBtn}`}>
              {t("formContent.cancel")}
            </Modal.Close>
          </div>
        </form>
      )}
    </>
  );
};

export default DivisionForm;
