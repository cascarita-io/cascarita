import React, { useState } from "react";
import styles from "./PlayerForm.module.css";
import { PlayerFormProps } from "./types";
import Modal from "../../Modal/Modal";
import { useUpdateTeam } from "../../../api/teams/mutations";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { PlayerType, ShortTeamType } from "../../../pages/Players/types";
import { TeamType } from "../../../pages/Teams/types";

const PlayerForm: React.FC<PlayerFormProps> = ({
  afterSave,
  requestType,
  player,
  teams,
}) => {
  const { t } = useTranslation("Players");
  const [updatedPlayer, setUpdatedPlayer] = useState<PlayerType>(player);
  const groupId = Number(Cookies.get("group_id")) || 0;

  const updateTeamMutation = useUpdateTeam();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const teamName = formData.get("teamName") as string;
    const teamLogo = formData.get("teamLogo") as File;

    const data = {
      formData: {
        name: teamName,
        team_logo: teamLogo,
        group_id: groupId,
        // season_id: seasonId,
      },
    };

    // TODO: Refactor mutations to not rely on season but rather division
    switch (requestType) {
      case "PATCH":
        // updateTeamMutation.mutate({
        //   id: teamId,
        //   ...data,
        // } as UpdateTeamData);
        console.log("HPATCHJ");
        break;
      default:
        throw Error("No request type was supplied");
    }

    afterSave();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* <div className={styles.inputContainer}>
        <label className={styles.label}>
          {t("formContent.unlinkLinkToTeam")}
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
      </div> */}
      <div className={styles.inputContainer}>
        <label className={styles.label}>
          {t("formContent.unlinkLinkToTeam")}
        </label>
        <div className={styles.multiSelectContainer}></div>
        {teams?.map((team: TeamType) => (
          <div key={team.id} className={styles.multiSelectItem}>
            <input
              type="checkbox"
              id={`team-${team.id}`}
              name="teams"
              value={team.id}
              checked={(updatedPlayer.teams ?? []).some(
                (playerTeam: ShortTeamType) => playerTeam.id === team.id
              )}
              onChange={(e) => {
                const selectedTeams = e.target.checked
                  ? [...(updatedPlayer.teams ?? []), team]
                  : (updatedPlayer.teams ?? []).filter(
                      (playerTeam: ShortTeamType) => playerTeam.id !== team.id
                    );
                setUpdatedPlayer({ ...updatedPlayer, teams: selectedTeams });
              }}
            />
            <label style={{ paddingLeft: "5px" }} htmlFor={`team-${team.id}`}>
              {team.name}
            </label>
          </div>
        ))}
      </div>

      {/* {seasonId !== 0 && (
        <div className={styles.inputContainer}>
          <label className={styles.label}>{t("formContent.division")}</label>
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

      <div className={styles.inputContainer}>
        <label className={styles.label}>{t("formContent.linkToSeason")}</label>
        <input
          type="checkbox"
          id="linkToSeason"
          name="linkToSeason"
          checked={linkToSeason}
          onChange={(e) => setLinkToSeason(e.target.checked)}
        />
      </div>

      <div className={styles.inputContainer}>
        <label className={styles.label}>{t("formContent.logo")}</label>

        <FileUpload className={styles.logoInputContainer} />
      </div> */}

      <div className={styles.formBtnContainer}>
        <Modal.Close className={`${styles.btn} ${styles.cancelBtn}`}>
          {t("formContent.cancel")}
        </Modal.Close>

        <div>
          <button type="submit" className={`${styles.btn} ${styles.submitBtn}`}>
            {t("formContent.submit")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlayerForm;
