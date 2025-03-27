import React from "react";

import * as RadioGroup from "@radix-ui/react-radio-group";

import styles from "./RadioSelect.module.css";

interface RadioSelectProps {
  children: React.ReactNode;
  groupName: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

interface RadioSelectItemProp {
  value: string;
  id: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const RadioSelect: React.FC<RadioSelectProps> & {
  Item: React.FC<RadioSelectItemProp>;
  Indicator: typeof RadioGroup.Indicator;
} = ({
  children,
  value,
  defaultValue,
  groupName,
  onValueChange,
  required = false,
  disabled = false,
  className = "",
}) => {
  const radioSelectClassName = `${styles.radioGroupRoot} ${className}`;

  return (
    <RadioGroup.Root
      name={groupName}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      required={required}
      disabled={disabled}
      className={radioSelectClassName}>
      {children}
    </RadioGroup.Root>
  );
};

const RadioItem: React.FC<RadioSelectItemProp> = ({
  value,
  id,
  required = false,
  disabled = false,
}) => {
  return (
    <RadioGroup.Item
      value={value}
      id={id}
      required={required}
      disabled={disabled}
      className={styles.radioGroupItem}>
      <RadioGroup.Indicator className={styles.radioGroupIndicator} />
    </RadioGroup.Item>
  );
};

RadioSelect.Item = RadioItem;
RadioSelect.Indicator = RadioGroup.Indicator;
export default RadioSelect;
