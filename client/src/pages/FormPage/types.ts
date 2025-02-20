import { Field } from "../../api/forms/types";
import Dropdown from "../../components/FormInputComponents/Dropdown/Dropdown";
import Email from "../../components/FormInputComponents/Email/Email";
import LongText from "../../components/FormInputComponents/LongText/LongText";
import MultipleChoice from "../../components/FormInputComponents/MultipleChoice/MultipleChoice";
import PhoneNumber from "../../components/FormInputComponents/PhoneNumber/PhoneNumber";
import ShortText from "../../components/FormInputComponents/ShortText/ShortText";
import PlayerBlock from "../../components/FormInputComponents/PlayerBlock/PlayerBlock";
import StripeComponent from "../../components/FormInputComponents/Stripe/StripeComponent";
import Liability from "../../components/FormInputComponents/Liability/Liability";
import Signature from "../../components/FormInputComponents/Signature/Signature";
import Date from "../../components/FormInputComponents/Date/Date";

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
  form_type: number;
}

export const FieldComponents = {
  multiple_choice: MultipleChoice,
  short_text: ShortText,
  dropdown: Dropdown,
  long_text: LongText,
  email: Email,
  phone_number: PhoneNumber,
  payment: StripeComponent,
  liability: Liability,
  signature: Signature,
  date: Date,
  player: PlayerBlock,
};

// TODO: more appropriate mapping for data normalization
export const AnswerMap = {
  multiple_choice: "choice",
  short_text: "short_text",
  dropdown: "dropdown",
  long_text: "long_text",
  liability: "liability",
  signature: "signature",
  date: "date",
  email: "email",
  phone_number: "phone_number",
  payment: "payment",
  player: "player",
};
