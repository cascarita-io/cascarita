interface DropdownMenuButtonProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  children?: React.ReactNode;
}

interface DropdownMenuItemProps {
  asChild: React.ReactNode;
}

export type { DropdownMenuButtonProps, DropdownMenuItemProps };
