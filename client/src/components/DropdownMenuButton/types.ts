interface DropdownMenuButtonProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
}

interface DropdownMenuItemProps {
  asChild: React.ReactNode;
}

export type { DropdownMenuButtonProps, DropdownMenuItemProps };
