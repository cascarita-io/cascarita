import React from "react";
import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";

import { MinusCircleIcon } from "../../../assets/Icons";
import { PlusCircleIcon } from "../../../assets/Icons";
import DraggableSubMenu from "../DraggableSubMenu/DraggableSubMenu";
import { DraggableProps } from "../types";
import styles from "./DraggableDropdown.module.css";
import { Option } from "./types";

const DraggableDropdown: React.FC<DraggableProps> = ({
  index,
  formField,
  onDelete,
  onCopy,
}) => {
  const { t } = useTranslation("DraggableFields");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { control } = useFormContext();

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${index}.properties.choices`,
  });

  const [options, setOptions] = useState<Option[]>(fields as Option[]);

  useEffect(() => {
    setOptions(fields as Option[]);
  }, [fields]);

  const addOption = () => {
    append({
      id: `option-${fields.length + 1}`,
      ref: `option-${fields.length + 1}`,
      label: "",
    });
  };

  const removeOption = (optionIndex: number) => {
    remove(optionIndex);
  };

  const changeOptionsIndex = (label: string, optionIndex: number) => {
    const updatedOptions = [...options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      label,
    };
    setOptions(updatedOptions);
  };

  return (
    <Draggable draggableId={formField.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          onClick={handleClick}>
          <div style={{ position: "relative" }}>
            <p className={styles.textElementTypeText}>{t("dropDown")}</p>
            <div className={styles.draggableContainer}>
              {formField.validations?.required != null && (
                <div className={styles.requiredSwitch}>
                  <p className={styles.requiredText}>{t("requiredText")}</p>
                  <Controller
                    name={`fields.${index}.validations.required`}
                    control={control}
                    defaultValue={formField.validations.required}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={(checked) => field.onChange(checked)}
                        offColor="#DFE5EE"
                        onColor="#DFE5EE"
                        offHandleColor="#AAAAAA"
                        onHandleColor="#B01254"
                        handleDiameter={24}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        height={16}
                        width={44}
                      />
                    )}
                  />
                </div>
              )}
              <Controller
                key={index}
                name={`fields.${index}.title`}
                control={control}
                defaultValue={formField.title}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      placeholder={t("questionPlaceholder")}
                      className={styles.question}
                    />
                    <hr />
                  </>
                )}
              />
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 10,
                  }}>
                  <Controller
                    key={index}
                    name={`fields.${index}.properties.choices.${idx}.label`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e); // Ensure the field value is updated in react-hook-form
                          changeOptionsIndex(e.target.value, idx); // Update the selectOptions state
                        }}
                        placeholder={`Option ${idx + 1}`}
                        style={{
                          marginLeft: -5,
                          marginRight: -5,
                          paddingLeft: 5,
                          paddingRight: 5,
                        }}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    style={{ marginLeft: "8px" }}>
                    <MinusCircleIcon width={20} height={20} color={"#FF0000"} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                style={{
                  display: "flex",
                  marginTop: 10,
                }}>
                <PlusCircleIcon width={20} height={20} color={"#4171ED"} />
              </button>
              {isMenuOpen && (
                <DraggableSubMenu
                  onDelete={onDelete}
                  onCopy={onCopy}
                  onClose={handleClick}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableDropdown;
