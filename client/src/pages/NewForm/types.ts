import { FieldType } from "../../api/forms/types";

export type NewFormSections = "questions" | "responses";

export interface DroppedItem {
  id: string;
  type: FieldType;
}

export interface DNDCanvasRef {
  submitForm: () => void;
}
