import React, { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Draggable } from "react-beautiful-dnd";
import styles from "./DraggableLongText.module.css";
import DraggableSubMenu from "../DraggableSubMenu/DraggableSubMenu";
import Switch from "react-switch";
import { useTranslation } from "react-i18next";
import { SMALL_DRAGGABLE_CONTAINER_WIDTH } from "../constants";
import { DraggableProps } from "../types";

const DraggableLongText: React.FC<DraggableProps> = ({
  index,
  formField,
  onDelete,
  onCopy,
}) => {
  const { t } = useTranslation("DraggableFields");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContainerWidthMaxed, setIsContainerWidthMaxed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const { control } = useFormContext();

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setIsContainerWidthMaxed(
          containerRef.current.offsetWidth < SMALL_DRAGGABLE_CONTAINER_WIDTH
        );
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
          onClick={handleClick}
        >
          <div style={{ position: "relative" }} ref={containerRef}>
            <p className={styles.textElementTypeText}>{t("longText")}</p>
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
                defaultValue={formField.title} // Ensure the default value is set
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      placeholder={t("questionPlaceholder")}
                      className={styles.question}
                    />
                    {formField.validations?.max_length != null && (
                      <>
                        <p className={styles.requiredText}>
                          {t("maxCharacters")}
                        </p>
                        <Controller
                          name={`fields.${index}.validations.max_length`}
                          control={control}
                          defaultValue={formField.validations.max_length}
                          render={({ field }) => (
                            <>
                              <input
                                {...field}
                                type="number"
                                min={0}
                                max={10000}
                                placeholder={"0 - 10,000"}
                                className={styles.requiredText}
                              />
                              <hr />
                            </>
                          )}
                        />
                      </>
                    )}
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

export default DraggableLongText;
