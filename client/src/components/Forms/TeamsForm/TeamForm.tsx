import React, { useState, useEffect } from "react";
import styles from "./TeamForm.module.css";
import {
  CreateNewTeamData,
  DeleteTeamData,
  TeamFormProps,
  UpdateTeamData,
} from "./types";
import FileUpload from "../../FileUpload/FileUpload";
import Modal from "../../Modal/Modal";
import { useAuth0 } from "@auth0/auth0-react";
import {
  useCreateTeam,
  useDeleteTeam,
  useUpdateTeam,
} from "../../../api/teams/mutations";
import DeleteForm from "../DeleteForm/DeleteForm";
import { useTranslation } from "react-i18next";
import { fetchUser } from "../../../api/users/service";
import Cookies from "js-cookie";
import { User } from "../../../api/users/types";
const TeamForm: React.FC<TeamFormProps> = ({
  afterSave,
  requestType,
  teamId,
  seasonId,
  divisionId,
}) => {
  const { t } = useTranslation("Teams");
  const [teamName, setTeamName] = React.useState("");
  const { getAccessTokenSilently } = useAuth0();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const email = Cookies.get("email") || "";
      const user = await fetchUser(email, token);
      setCurrentUser(user);
    })();
  }, []);

  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const teamName = formData.get("teamName") as string;
    const teamLogo = formData.get("teamLogo") as File;

    const data = {
      formData: {
        name: teamName,
        team_logo: teamLogo,
        group_id: currentUser?.group_id,
        division_id: divisionId,
        season_id: seasonId,
      },
    };

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
            <label className={styles.label}>{t("formContent.logo")}</label>

            <FileUpload className={styles.logoInputContainer} />
          </div>

          <div className={styles.formBtnContainer}>
            <Modal.Close className={`${styles.btn} ${styles.cancelBtn}`}>
              {t("formContent.cancel")}
            </Modal.Close>

            <div>
              <button
                type="submit"
                className={`${styles.btn} ${styles.submitBtn}`}
              >
                {t("formContent.submit")}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default TeamForm;
