import React, { useEffect } from "react";
import styles from "../Form.module.css";
import Modal from "../../Modal/Modal";
import { SeasonFormData, SeasonFormProps, SeasonRequest } from "./types";
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
  seasonName,
  seasonLeagueId,
  seasonStartDate,
  seasonEndDate,
  leagueData,
}) => {
  const { t } = useTranslation("Seasons");
  const [error, setError] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SeasonFormData>({
    defaultValues: {
      name: "",
      league_id: 0,
      start_date: "",
      end_date: "",
    },
    resolver: zodResolver(seasonSchema),
  });

  const parseDateTimeString = (dateString: string) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  useEffect(() => {
    setValue("name", seasonName || "");
    setValue("league_id", Number(seasonLeagueId) || 0);
    setValue(
      "start_date",
      seasonStartDate ? parseDateTimeString(seasonStartDate) : ""
    );
    setValue(
      "end_date",
      seasonEndDate ? parseDateTimeString(seasonEndDate) : ""
    );
  }, [seasonName, seasonLeagueId, seasonStartDate, seasonEndDate]);

  const createSeasonMutation = useCreateSeason();
  const updateSeasonMutation = useUpdateSeason();
  const deleteSeasonMutation = useDeleteSeason();

  const onSubmit: SubmitHandler<SeasonFormData> = async (
    data: SeasonFormData
  ) => {
    const { name, start_date, end_date, league_id } = data;

    const payload = {
      name,
      start_date,
      end_date,
      league_id,
      is_active: true,
    };

    switch (requestType) {
      case "POST": {
        const dataPost = await createSeasonMutation.mutateAsync(
          payload as SeasonRequest
        );
        if (dataPost.error) {
          setError(dataPost.error);
          return;
        }
        break;
      }
      case "PATCH": {
        const dataUpdate = await updateSeasonMutation.mutateAsync({
          id: seasonId,
          ...payload,
        } as SeasonRequest);
        if (dataUpdate.error) {
          setError(dataUpdate.error);
          return;
        }
        break;
      }
      default:
        throw Error("No request type was supplied");
    }

    afterSave();
  };

  const onDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteSeasonMutation.mutate({
      id: seasonId ? seasonId : 0,
    } as SeasonRequest);
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
                onChange={() => setError("")}
              />
              {errors.name && (
                <span className={styles.error}>{errors.name?.message}</span>
              )}
              {error && <span className={styles.error}>{error}</span>}
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.label}>League</label>
              <select
                {...register("league_id", {
                  setValueAs: (value) => (value === "" ? 0 : Number(value)),
                })}
                id="leagueId"
                className={`${styles.input} ${errors.league_id ? styles.invalid : ""}`}
              >
                <option value={0}>Select a league</option>
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
