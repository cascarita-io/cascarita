import { QueryFunctionContext } from "@tanstack/react-query";
import {
  LeagueResponse,
  LeagueRequest,
} from "../../components/Forms/LeagueForm/types";

type LeagueQueryKey = [string, number];

const getLeaguesByGroupId = async ({
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
  payload: LeagueRequest
): Promise<LeagueResponse> => {
  try {
    const response = await fetch("/api/leagues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response.json();
  } catch (error) {
    console.error("Error creating league: ", error);
    throw error;
  }
};

const updateLeague = async (
  payload: LeagueRequest
): Promise<LeagueResponse> => {
  try {
    const response = await fetch(`/api/leagues/${payload.id}`, {
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

const deleteLeague = async (
  payload: LeagueRequest
): Promise<LeagueResponse> => {
  try {
    const response = await fetch(`api/leagues/${payload.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete form");
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error("Error deleting league: ", error);
    throw error;
  }
};

export { getLeaguesByGroupId, createNewLeague, updateLeague, deleteLeague };
