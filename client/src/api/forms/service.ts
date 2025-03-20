import { Answer, Form, GetFormsParams, FormResponse } from "./types";

import { User } from "../users/types";
import { QueryFunctionContext } from "@tanstack/react-query";

// TODO: Implement a paginated API to call this for our forms
// This will include filters, query, and sorting
export const getTypeformForms = async ({
  page = 1,
  page_size = 10,
  search,
  workspace_id,
  sort_by,
  order_by,
}: GetFormsParams = {}) => {
  try {
    const params = {
      page: page.toString(),
      page_size: page_size.toString(),
      ...(search && { search }),
      ...(workspace_id && { workspace_id }),
      ...(sort_by && { sort_by }),
      ...(order_by && { order_by }),
    };

    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`/api/surveys?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Error fetching forms: ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    console.error("Error fetching forms:", err);
    throw err;
  }
};

export const updateForm = async (
  data: Form,
  formId: string,
  title: string,
  description: string,
  user: User | null
) => {
  const formData = {
    form_data: {
      title,
      ...data,
    },
    form_blueprint: {
      title,
      welcome_screens: [
        {
          title,
          properties: {
            description,
          },
        },
      ],
      ...data,
    },
    updated_by: {
      id: user?.id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
    },
  };

  try {
    const response = await fetch(`/api/forms/${formId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to update form");
    }

    return response.json();
  } catch (err) {
    console.error("Error updating form:", err);
    throw err;
  }
};

export const deleteForm = async (id: string): Promise<FormResponse> => {
  try {
    const response = await fetch(`/api/forms/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete form");
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (err) {
    console.error("Error deleting form:", err);
    throw err;
  }
};

export const createMongoForm = async (
  data: Form,
  title: string,
  description: string,
  groupId: number | undefined,
  userId: number | undefined,
  template: string
) => {
  const formData = {
    title,
    template,
    welcome_screens: [
      {
        title,
        properties: {
          description,
        },
      },
    ],
    ...data,
  };
  try {
    const response = await fetch(`/api/forms/${groupId}/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    console.error("Error creating form:", err);
    throw err;
  }
};

export const getMongoFormById = async (formId: string) => {
  try {
    const response = await fetch(`/api/forms/document/${formId}`);

    if (!response.ok) {
      throw new Error(`Error fetching form: ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    console.error("Error fetching form:", err);
    throw err;
  }
};

// THIS GETS the responses from mongodb:
export const getMongoFormResponses = async (formId: string) => {
  try {
    const response = await fetch(`/api/forms/${formId}/responses`);

    if (!response.ok) {
      throw new Error(`Error fetching form responses: ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    console.error("Error fetching responses:", err);
    throw err;
  }
};

export const createMongoResponse = async (
  formId: string,
  answer: (string | number | Answer)[]
) => {
  const data = {
    form_id: formId,
    data: answer,
  };

  try {
    const response = await fetch("/api/forms/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    console.error("Error creating response:", err);
    throw err;
  }
};

export const sendEmail = async (emails: string[], formLink: string) => {
  try {
    const data = {
      emails: emails,
      link: formLink,
    };
    const response = await fetch(`/api/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "An unexpected error occurred" };
    }

    return { success: true };
  } catch (err) {
    console.error("Error emailing responses:", err);
    throw err;
  }
};

export const sendApprovalEmail = async (
  emails: string[],
  leagueName: string,
  seasonName: string,
  playerName: string,
  paymentAmount: number,
  paymentDate: string,
  transactionId: string
) => {
  try {
    const data = {
      emails: emails,
      league_name: leagueName,
      season_name: seasonName,
      player_name: playerName,
      payment_amount: paymentAmount,
      payment_date: paymentDate,
      transaction_id: transactionId,
    };
    const response = await fetch(`/api/email/approval/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error emailing form: ${response.statusText}`);
    }
    // return response.json();
  } catch (err) {
    console.error("Error emailing responses:", err);
    throw err;
  }
};

export const sendRejectionEmail = async (
  emails: string[],
  leagueName: string,
  seasonName: string,
  playerName: string,
  paymentAmount: number
) => {
  try {
    const data = {
      emails: emails,
      league_name: leagueName,
      season_name: seasonName,
      player_name: playerName,
      payment_amount: paymentAmount,
    };
    const response = await fetch(`/api/email/rejection/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error emailing form: ${response.statusText}`);
    }
    // return response.json();
  } catch (err) {
    console.error("Error emailing responses:", err);
    throw err;
  }
};

// This is fetching the form payments info:
export const getFormPayments = async (formId: string) => {
  try {
    const data = {
      form_id: formId,
    };
    const response = await fetch(`/api/forms/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error fetching payment intents: ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    console.error("Error fetching payment intents:", err);
    throw err;
  }
};

export const updateFormPaymentStatus = async (
  paymentIntentId: string,
  status: string,
  email: string,
  answers: Record<string, Answer>
) => {
  try {
    const data = {
      payment_intent_id: paymentIntentId,
      status: status,
      email: email,
      answers: answers,
    };

    const response = await fetch(`/api/forms/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error fetching payment intents: ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    console.error("Error fetching payment intents:", err);
    throw err;
  }
};

export const updateFormPaymentType = async (
  paymentIntentId: string,
  paymentType: number
) => {
  try {
    const data = {
      payment_intent_id: paymentIntentId,
      payment_method_id: paymentType,
    };
    const response = await fetch(`/api/forms/paymenttype`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error fetching payment intents: ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    console.error("Error fetching payment intents:", err);
    throw err;
  }
};

type FormQueryKey = [string, string];

export const getFormByDocumentId = async ({
  queryKey,
}: QueryFunctionContext<FormQueryKey>) => {
  const [, documentId] = queryKey;
  try {
    const response = await fetch(`/api/forms/document/${documentId}`);

    if (!response.ok) {
      throw new Error(`Error fetching form: ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    console.error("Error fetching form:", err);
    throw err;
  }
};

type MongoFormQueryKey = [string, number];

export const getMongoForms = async ({
  queryKey,
}: QueryFunctionContext<MongoFormQueryKey>) => {
  const [, groupId] = queryKey;
  try {
    const response = await fetch(`/api/groups/${groupId}/forms`);

    if (!response.ok) {
      throw new Error(`Error fetching forms: ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    console.error("Error fetching forms:", err);
    throw err;
  }
};
