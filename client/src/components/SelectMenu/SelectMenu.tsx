import React from "react";

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";

import styles from "./SelectMenu.module.css";

interface SelectMenuProps {
  defaultValue?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  placeholder?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const SelectMenu: React.FC<SelectMenuProps> & {
  Button: typeof Select.Trigger;
  Group: typeof Select.Group;
  GroupLabel: typeof Select.Label;
  Separator: typeof Select.Separator;
  Item: React.FC<SelectItemProps>;
} = ({
  defaultValue,
  defaultOpen,
  open,
  onOpenChange,
  value,
  name,
  onValueChange,
  placeholder,
  children,
  required,
  className = "",
  ...delegated
}) => {
  const triggerClassName = `${styles.selectTrigger} ${className}`;

  return (
    <Select.Root
      {...delegated}
      defaultValue={defaultValue}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      value={value}
      name={name}
      onValueChange={onValueChange}
      required={required ?? false}>
      <Select.Trigger className={triggerClassName}>
        <Select.Value
          placeholder={placeholder ? placeholder : "Select a value"}
        />

        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className={styles.selectContent}>
          <Select.ScrollUpButton className={styles.selectScrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>

          <Select.Viewport className={styles.selectViewport}>
            {children}
          </Select.Viewport>

          <Select.ScrollDownButton className={styles.selectScrollButton}>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem: React.FC<SelectItemProps> = ({
  value,
  children,
  disabled,
  className,
}) => {
  const selectItemClassName = `${styles.selectItem} ${className}`;
  return (
    <Select.Item
      className={selectItemClassName}
      value={value}
      disabled={disabled}>
      <Select.ItemText>{children}</Select.ItemText>

      <Select.ItemIndicator>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
};

SelectMenu.Button = Select.Trigger;
SelectMenu.Group = Select.Group;
SelectMenu.GroupLabel = Select.Label;
SelectMenu.Separator = Select.Separator;
SelectMenu.Item = SelectItem;
export default SelectMenu;
