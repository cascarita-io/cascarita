import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import {
  DragDropContext,
  DropResult,
  DroppableProvided,
} from "react-beautiful-dnd";
import DraggablePlayer from "../DraggablePlayer/DraggablePlayer";
import DraggableMultipleChoice from "../DraggableMultipleChoice/DraggableMultipleChoice";
import DraggableShortText from "../DraggableShortText/DraggableShortText";
import DraggableDropdown from "../DraggableDropdown/DraggableDropdown";
import DraggableLongText from "../DraggableLongText/DraggableLongText";
import { DNDCanvasProps } from "./types";
import { DroppedItem } from "../../../pages/NewForm/types";
import EmptyDNDCanvas from "../EmptyDNDCanvas/EmptyDNDCanvas";
import { v4 as uuidv4 } from "uuid";
import DraggablePhoneNumber from "../DraggablePhoneNumber/DraggablePhoneNumber";
import DraggableEmail from "../DraggableEmail/DraggableEmail";
import { StrictModeDroppable } from "../../StrictModeDroppable/StrictModeDroppable";
import DraggablePayment from "../DraggablePayment/DraggablePayment";
import { Currency, Field, Form } from "../../../api/forms/types";
import DraggableLiability from "../DraggableLiability/DraggableLiability";
import DraggableSignature from "../DraggableSignature/DraggableSignature";
import DraggableDate from "../DraggableDate/DraggableDate";

const DNDCanvas = forwardRef(
  (
    {
      items,
      handleDelete,
      handleCopy,
      saveForm,
      importedFields,
    }: DNDCanvasProps,
    ref
  ) => {
    const methods = useForm<{ fields: Field[] }>({
      defaultValues: { fields: importedFields ?? [] },
    });

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        methods.handleSubmit(onSubmit)();
      },
    }));

    const componentMap = {
      multiple_choice: DraggableMultipleChoice,
      short_text: DraggableShortText,
      dropdown: DraggableDropdown,
      long_text: DraggableLongText,
      email: DraggableEmail,
      phone_number: DraggablePhoneNumber,
      player: DraggablePlayer,
      liability: DraggableLiability,
      signature: DraggableSignature,
      date: DraggableDate,
      payment: DraggablePayment,
    };

    const appendField = (item: DroppedItem) => {
      const fieldTemplate = {
        multiple_choice: {
          title: "",
          id: item.id,
          ref: item.id,
          properties: { choices: [], allow_multiple_selection: false },
          validations: { required: false },
          type: item.type,
        },
        short_text: {
          title: "",
          id: item.id,
          ref: item.id,
          validations: { max_length: 20, required: false },
          type: item.type,
        },
        dropdown: {
          title: "",
          id: item.id,
          ref: item.id,
          properties: { choices: [] },
          validations: { required: false },
          type: item.type,
        },
        long_text: {
          title: "",
          id: item.id,
          ref: item.id,
          validations: { max_length: 100, required: false },
          type: item.type,
        },
        email: {
          title: "",
          id: item.id,
          ref: item.id,
          validations: { required: false },
          type: item.type,
        },
        phone_number: {
          title: "",
          id: item.id,
          ref: item.id,
          properties: { default_country_code: "US" },
          validations: { required: false },
          type: item.type,
        },
        player: {
          title: "",
          id: item.id,
          ref: item.id,
          properties: { default_country_code: "US" },
          validations: { required: false },
          type: item.type,
        },
        liability: {
          title: "Liability Waiver, Release, And Indemnification Agreement",
          id: item.id,
          ref: item.id,
          properties: {
            description:
              "I recognize the possibility of bodily harm associated with Soccer, and I voluntarily accept and assume the risk as part of my responsibility as a player with the aforementioned association.  I hereby waive, release, and otherwise indemnify my club and team, Salinas Soccer Femenil, its sponsors, its affiliated organizations, sports facilities and their employees and associated personnel with these organizations, against any claims made by me or on my part, as a result of my participation in programs and competitions.",
          },
          validations: { required: false },
          type: item.type,
        },
        signature: {
          title: "Signature",
          id: item.id,
          ref: item.id,
          properties: {
            description:
              "By providing my e-signature below, I consent that I have read, reviewed and accept the terms contained within this registration form",
          },
          validations: { required: false },
          type: item.type,
        },
        date: {
          title: "Date",
          id: item.id,
          ref: item.id,
          validations: { required: false },
          type: item.type,
        },
        payment: {
          title: "",
          id: item.id,
          ref: item.id,
          properties: {
            price: {
              type: "fixed",
              value: "",
              feeValue: "",
              currency: Currency.USD,
              isCustomerPayingFee: false,
            },
            stripe_account: { id: "", stripe_account_id: "" },
            description: "",
          },
          validations: { required: false },
          type: item.type,
        },
      };
      append(fieldTemplate[item.type]);
    };

    const { control, handleSubmit } = methods;

    const { fields, append, move, remove, insert } = useFieldArray({
      control,
      name: "fields", // This should match the structure in useForm
    });

    useEffect(() => {
      if (items.length > 0) {
        items.forEach((item) => {
          if (!fields.some((field) => field.ref === item.id)) {
            appendField(item);
          }
        });
      }
    }, [items]);

    const onDragEnd = (result: DropResult) => {
      if (!result.destination) return;
      move(result.source.index, result.destination.index);
    };

    const onDelete = (index: number, name: string) => {
      remove(index);
      handleDelete(name);
    };

    const onCopy = (field: Field, index: number) => {
      const newRef = uuidv4();
      insert(index + 1, { ...field, ref: newRef });
      handleCopy(index, {
        id: newRef,
        type: field.type,
      });

      // Ensure the copied fields has the same fields as the original
      methods.setValue(
        `fields.${index + 1}.title`,
        methods.getValues(`fields.${index}.title`)
      );

      methods.setValue(
        `fields.${index + 1}.validations`,
        methods.getValues(`fields.${index}.validations`)
      );

      methods.setValue(
        `fields.${index + 1}.properties`,
        methods.getValues(`fields.${index}.properties`)
      );
    };

    const onSubmit = (data: Form) => {
      saveForm(data);
    };

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="canvas">
          {(provided: DroppableProvided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              // onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{
                padding: "16px",
                background: "white",
                minHeight: "400px",
              }}
            >
              {items.length === 0 ? (
                <EmptyDNDCanvas />
              ) : (
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {fields.map((field: Field, index: number) => {
                      const Component = componentMap[field.type];
                      if (!Component) return null;

                      return (
                        <Component
                          key={field.ref}
                          index={index}
                          formField={field}
                          onDelete={() => onDelete(index, field.ref)}
                          onCopy={() => onCopy(field, index)}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </form>
                </FormProvider>
              )}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    );
  }
);

DNDCanvas.displayName = "DNDCanvas";

export default DNDCanvas;
