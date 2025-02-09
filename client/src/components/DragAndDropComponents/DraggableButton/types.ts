export type DraggableButtonKeys =
  | "draggableButtons.Short Text"
  | "draggableButtons.Long Text"
  | "draggableButtons.Dropdown"
  | "draggableButtons.Multiple Choice"
  | "draggableButtons.Email"
  | "draggableButtons.Phone Number"
  | "draggableButtons.Payment"
  | "draggableButtons.Player";

export interface DraggableButtonProps {
  label: string;
  onDrop: () => void;
}
