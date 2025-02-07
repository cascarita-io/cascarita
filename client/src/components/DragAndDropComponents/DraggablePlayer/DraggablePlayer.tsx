import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import styles from "./DraggablePlayer.module.css";
import DraggableSubMenu from "../DraggableSubMenu/DraggableSubMenu";
import Switch from "react-switch";
// import { useTranslation } from "react-i18next";
import { DraggableProps } from "../types";

const DraggablePlayer: React.FC<DraggableProps> = ({
  index,
  formField,
  onDelete,
  onCopy,
}) => {
  //   const { t } = useTranslation("DraggableFields");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { control } = useFormContext();

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${index}.properties.choices`,
  });

  useEffect(() => {}, [fields]);

  return (
    <Draggable draggableId={formField.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          onClick={handleClick}
        >
          <div style={{ position: "relative" }}>
            <p className={styles.textElementTypeText}>Player</p>
            <div className={styles.draggableContainer}>
              {formField.validations?.required != null && (
                <div className={styles.requiredSwitch}>
                  <p className={styles.requiredText}>Required</p>
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
              <div className={styles.playerContainer}>
                <p className={styles.title}>Player</p>
                <Controller
                  key={index}
                  name={`fields.${index}.title`}
                  control={control}
                  defaultValue={formField.title}
                  render={({ field }) => (
                    <>
                      <div className={styles.playerContainerItem}>
                        <p className={styles.subtitle}>League: </p>
                        <Controller
                          name={`fields.${index}.league`}
                          control={control}
                          render={({ field }) => (
                            <select {...field}>
                              <option value="">League 1</option>
                              <option value="">League 2</option>
                              {/* Add league options here */}
                            </select>
                          )}
                        />
                      </div>
                      <div className={styles.playerContainerItem}>
                        <p className={styles.subtitle}>Season: </p>
                        <Controller
                          name={`fields.${index}.season`}
                          control={control}
                          render={({ field }) => (
                            <select {...field}>
                              <option value="">Season 1</option>
                              <option value="">Season 2</option>
                              {/* Add season options here */}
                            </select>
                          )}
                        />
                      </div>
                      <Controller
                        name={`fields.${index}.division`}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            disabled
                            className={styles.dropdown}
                            style={{ display: "none" }}
                          >
                            <option value="">Division 1</option>
                            {/* Add division options here */}
                          </select>
                        )}
                      />
                      <Controller
                        name={`fields.${index}.team`}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            disabled
                            className={styles.dropdown}
                            style={{ display: "none" }}
                          >
                            <option value="">Team 1</option>
                            {/* Add team options here */}
                          </select>
                        )}
                      />
                    </>
                  )}
                />
              </div>
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

export default DraggablePlayer;
