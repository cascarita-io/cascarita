import React from "react";
import styles from "../Form.module.css";
import Modal from "../../Modal/Modal";
import {
  DeleteSeasonData,
  SeasonFormData,
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
import { useForm, SubmitHandler } from "react-hook-form";
import { seasonSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";

const SeasonForm: React.FC<SeasonFormProps> = ({
  afterSave,
  requestType,
  seasonId,
  leagueData,
}) => {
  const { t } = useTranslation("Seasons");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SeasonFormData>({
    defaultValues: {
      name: "",
      league_id: 0,
      start_date: "",
      end_date: "",
      is_active: false,
    },
    resolver: zodResolver(seasonSchema),
  });

  const createSeasonMutation = useCreateSeason();
  const updateSeasonMutation = useUpdateSeason();
  const deleteSeasonMutation = useDeleteSeason();

  const onSubmit: SubmitHandler<SeasonFormData> = async (
    data: SeasonFormData
  ) => {
    const { name, start_date, end_date, league_id } = data;

    const payload = {
      name: name,
      start_date: start_date,
      end_date: end_date,
      is_active: true,
      league_id: league_id,
    };

    switch (requestType) {
      case "POST":
        createSeasonMutation.mutate(payload as SeasonFormData);
        break;
      case "PATCH":
        updateSeasonMutation.mutate({
          id: seasonId,
          ...data,
        } as UpdateSeasonData);
        break;

      default:
        throw Error("No request type was supplied");
    }
    afterSave();
  };

  const onDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteSeasonMutation.mutate({
      id: seasonId ? seasonId : 0,
    } as DeleteSeasonData);
    afterSave();
  };

  return (
    <>
      {requestType === "DELETE" ? (
        <DeleteForm
          destructBtnLabel={t("formContent.delete")}
          onSubmit={onDelete}
          className={styles.form}
        >
          <p>{t("formContent.deleteMessage")}</p>
        </DeleteForm>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: "grid", gap: "24px" }}>
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="seasonName">
                {t("formContent.name")}
              </label>
              <input
                {...register("name")}
                className={`${styles.input} ${errors.name ? styles.invalid : ""}`}
                placeholder={t("formContent.name")}
                id="seasonName"

                // onChange={(event) =>
                //   setSeasonName(event.target.value.replaceAll("/", ""))
                // }
              />
              <span className={styles.error}>{errors.name?.message}</span>
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.label}>League</label>
              <select
                {...register("league_id")}
                id="leagueId"
                name="leagueId"
                className={`${styles.input} ${errors.league_id ? styles.invalid : ""}`}
              >
                <option value="">Select a league</option>
                {leagueData?.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
              <span className={styles.error}>{errors.league_id?.message}</span>
            </div>
            <div className={styles.inputContainer}>
              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="startDate">
                  {t("formContent.start")}
                </label>
                <input
                  {...register("start_date")}
                  className={`${styles.input} ${errors.start_date ? styles.invalid : ""}`}
                  type="date"
                  id="startDate"
                  name="startDate"
                />
                <span className={styles.error}>
                  {errors.start_date?.message}
                </span>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="endDate">
                  {t("formContent.end")}
                </label>
                <input
                  {...register("end_date")}
                  className={`${styles.input} ${errors.end_date ? styles.invalid : ""}`}
                  type="date"
                  id="endDate"
                  name="endDate"
                />
                <span className={styles.error}>{errors.end_date?.message}</span>
              </div>
            </div>
          </div>

          <div className={styles.formBtnContainer}>
            <button
              type="submit"
              className={`${styles.btn} ${styles.submitBtn}`}
            >
              {t("formContent.submit")}
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
