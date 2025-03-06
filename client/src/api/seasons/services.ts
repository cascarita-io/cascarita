import { QueryFunctionContext } from "@tanstack/react-query";
import {
  DeleteSeasonData,
  SeasonFormData,
  SeasonResponse,
  UpdateSeasonData,
} from "../../components/Forms/SeasonForm/types";

type SeasonQueryKey = [string, number];

const getSeasonsByGroupId = async ({
  queryKey,
}: QueryFunctionContext<SeasonQueryKey>) => {
  const [, groupId] = queryKey;
  try {
    const response = await fetch(`/api/seasons/group/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching seasons by league id: ", error);
    throw error;
  }
};

const getSeasonsByLeagueId = async ({
  queryKey,
}: QueryFunctionContext<SeasonQueryKey>) => {
  const [, leagueId] = queryKey;
  try {
    const response = await fetch(`/api/seasons/${leagueId}/leagues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching seasons by league id: ", error);
    throw error;
  }
};

const createNewSeason = async (
  payload: SeasonFormData
): Promise<SeasonResponse> => {
  try {
    const response = await fetch("/api/seasons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log(response);
    return response.json();
  } catch (error) {
    console.error("Error creating season:", error);
    throw error;
  }
};

const updateSeason = async (
  payload: UpdateSeasonData
): Promise<SeasonResponse> => {
  try {
    const response = await fetch(`/api/seasons/${payload.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  } catch (error) {
    console.error("Error updating league: ", error);
    throw error;
  }
};

const deleteSeason = async (data: DeleteSeasonData): Promise<void> => {
  try {
    const response = await fetch(`/api/seasons/${data.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (
      response.status === 204 ||
      response.headers.get("Content-Length") === "0"
    ) {
      return;
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting season: ", error);
    throw error;
  }
};

export {
  createNewSeason,
  getSeasonsByGroupId,
  getSeasonsByLeagueId,
  updateSeason,
  deleteSeason,
};
