export type DraggableButtonKeys =
  | "draggableButtons.Short Text"
  | "draggableButtons.Long Text"
  | "draggableButtons.Dropdown"
  | "draggableButtons.Multiple Choice"
  | "draggableButtons.Email"
  | "draggableButtons.Phone Number"
  | "draggableButtons.Payment"
  | "draggableButtons.Player"
  | "draggableButtons.Liability"
  | "draggableButtons.Date"
  | "draggableButtons.Signature";

export interface DraggableButtonProps {
  label: string;
  onDrop: () => void;
}
