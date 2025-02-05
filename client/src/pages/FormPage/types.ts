import { Field } from "../../api/forms/types";
import Dropdown from "../../components/FormInputComponents/Dropdown/Dropdown";
import Email from "../../components/FormInputComponents/Email/Email";
import LongText from "../../components/FormInputComponents/LongText/LongText";
import MultipleChoice from "../../components/FormInputComponents/MultipleChoice/MultipleChoice";
import PhoneNumber from "../../components/FormInputComponents/PhoneNumber/PhoneNumber";
import ShortText from "../../components/FormInputComponents/ShortText/ShortText";
import StripeComponent from "../../components/FormInputComponents/Stripe/StripeComponent";

export interface WelcomeScreen {
  id: string;
  ref: string;
  title: string;
  properties: {
    show_button: boolean;
    button_text: string;
    description: string;
  };
}

export interface FetchedForm {
  _id: string;
  created_by: {
    id: string;
    first_name: string;
    last_name: string;
  };
  updated_by: {
    id: string;
    first_name: string;
    last_name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  form_data: {
    id: string;
    title: string;
    _links: {
      display: string;
      responses: string;
    };
    fields: Field[];
  };
  welcome_screen: WelcomeScreen;
  sql_form_id: string;
}

export const FieldComponents = {
  multiple_choice: MultipleChoice,
  short_text: ShortText,
  dropdown: Dropdown,
  long_text: LongText,
  email: Email,
  phone_number: PhoneNumber,
  payment: StripeComponent,
};

// TODO: more appropriate mapping for data normalization
export const AnswerMap = {
  multiple_choice: "choice",
  short_text: "short_text",
  dropdown: "text",
  long_text: "long_text",
  email: "email",
  phone_number: "phone_number",
  payment: "payment",
};
