import React, { useState } from "react";
import styles from "../Form.module.css";
import { TeamRequest, TeamFormProps, TeamFormData } from "./types";
import FileUpload from "../../FileUpload/FileUpload";
import Modal from "../../Modal/Modal";
import {
  useCreateTeam,
  useDeleteTeam,
  useUpdateTeam,
} from "../../../api/teams/mutations";
import DeleteForm from "../DeleteForm/DeleteForm";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { DivisionType } from "../../../pages/Division/types";
import { SeasonType } from "../../../pages/Seasons/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUploadPhotoS3 } from "../../../api/photo/mutations";
import { UploadPhotoRequest } from "../../../api/photo/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamSchema } from "./schema";

const TeamForm: React.FC<TeamFormProps> = ({
  afterSave,
  requestType,
  teamId,
  divisionsData,
  seasonsData,
}) => {
  const { t } = useTranslation("Teams");
  const [requestError, setRequestError] = useState("");
  const groupId = Number(Cookies.get("group_id")) || 0;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    clearErrors,
    watch,
  } = useForm<TeamFormData>({
    defaultValues: {
      name: "",
      season_id: 0,
      division_id: 0,
      file_url: undefined,
      link_to_season: false,
    },
    resolver: zodResolver(teamSchema),
    mode: "onChange",
  });

  const isLinkSeason = watch("link_to_season");
  const teamName = watch("name");
  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();
  const uploadUrlMutation = useUploadPhotoS3();

  const onSubmit: SubmitHandler<TeamFormData> = async (data: TeamFormData) => {
    const { name, season_id, division_id, file_url, link_to_season } = data;

    let s3PhotoUpload;
    if (file_url) {
      const s3Payload = {
        file_url: file_url,
        folder_name: "team_images",
        image_type: "team_logo",
      };

      s3PhotoUpload = await uploadUrlMutation.mutateAsync(
        s3Payload as UploadPhotoRequest
      );
    }

    const payload = {
      name,
      team_logo: s3PhotoUpload ? s3PhotoUpload.image_url : undefined,
      group_id: groupId,
      division_id,
      season_id,
      link_to_season,
    };

    switch (requestType) {
      case "POST": {
        const dataPost = await createTeamMutation.mutateAsync(
          payload as TeamRequest
        );
        if (dataPost.error) {
          setRequestError(dataPost.error);
          return;
        }
        break;
      }

      case "PATCH": {
        const dataUpdate = await updateTeamMutation.mutateAsync({
          id: teamId,
          ...payload,
        } as TeamRequest);
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
    deleteTeamMutation.mutate({
      id: teamId ? teamId : 0,
    } as TeamRequest);
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
        <form
          className={styles.form}
          // onSubmit={handleSubmit((data) => console.log(data))}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div style={{ display: "grid", gap: "24px" }}>
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="teamName">
                {t("formContent.name")}
              </label>
              <input
                {...register("name")}
                className={`${styles.input} ${errors.name || requestError || teamName.length > 30 ? styles.invalid : ""}`}
                placeholder={t("formContent.namePlaceholder")}
                id="teamName"
              />
              {errors.name && (
                <span className={styles.error}>{errors.name?.message}</span>
              )}
              {!errors.name && teamName.length > 30 && (
                <span className={styles.error}>
                  Team name cannot exceed 30 characters
                </span>
              )}
              {requestError && (
                <span className={styles.error}>{requestError}</span>
              )}
            </div>

            <div className={styles.radioContainer}>
              <input
                {...register("link_to_season")}
                type="checkbox"
                id="isLinkToSeason"
                onChange={() => {
                  setValue("link_to_season", !watch("link_to_season"));
                }}
              />
              <label className={styles.label} htmlFor="isLinkToSeason">
                {t("formContent.linkToSeason")}
              </label>
            </div>

            {isLinkSeason && (
              <>
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
                    onChange={() => {
                      clearErrors("season_id");
                    }}
                  >
                    <option value={0}>Select a season</option>
                    {seasonsData?.map((season: SeasonType) => (
                      <option key={season.id} value={season.id}>
                        {season.name}
                      </option>
                    ))}
                  </select>
                  {errors.season_id && (
                    <span className={styles.error}>
                      {errors.season_id.message}
                    </span>
                  )}
                </div>

                <div className={styles.inputContainer}>
                  <label className={styles.label} htmlFor="divisionId">
                    {t("formContent.division")}
                  </label>
                  <select
                    {...register("division_id", {
                      setValueAs: (value) => (value === "" ? 0 : Number(value)),
                    })}
                    id="divisionId"
                    className={`${styles.input} ${errors.division_id ? styles.invalid : ""}`}
                    onChange={() => clearErrors("division_id")}
                  >
                    <option value={0}>Select a division</option>
                    {divisionsData?.map((division: DivisionType) => (
                      <option key={division.id} value={division.id}>
                        {division.name}
                      </option>
                    ))}
                  </select>
                  {errors.division_id && (
                    <span className={styles.error}>
                      {errors.division_id.message}
                    </span>
                  )}
                </div>
              </>
            )}

            <div className={styles.inputContainer}>
              <label className={styles.label}>{t("formContent.logo")}</label>
              <FileUpload
                setFileValue={(url?: File) => {
                  setValue("file_url", url);
                }}
                className={styles.logoInputContainer}
              />
            </div>
          </div>

          <div className={styles.formBtnContainer}>
            <button
              type="submit"
              className={`${styles.btn} ${styles.submitBtn}`}
            >
              {isSubmitting
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

export default TeamForm;
