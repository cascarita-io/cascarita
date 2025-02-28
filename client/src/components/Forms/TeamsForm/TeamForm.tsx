import React, { useState, useEffect } from "react";
import styles from "../Form.module.css";
import {
  CreateNewTeamData,
  DeleteTeamData,
  TeamFormProps,
  UpdateTeamData,
} from "./types";
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
import { uploadPhotoToS3 } from "../../../api/photo/service";

const TeamForm: React.FC<TeamFormProps> = ({
  afterSave,
  requestType,
  teamId,
  divisionsData,
  seasonsData,
}) => {
  const { t } = useTranslation("Teams");
  const [teamName, setTeamName] = useState("");
  const [divisionId, setDivisionId] = useState(0);
  const [seasonId, setSeasonId] = useState(0);
  const [linkToSeason, setLinkToSeason] = useState(true);
  const groupId = Number(Cookies.get("group_id")) || 0;

  const [fileUrl, setFileUrl] = useState<File | null>(null);
  const [teamLogo, setTeamLogo] = useState<string | null>(null);

  useEffect(() => {
    const uploadPhoto = async () => {
      if (fileUrl) {
        const uploadUrl = await uploadPhotoToS3(
          fileUrl,
          "team_images",
          "team_logo",
        );
        setTeamLogo(uploadUrl.image_url);
      } else {
        setTeamLogo(null);
      }
    };
    uploadPhoto();
  }, [fileUrl]);

  useEffect(() => {
    if (seasonId !== 0) {
      setLinkToSeason(true);
    }
  }, [seasonId]);

  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const teamName = formData.get("teamName") as string;

    const data = {
      formData: {
        name: teamName,
        team_logo: teamLogo,
        group_id: groupId,
        division_id: divisionId,
        season_id: seasonId,
        link_to_season: linkToSeason,
      },
    };

    // TODO: Refactor mutations to not rely on season but rather division
    switch (requestType) {
      case "POST":
        createTeamMutation.mutate(data as CreateNewTeamData);
        break;
      case "PATCH":
        updateTeamMutation.mutate({
          id: teamId,
          ...data,
        } as UpdateTeamData);
        break;
      case "DELETE":
        deleteTeamMutation.mutate({
          id: teamId ? teamId : 0,
        } as DeleteTeamData);
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
              <label className={styles.label} htmlFor="teamName">
                {t("formContent.name")}
              </label>
              <input
                required
                className={styles.input}
                type="text"
                placeholder={t("formContent.namePlaceholder")}
                id="teamName"
                name="teamName"
                value={teamName}
                onChange={(event) =>
                  setTeamName(event.target.value.replaceAll("/", ""))
                }
              />
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.label}>{t("formContent.season")}</label>
              <select
                id="seasonId"
                name="seasonId"
                value={seasonId}
                className={styles.input}
                onChange={(e) => setSeasonId(Number(e.target.value))}
                required={linkToSeason}
              >
                <option value="">Select a season</option>
                {seasonsData?.map((season: SeasonType) => (
                  <option key={season.id} value={season.id}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>

            {seasonId !== 0 && (
              <div className={styles.inputContainer}>
                <label className={styles.label}>
                  {t("formContent.division")}
                </label>
                <select
                  id="divisionId"
                  name="divisionId"
                  value={divisionId}
                  className={styles.input}
                  onChange={(e) => setDivisionId(Number(e.target.value))}
                  required={linkToSeason}
                >
                  <option value="">Select a division</option>
                  {divisionsData?.map((division: DivisionType) => (
                    <option key={division.id} value={division.id}>
                      {division.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={styles.radioContainer}>
              <label className={styles.label}>
                {t("formContent.linkToSeason")}
              </label>
              <input
                type="checkbox"
                id="linkToSeason"
                name="linkToSeason"
                checked={linkToSeason}
                onChange={(e) => setLinkToSeason(e.target.checked)}
              />
            </div>

            <FileUpload
              setFileValue={(url: File | null) => {
                setFileUrl(url);
              }}
              className={styles.logoInputContainer}
            />
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

export default TeamForm;
