import React from "react";
import styles from "../Form.module.css";
import Modal from "../../Modal/Modal";
import {
  CreateNewSeasonData,
  DeleteSeasonData,
  SeasonFormProps,
  UpdateSeasonData,
} from "./types";
import {
  useCreateSeason,
  useDeleteSeason,
  useUpdateSeason,
} from "../../../api/seasons/mutations";
import DeleteForm from "../DeleteForm/DeleteForm";
import { useTranslation } from "react-i18next";

const SeasonForm: React.FC<SeasonFormProps> = ({
  afterSave,
  requestType,
  seasonId,
  leagueData,
}) => {
  const { t } = useTranslation("Seasons");
  const [leagueId, setLeagueId] = React.useState(0);
  const [seasonName, setSeasonName] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const createSeasonMutation = useCreateSeason();
  const updateSeasonMutation = useUpdateSeason();
  const deleteSeasonMutation = useDeleteSeason();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const { seasonName, startDate, endDate } = Object.fromEntries(
      new FormData(event.currentTarget),
    );

    const data = {
      formData: {
        name: seasonName,
        start_date: startDate,
        end_date: endDate,
        is_active: true,
        league_id: leagueId,
      },
    };

    switch (requestType) {
      case "POST":
        createSeasonMutation.mutate(data as CreateNewSeasonData);
        break;
      case "PATCH":
        updateSeasonMutation.mutate({
          id: seasonId,
          ...data,
        } as UpdateSeasonData);
        break;
      case "DELETE":
        deleteSeasonMutation.mutate({
          id: seasonId ? seasonId : 0,
        } as DeleteSeasonData);
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
          destructBtnLabel={t("formContent.delete")}
          onSubmit={handleSubmit}
          className={styles.form}
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
                placeholder={t("formContent.name")}
                id="seasonName"
                name="seasonName"
                value={seasonName}
                onChange={(event) =>
                  setSeasonName(event.target.value.replaceAll("/", ""))
                }
              />
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.label}>League</label>
              <select
                required
                id="leagueId"
                name="leagueId"
                value={leagueId}
                className={styles.input}
                onChange={(e) => setLeagueId(Number(e.target.value))}
              >
                <option value="">Select a league</option>
                {leagueData?.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputContainer}>
              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="startDate">
                  {t("formContent.start")}
                </label>
                <input
                  className={styles.input}
                  required
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="endDate">
                  {t("formContent.end")}
                </label>
                <input
                  className={styles.input}
                  required
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.formBtnContainer}>
            <button
              type="submit"
              className={`${styles.btn} ${styles.submitBtn}`}
            >
              {isLoading === true ? "Saving..." : t("formContent.submit")}
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

export default SeasonForm;
