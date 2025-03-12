import { Field, Form } from "../../../api/forms/types";
import { DroppedItem } from "../../../pages/NewForm/types";

export interface DNDCanvasProps {
  items: DroppedItem[];
  formId: string | undefined;
  importedFields?: Field[];
  handleDelete: (name: string) => void;
  handleCopy: (index: number, copiedItem: DroppedItem) => void;
  saveForm: (data: Form) => void;
}
