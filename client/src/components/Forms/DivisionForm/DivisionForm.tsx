import React, { useState } from "react";
import styles from "../Form.module.css";
import Modal from "../../Modal/Modal";
import { DivisionFormData, DivisionFormProps, DivisionRequest } from "./types";
import {
  useCreateDivision,
  useUpdateDivision,
  useDeleteDivision,
} from "../../../api/divisions/mutations";
import DeleteForm from "../DeleteForm/DeleteForm";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { SeasonType } from "../../../pages/Seasons/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { divisionSchema } from "./schema";

const DivisionForm: React.FC<DivisionFormProps> = ({
  afterSave,
  divisionId,
  seasonId,
  divisionName,
  requestType,
  seasonData,
}) => {
  const { t } = useTranslation("Divisions");
  const [requestError, setRequestError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm<DivisionFormData>({
    defaultValues: {
      name: divisionName || "",
      season_id: seasonId || 0,
    },
    resolver: zodResolver(divisionSchema),
    mode: "onChange",
  });

  const groupId = Cookies.get("group_id") || 0;
  const name = watch("name");

  const createDivisionMutation = useCreateDivision();
  const updateDivisionMutation = useUpdateDivision();
  const deleteDivisionMutation = useDeleteDivision();

  const onSubmit: SubmitHandler<DivisionFormData> = async (
    data: DivisionFormData
  ) => {
    const { name, season_id } = data;

    const payload = {
      name,
      group_id: groupId,
      season_id: season_id,
    };

    switch (requestType) {
      case "POST": {
        const dataPost = await createDivisionMutation.mutateAsync(
          payload as DivisionRequest
        );
        if (dataPost.error) {
          setRequestError(dataPost.error);
          return;
        }
        break;
      }

      case "PATCH": {
        const dataUpdate = await updateDivisionMutation.mutateAsync({
          id: divisionId,
          ...payload,
        } as DivisionRequest);
        if (dataUpdate.error) {
          setRequestError(dataUpdate.error);
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
    deleteDivisionMutation.mutate({
      id: divisionId ? divisionId : 0,
    } as DivisionRequest);
    afterSave();
  };

  return (
    <>
      {requestType === "DELETE" ? (
        <DeleteForm
          className={styles.form}
          destructBtnLabel={t("formContent.delete")}
          onSubmit={onDelete}
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
                className={`${styles.input} ${errors.name || requestError || name.length > 50 ? styles.invalid : ""}`}
                placeholder={t("formContent.namePlaceholder")}
                id="divisionName"
              />
              {errors.name && (
                <span className={styles.error}>{errors.name?.message}</span>
              )}
              {!errors.name && name.length > 50 && (
                <span className={styles.error}>
                  Division name cannot exceed 50 characters
                </span>
              )}
              {requestError && (
                <span className={styles.error}>{requestError}</span>
              )}
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="seasonId">
                {t("formContent.season")}
              </label>
              <select
                {...register("season_id", {
                  setValueAs: (value) => (value === "" ? 0 : Number(value)),
                })}
                id="seasonId"
                className={`${styles.input} ${errors.season_id ? styles.invalid : ""}`}
                onChange={() => clearErrors("season_id")}
              >
                <option value={0}>Select a league</option>
                {seasonData?.map((season: SeasonType) => (
                  <option key={season.id} value={season.id}>
                    {season.name} - {season.league_name}
                  </option>
                ))}
              </select>

              {errors.season_id && (
                <span className={styles.error}>
                  {errors.season_id?.message}
                </span>
              )}
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

export default DivisionForm;
