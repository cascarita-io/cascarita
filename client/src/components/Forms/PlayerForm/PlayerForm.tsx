import React, { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import styles from "../Form.module.css";
import { PlayerFormData, PlayerFormProps, PlayerRequest } from "./types";
import { useAddUser, useUpdatePlayerTeams } from "../../../api/users/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { playerSchema } from "./schema";
import PlayerFormPageOne from "./PlayerFormPageOne";
import PlayerFormPageTwo from "./PlayerFormPageTwo";
import PlayerFormPageThree from "./PlayerFormPageThree";
import { uploadPhotoToS3 } from "../../../api/photo/service";
import { useGroup } from "../../GroupProvider/GroupProvider";
import { toast } from "react-toastify";

const PlayerForm: React.FC<PlayerFormProps> = ({
  afterSave,
  requestType,
  player,
  leagues,
  seasons,
  divisions,
  teams,
}) => {
  const [requestError, setRequestError] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [playerPhoto, setPlayerPhoto] = useState<string | undefined>(
    player?.picture || ""
  );

  const { groupId } = useGroup();

  const incrementPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const decrementPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const formMethods = useForm<PlayerFormData>({
    defaultValues: {
      first_name: player?.first_name || "",
      last_name: player?.last_name || "",
      email: player?.email || "",
      phone_number: player?.phone_number || "",
      date_of_birth: "",
      address: player?.address || "",
      picture: undefined,
      liability: false,
      link_to_team: "no",
      league_id: player?.league_id || 0,
      season_id: player?.season_id || 0,
      division_id: player?.division_id || 0,
    },
    resolver: zodResolver(playerSchema),
    mode: "onChange",
  });
  const {
    handleSubmit,
    formState: { isValid },
    watch,
  } = formMethods;

  const isLiabilityChecked = watch("liability");
  const fileUrl = watch("picture");
  useEffect(() => {
    const uploadPhoto = async () => {
      if (fileUrl) {
        const uploadUrl = await uploadPhotoToS3(
          fileUrl,
          "registration_images",
          "player_photo"
        );
        setPlayerPhoto(uploadUrl.image_url);
      }
    };
    uploadPhoto();
  }, [fileUrl]);

  const createPlayerMutation = useAddUser();
  const updatePlayerTeamsMutation = useUpdatePlayerTeams();

  const onSubmit: SubmitHandler<PlayerFormData> = async (
    data: PlayerFormData
  ) => {
    const {
      first_name,
      last_name,
      link_to_team,
      email,
      team_id,
      season_id,
      division_id,
      league_id,
      phone_number,
      date_of_birth,
      address,
      liability,
    } = data;

    const payload = {
      first_name,
      last_name,
      email,
      phone_number,
      date_of_birth,
      address,
      photo: playerPhoto || "",
      liability,
      team_id,
      league_id,
      division_id,
      season_id,
      link_to_team,
      group_id: groupId,
    };

    switch (requestType) {
      case "POST": {
        const dataPost = await createPlayerMutation.mutateAsync(
          payload as PlayerRequest
        );
        if (dataPost.error) {
          setRequestError(dataPost.error);
          toast.error(dataPost.error);
          return;
        }
        break;
      }
      case "PATCH": {
        const dataUpdate = await updatePlayerTeamsMutation.mutateAsync(
          payload as PlayerRequest
        );
        if (dataUpdate.error) {
          setRequestError(dataUpdate.error);
          toast.error(dataUpdate.error);
          return;
        }
        break;
      }
      default:
        throw Error("No request type was supplied");
    }
    afterSave();
  };

  return (
    <FormProvider {...formMethods}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "grid", gap: "18px" }}>
          {currentPage === 1 && (
            <>
              <PlayerFormPageOne
                requestError={requestError}
                setRequestError={setRequestError}
              />
            </>
          )}

          {currentPage === 2 && (
            <PlayerFormPageTwo
              leagues={leagues}
              seasons={seasons}
              divisions={divisions}
              teams={teams}
            />
          )}

          {currentPage === 3 && (
            <>
              <PlayerFormPageThree playerPhoto={playerPhoto} />
            </>
          )}
        </div>

        <div className={styles.formBtnContainer}>
          {currentPage > 1 && (
            <button
              className={`${styles.btn} ${styles.cancelBtn}`}
              onClick={decrementPage}
              type="submit"
            >
              Back
            </button>
          )}

          {currentPage < TOTAL_PAGES && (
            <button
              type="button"
              onClick={incrementPage}
              className={`${styles.btn} ${styles.btn}`}
              disabled={!isValid}
            >
              Next
            </button>
          )}

          {currentPage === TOTAL_PAGES && (
            <button
              type="submit"
              className={`${styles.btn} ${styles.submitBtn}`}
              disabled={!isLiabilityChecked}
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

const TOTAL_PAGES = 3;

export default PlayerForm;
