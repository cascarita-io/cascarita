import { QueryFunctionContext } from "@tanstack/react-query";
import {
  LeagueResponse,
  CreateNewLeagueData,
  UpdateLeagueData,
  DeleteLeagueData,
} from "../../components/Forms/LeagueForm/types";

type LeagueQueryKey = [string, number];

const getLeagueByGroupId = async ({
  queryKey,
}: QueryFunctionContext<LeagueQueryKey>) => {
  const [, groupId] = queryKey;
  try {
    const response = await fetch(`/api/groups/${groupId}/leagues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching league: ", error);
    throw error;
  }
};

const createNewLeague = async (
  data: CreateNewLeagueData
): Promise<LeagueResponse> => {
  try {
    const response = await fetch("/api/leagues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.formData),
    });

    return response.json();
  } catch (error) {
    console.error("Error creating league: ", error);
    throw error;
  }
};

const updateLeague = async (
  data: UpdateLeagueData
): Promise<LeagueResponse> => {
  try {
    const response = await fetch(`/api/leagues/${data.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.formData),
    });
    return response.json();
  } catch (error) {
    console.error("Error updating league: ", error);
    throw error;
  }
};

const deleteLeague = async (data: DeleteLeagueData): Promise<void> => {
  try {
    const response = await fetch(`api/leagues/${data.id}`, {
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
    console.error("Error deleting league: ", error);
    throw error;
  }
};

export { getLeagueByGroupId, createNewLeague, updateLeague, deleteLeague };
