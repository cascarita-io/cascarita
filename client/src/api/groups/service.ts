import { QueryFunctionContext } from "@tanstack/react-query";

const getAllGroups = async () => {
  try {
    const response = await fetch(`/api/groups/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });

    return response.json();
  } catch (error) {
    console.error("Error fetching groups: ", error);
    throw error;
  }
};

type GroupQueryKey = [string, number];
const getGroupById = async ({
  queryKey,
}: QueryFunctionContext<GroupQueryKey>) => {
  const [, groupId] = queryKey;
  try {
    const response = await fetch(`/api/groups/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching group: ", error);
    throw error;
  }
};

export { getAllGroups, getGroupById };
