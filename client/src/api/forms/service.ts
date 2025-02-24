import { Answer, Form, GetFormsParams } from "./types";

import { User } from "../users/types";

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

export const deleteForm = async (id: string) => {
  try {
    const response = await fetch(`/api/forms/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete form");
    }
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

export const getMongoForms = async (groupId: number) => {
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

export const getMongoFormById = async (formId: string) => {
  try {
    const response = await fetch(`/api/forms/${formId}`);

    if (!response.ok) {
      throw new Error(`Error fetching form: ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    console.error("Error fetching form:", err);
    throw err;
  }
};

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

export const sendEmail = async (formLink: string, email: string) => {
  try {
    const data = {
      formLink: formLink,
      email: email,
    };
    const response = await fetch(`/api/forms/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error emailing form: ${response.statusText}`);
    }
    return response.json();
  } catch (err) {
    console.error("Error emailing responses:", err);
    throw err;
  }
};

export const getFormPaymentsByPaymentIntentId = async (
  paymentIntentId: string
) => {
  try {
    const data = {
      payment_intent_id: paymentIntentId,
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
    };
    // TODO: Saul to use these in BE
    console.log("email: ", email);
    console.log("response: ", answers);
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
