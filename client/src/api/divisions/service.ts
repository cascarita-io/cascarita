import { QueryFunctionContext } from "@tanstack/react-query";
import {
  DivisionRequest,
  DivisionResponse,
} from "../../components/Forms/DivisionForm/types";

type divisionQueryKey = [string, number];

const getDivisionByGroupId = async ({
  queryKey,
}: QueryFunctionContext<divisionQueryKey>) => {
  const [, groupId] = queryKey;
  try {
    const response = await fetch(`/api/divisions/group/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching division: ", error);
    throw error;
  }
};

const getDivisionsBySeasonId = async ({
  queryKey,
}: QueryFunctionContext<divisionQueryKey>) => {
  const [, seasonId] = queryKey;

  try {
    const response = await fetch(`/api/seasons/${seasonId}/divisions`, {
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

const createDivision = async (
  data: DivisionRequest
): Promise<DivisionResponse> => {
  try {
    const response = await fetch("/api/divisions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("error fetching data:", error);
    throw error;
  }
};

const updateDivision = async (
  data: DivisionRequest
): Promise<DivisionResponse> => {
  try {
    const response = await fetch(`/api/divisions/${data.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("Error updating league: ", error);
    throw error;
  }
};

const deleteDivision = async (data: DivisionRequest): Promise<void> => {
  try {
    const response = await fetch(`/api/divisions/${data.id}`, {
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
  getDivisionsBySeasonId,
  getDivisionByGroupId,
  createDivision,
  updateDivision,
  deleteDivision,
};
