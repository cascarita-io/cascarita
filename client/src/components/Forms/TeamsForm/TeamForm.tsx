import React, { useEffect, useState } from "react";
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
import { DivisionType } from "../../../pages/Division/types";
import { SeasonType } from "../../../pages/Seasons/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { uploadPhotoToS3 } from "../../../api/photo/service";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamSchema } from "./schema";
import { useGroup } from "../../GroupProvider/GroupProvider";
import { toast } from "react-toastify";
import { useGetDivisionsBySeasonId } from "../../../api/divisions/query";

const TeamForm: React.FC<TeamFormProps> = ({
  afterSave,
  requestType,
  teamName,
  seasonId,
  divisionId,
  teamLogo,
  teamId,
  seasonsData,
}) => {
  const { t } = useTranslation("Teams");
  const [requestError, setRequestError] = useState("");
  const [teamPhoto, setTeamPhoto] = useState<string | undefined>(teamLogo);
  const { groupId } = useGroup();
  const [page, setPage] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    clearErrors,
    watch,
  } = useForm<TeamFormData>({
    defaultValues: {
      name: teamName || "",
      season_id: seasonId || 0,
      division_id: divisionId || 0,
      file_url: undefined,
      ack_photo: undefined,
      link_to_season: divisionId && seasonId ? true : false,
    },
    resolver: zodResolver(teamSchema),
    mode: "onChange",
  });

  const fileUrl = watch("file_url");
  useEffect(() => {
    const uploadPhoto = async () => {
      if (fileUrl) {
        const uploadUrl = await uploadPhotoToS3(
          fileUrl,
          "registration_images",
          "player_photo"
        );
        setTeamPhoto(uploadUrl.image_url);
      }
    };
    uploadPhoto();
  }, [fileUrl]);

  const isLinkSeason = watch("link_to_season");
  const [currentSeason, setCurrentSeason] = useState(seasonId);
  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();

  const { data: divisions, refetch } = useGetDivisionsBySeasonId(
    currentSeason as number
  );

  useEffect(() => {
    refetch();
  }, [currentSeason]);

  const onSubmit: SubmitHandler<TeamFormData> = async (data: TeamFormData) => {
    const { name, season_id, division_id, link_to_season } = data;

    const payload = {
      name,
      team_logo: teamPhoto ? teamPhoto : undefined,
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
          toast.error(dataPost.error);
          return;
        } else {
          toast.success("Team Created Successfully");
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
          toast.error(dataUpdate.error);
          return;
        } else {
          toast.success("Team Updated Successfully");
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
    toast.success("Team Deleted Successfully");
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
          {page === 0 && (
            <div style={{ display: "grid", gap: "24px" }}>
              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="teamName">
                  {t("formContent.name")}
                </label>
                <input
                  {...register("name")}
                  className={`${styles.input} ${errors.name || requestError ? styles.invalid : ""}`}
                  placeholder={t("formContent.namePlaceholder")}
                  id="teamName"
                />
                {errors.name && (
                  <span className={styles.error}>{errors.name?.message}</span>
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
                />
                <label htmlFor="isLinkToSeason">
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
                        setValueAs: (value) =>
                          value === "" ? 0 : Number(value),
                      })}
                      id="seasonId"
                      className={`${styles.input} ${errors.season_id ? styles.invalid : ""}`}
                      onChange={(e) => {
                        clearErrors("season_id");
                        setCurrentSeason(Number(e.target.value));
                      }}
                    >
                      <option value={0}>Select a season</option>
                      {seasonsData?.map((season: SeasonType) => (
                        <option key={season.id} value={season.id}>
                          {season.league_name} - {season.name}
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
                        setValueAs: (value) =>
                          value === "" ? 0 : Number(value),
                      })}
                      id="divisionId"
                      className={`${styles.input} ${errors.division_id ? styles.invalid : ""}`}
                      onChange={() => clearErrors("division_id")}
                    >
                      <option value={0}>Select a division</option>
                      {divisions?.map((division: DivisionType) => (
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
            </div>
          )}
          {page === 1 && (
            <div style={{ display: "grid", gap: "24px" }}>
              <div className={styles.inputContainer}>
                <label className={styles.label}>{t("formContent.logo")}</label>
                <FileUpload
                  setFileValue={(url?: File) => {
                    setValue("file_url", url);
                  }}
                  imagePreview={teamPhoto}
                  className={styles.logoInputContainer}
                />
              </div>
              {fileUrl && (
                <div className={styles.radioContainer}>
                  <input
                    type="checkbox"
                    {...register("ack_photo", {
                      required: fileUrl !== undefined,
                    })}
                    className={styles.input}
                    id={"ack-photo"}
                    required={fileUrl !== undefined}
                  />
                  <label htmlFor="ack-photo">
                    I confirm that I either own the rights to, or have obtained
                    the necessary permissions to share, any images I upload.
                  </label>
                </div>
              )}
            </div>
          )}

          {page === 0 && (
            <div className={styles.formBtnContainer}>
              <button
                onClick={() => setPage(1)}
                className={`${styles.btn} ${styles.submitBtn}`}
              >
                {t("formContent.next")}
              </button>

              <Modal.Close className={`${styles.btn} ${styles.cancelBtn}`}>
                {t("formContent.cancel")}
              </Modal.Close>
            </div>
          )}
          {page === 1 && (
            <div className={styles.formBtnContainer}>
              <button
                type="submit"
                className={`${styles.btn} ${styles.submitBtn}`}
              >
                {isSubmitting
                  ? t("formContent.submitting")
                  : t("formContent.submit")}
              </button>

              <button
                onClick={() => setPage(0)}
                className={`${styles.btn} ${styles.cancelBtn}`}
              >
                {t("formContent.back")}
              </button>
            </div>
          )}
        </form>
      )}
    </>
  );
};

export default TeamForm;
