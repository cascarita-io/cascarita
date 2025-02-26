import React, { useEffect, useState } from "react";
import styles from "../Form.module.css";
import Modal from "../../Modal/Modal";
import {
  LeagueFormProps,
  CreateNewLeagueData,
  UpdateLeagueData,
  DeleteLeagueData,
} from "./types";
import { useAuth0 } from "@auth0/auth0-react";
import DeleteForm from "../DeleteForm/DeleteForm";
import {
  useCreateLeague,
  useDeleteLeague,
  useUpdateLeague,
} from "../../../api/leagues/mutations";
import Cookies from "js-cookie";
import { fetchUser } from "../../../api/users/service";
import { User } from "../../../api/users/types";
import { useTranslation } from "react-i18next";

const LeagueForm: React.FC<LeagueFormProps> = ({
  afterSave,
  requestType,
  leagueId,
}) => {
  const { t } = useTranslation("Leagues");
  const [leagueName, setLeagueName] = useState("");
  const [leagueDesc, setLeagueDesc] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { getAccessTokenSilently } = useAuth0();

  const createLeagueMutation = useCreateLeague();
  const updateLeagueMutation = useUpdateLeague();
  const deleteLeagueMutation = useDeleteLeague();

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const email = Cookies.get("email") || "";
      const currentUser = await fetchUser(email, token);
      setCurrentUser(currentUser);
    })();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { leagueName, leagueDescription } = Object.fromEntries(
      new FormData(event.currentTarget),
    );

    const data = {
      formData: {
        name: leagueName,
        description: leagueDescription,
        group_id: currentUser?.group_id,
      },
    };

    switch (requestType) {
      case "POST":
        createLeagueMutation.mutate(data as CreateNewLeagueData);
        break;
      case "PATCH":
        updateLeagueMutation.mutate({
          id: leagueId,
          ...data,
        } as UpdateLeagueData);
        break;
      case "DELETE":
        deleteLeagueMutation.mutate({
          id: leagueId ? leagueId : 0,
        } as DeleteLeagueData);
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
              <label className={styles.label} htmlFor="leagueName">
                {t("formContent.name")}
              </label>
              <input
                className={styles.input}
                required
                placeholder={t("formContent.namePlaceholder")}
                id="leagueName"
                name="leagueName"
                value={leagueName}
                onChange={(event) =>
                  setLeagueName(event.target.value.replaceAll("/", ""))
                }
              />
            </div>

            <div className={`${styles.inputContainer} ${styles.halfContainer}`}>
              <label className={styles.label} htmlFor="leagueDesc">
                {t("formContent.description")}
              </label>
              <input
                className={styles.input}
                placeholder={t("formContent.descriptionPlaceholder")}
                id="leagueDesc"
                name="leagueDescription"
                value={leagueDesc}
                onChange={(event) => setLeagueDesc(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.formBtnContainer}>
            <button
              type="submit"
              className={`${styles.btn} ${styles.submitBtn}`}
            >
              {requestType === "POST"
                ? t("formContent.create")
                : t("formContent.edit")}
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

export default LeagueForm;
