import React, { useEffect, useState } from "react";
import styles from "../Form.module.css";
import Modal from "../../Modal/Modal";
import { LeagueFormProps, LeagueFormData, LeagueRequest } from "./types";
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
import { useForm, SubmitHandler } from "react-hook-form";
import { leagueSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";

const LeagueForm: React.FC<LeagueFormProps> = ({
  afterSave,
  requestType,
  leagueId,
}) => {
  const { t } = useTranslation("Leagues");
  const [error, setError] = React.useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { getAccessTokenSilently } = useAuth0();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeagueFormData>({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(leagueSchema),
  });

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

  const onSubmit: SubmitHandler<LeagueFormData> = async (
    data: LeagueFormData
  ) => {
    const { name, description } = data;

    const payload = {
      name: name,
      description: description,
      group_id: currentUser?.group_id,
    };

    switch (requestType) {
      case "POST": {
        const dataPost = await createLeagueMutation.mutateAsync(
          payload as LeagueRequest
        );
        if (dataPost.error) {
          setError(dataPost.error);
          return;
        }
        break;
      }
      case "PATCH": {
        const dataUpdate = await updateLeagueMutation.mutateAsync({
          id: leagueId,
          ...payload,
        } as LeagueRequest);
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
    deleteLeagueMutation.mutate({
      id: leagueId ? leagueId : 0,
    } as LeagueRequest);
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
              <label className={styles.label} htmlFor="leagueName">
                {t("formContent.name")}
              </label>
              <input
                {...register("name")}
                className={`${styles.input} ${errors.name ? styles.invalid : ""}`}
                placeholder={t("formContent.namePlaceholder")}
                id="leagueName"
                onChange={() => setError("")}
              />
              {errors.name && (
                <span className={styles.error}>{errors.name?.message}</span>
              )}
              {error && <span className={styles.error}>{error}</span>}
            </div>

            <div className={`${styles.inputContainer} ${styles.halfContainer}`}>
              <label className={styles.label} htmlFor="leagueDesc">
                {t("formContent.description")}
              </label>
              <input
                {...register("description")}
                className={styles.input}
                placeholder={t("formContent.descriptionPlaceholder")}
                id="leagueDesc"
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
