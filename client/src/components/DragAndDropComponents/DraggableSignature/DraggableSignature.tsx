import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";

import DraggableSubMenu from "../DraggableSubMenu/DraggableSubMenu";
import { DraggableProps } from "../types";
import styles from "./DraggableSignature.module.css";

const DraggableSignature: React.FC<DraggableProps> = ({
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
            <p className={styles.textElementTypeText}>{t("signature")}</p>
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
              <p className={styles.question}>{formField.title}</p>
              <Controller
                key={index}
                name={`fields.${index}.properties.description`}
                control={control}
                defaultValue={formField.properties?.description}
                // Ensure the default value is set
                render={({ field }) => (
                  <>
                    <textarea
                      {...field}
                      placeholder={t("questionPlaceholder")}
                      className={styles.textArea}
                      rows={2}
                    />
                    <hr />
                  </>
                )}
              />
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

export default DraggableSignature;
