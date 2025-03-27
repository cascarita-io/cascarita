import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";

import { PlusCircleIcon } from "../../../assets/Icons";
import { MinusCircleIcon } from "../../../assets/Icons";
import { EllipseIcon } from "../../../assets/Icons";
import DraggableSubMenu from "../DraggableSubMenu/DraggableSubMenu";
import { DraggableProps } from "../types";
import styles from "./DraggableMultipleChoice.module.css";

const DraggableMultipleChoice: React.FC<DraggableProps> = ({
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
            <p className={styles.textElementTypeText}>{t("multipleChoice")}</p>
            <div className={styles.draggableContainer}>
              <div className={styles.switches}>
                {formField.validations?.required != null && (
                  <>
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
                  </>
                )}
                {formField.properties?.allow_multiple_selection != null && (
                  <>
                    <p className={styles.requiredText}>
                      {t("multipleSelection")}
                    </p>
                    <Controller
                      name={`fields.${index}.properties.allow_multiple_selection`}
                      control={control}
                      defaultValue={
                        formField.properties.allow_multiple_selection
                      }
                      render={({ field }) => (
                        <Switch
                          checked={field.value == null ? false : field.value}
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
                  </>
                )}
              </div>
              <Controller
                name={`fields.${index}.title`}
                control={control}
                defaultValue={formField.title} // Ensure the default value is set
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
                  <EllipseIcon
                    width={15}
                    height={15}
                    color={"#AAAAAA"}
                    fill={"white"}
                  />
                  <Controller
                    key={index}
                    name={`fields.${index}.properties.choices.${idx}.label`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
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
                  <button type="button" onClick={() => removeOption(idx)}>
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

export default DraggableMultipleChoice;
