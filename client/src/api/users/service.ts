import { QueryFunctionContext } from "@tanstack/react-query";
import {
  DeleteUserData,
  UpdateUserData,
  AddUserData,
} from "../../components/Forms/UserForm/types";
import { UserResponse, LanguageCodeToLanguageId, RegisterUser } from "./types";

const updateUsersLanguages = async (
  user_id: number,
  language: string
): Promise<UserResponse> => {
  const language_id = LanguageCodeToLanguageId[language as "en" | "esp"];

  try {
    const response = await fetch(`/api/users/${user_id}`, {
      method: "PATCH",
      body: JSON.stringify({ language_id: language_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result.language_id;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const registerUser = async (data: RegisterUser) => {
  try {
    const formData = {
      ...data,
    };

    const response = await fetch(`/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

type UserQueryKey = [string, number, { role?: string; getTeams?: boolean }?];

const getUsersByGroupId = async ({
  queryKey,
}: QueryFunctionContext<UserQueryKey>) => {
  const [, groupId, params] = queryKey;
  const url = new URL(`/api/users/group/${groupId}`, window.location.origin);

  if (params?.role) {
    url.searchParams.append("role", params.role);
  }

  if (params?.getTeams) {
    url.searchParams.append("getTeams", params.getTeams.toString());
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const addUser = async (data: AddUserData): Promise<UserResponse> => {
  try {
    const response = await fetch(`/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.formData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

const updateUser = async (data: UpdateUserData): Promise<UserResponse> => {
  try {
    const response = await fetch(`/api/users/${data.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.formData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const deleteUser = async (data: DeleteUserData): Promise<void> => {
  try {
    const response = await fetch(`/api/users/${data.id}`, {
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
    console.error("Error deleting user:", error);
    throw error;
  }
};

const fetchUser = async (email: string, token: string) => {
  try {
    // Encode the email to ensure it's safe for use in a URL
    const response = await fetch(
      `/api/users?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export {
  updateUsersLanguages,
  registerUser,
  getUsersByGroupId,
  deleteUser,
  updateUser,
  addUser,
  fetchUser,
};
