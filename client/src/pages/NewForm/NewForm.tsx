import DraggableButton from "../../components/DragAndDropComponents/DraggableButton/DraggableButton";
import Page from "../../components/Page/Page";
import { useEffect, useRef, useState } from "react";
import DNDCanvas from "../../components/DragAndDropComponents/DNDCanvas/DNDCanvas";
import styles from "./NewForm.module.css";
import { DNDCanvasRef, DroppedItem, NewFormSections } from "./types";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import FormResponses from "../../components/FormResponses/FormResponses";
import { toSnakeCase } from "../../utils/toSnakeCase";
import { createMongoForm, updateForm } from "../../api/forms/service";
import { User } from "../../api/users/types";
import { Field, FieldType, Form } from "../../api/forms/types";
import Cookies from "js-cookie";
import { fetchUser } from "../../api/users/service";
import BlueCheckMarkIcon from "../../assets/Icons/BlueCheckMarkIcon";
import { Text } from "@radix-ui/themes";
import Modal from "../../components/Modal/Modal";
import { useGetFormByDocumentId } from "../../api/forms/query";
import { AnswerRecordMap } from "../../components/FormResponses/types";
import { exportToCsv } from "../../components/FormResponses/helpers";
import { formatCurrency } from "../../utils/formatCurrency";

interface CreateFormConfirmationModalProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

// TODO: Refactor how we display responses, right now this is tailored to registration form template
const formatFormResponses = (formResponses: AnswerRecordMap) => {
  const formattedResponses = [];

  // TODO: Refactor this to be more dynamic and update FormResponseModal.tsx
  for (const response of formResponses) {
    const formattedResponse: Record<string, string> = {};
    for (const key of Object.keys(response)) {
      console.log(key);
      const answer = response[key];
      switch (key) {
        case "age":
        case "first_name":
        case "last_name":
        case "signature":
        case "team_name":
          formattedResponse[key] = answer.short_text ?? "";
          break;
        case "address":
          formattedResponse[key] = answer.long_text ?? "";
          break;
        case "date":
          formattedResponse[key] = answer.date ?? "";
          break;
        case "email":
          formattedResponse[key] = answer.email ?? "";
          break;
        case "phone_number":
          formattedResponse[key] = answer.phone_number ?? "";
          break;
        case "photo":
          formattedResponse[key] = answer.photo ?? "";
          break;
        case "liability":
          formattedResponse[key] = answer.liability ? "Yes" : "No";
          break;
        case "payment":
          formattedResponse[key] =
            answer.payment_type && answer.amount
              ? `${answer.payment_type} - $${formatCurrency([answer.amount])[0]}`
              : "no payment data";
          break;
        case "player": {
          const { player } = answer;
          formattedResponse["league"] = player?.league_name ?? "";
          formattedResponse["season"] = player?.season_name ?? "";
          formattedResponse["division"] = player?.division_name ?? "";
          formattedResponse["team"] = player?.team_name ?? "";
          break;
        }
        default:
          formattedResponse[key] = "";
      }
    }
    formattedResponses.push(formattedResponse);
  }
  return formattedResponses;
};

const CreateFormConfirmationModal: React.FC<
  CreateFormConfirmationModalProps
> = ({ openModal, setOpenModal }) => {
  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Content>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
            height: "100%",
          }}
        >
          <BlueCheckMarkIcon />
          <Text style={{ fontWeight: "bold" }}>Completed </Text>
          <Text>You have successfully created a new form.</Text>
        </div>
      </Modal.Content>
    </Modal>
  );
};

const NewForm = () => {
  const { t } = useTranslation("NewForms");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<NewFormSections>(
    location.state?.activeSection ?? "questions",
  );
  const [fields, setFields] = useState<Field[]>(location.state?.fields ?? []);
  const [openModal, setOpenModal] = useState(false);
  const [formId, setFormId] = useState<string | undefined>(
    (location.state?.id as string) ?? undefined,
  );
  const defaultItems = fields
    ? fields.map((field) => ({
        id: field.ref,
        type: toSnakeCase(field.type) as FieldType,
      }))
    : [];
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>(defaultItems);
  const [description, setDescription] = useState(
    location.state?.description ?? "",
  );
  const [title, setTitle] = useState(
    location.state?.title ?? t("formTitlePlaceHolder"),
  );
  const canvasRef = useRef<DNDCanvasRef>(null);
  const { getAccessTokenSilently } = useAuth0();
  let currentUser: User;
  const [formResponses, setFormResponses] = useState<AnswerRecordMap>([]);

  const populateResponses = (responses: AnswerRecordMap) => {
    setFormResponses(responses);
  };

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const email = Cookies.get("email") || "";
      currentUser = await fetchUser(email, token);
    })();
  }, []);

  const draggableButtons = [
    "Short Text",
    "Long Text",
    "Multiple Choice",
    "Email",
    "Phone Number",
    "Player",
    "Photo",
    "Liability",
    "Signature",
    "Date",
    "Payment",
  ];
  const { data: formData } = useGetFormByDocumentId(formId ?? "");

  const handleDrop = (label: FieldType) => {
    if (formData.form_type === 1) {
      alert("You cannot add a field to a templated registration form");
      return;
    }
    const uniqueId = uuidv4();
    const newItem: DroppedItem = {
      id: uniqueId,
      type: toSnakeCase(label) as FieldType,
    };
    setDroppedItems([...droppedItems, newItem]);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleDelete = (name: string) => {
    setDroppedItems(droppedItems.filter((item) => item.id !== name));
  };

  const handleCopy = (index: number, copiedItem: DroppedItem) => {
    const updatedItems = [...droppedItems];
    updatedItems.splice(index + 1, 0, copiedItem);
    setDroppedItems(updatedItems);
  };

  const handleSubmit = () => {
    if (canvasRef.current) {
      canvasRef.current.submitForm();
    }
  };

  const onCreate = async (data: Form) => {
    const token = await getAccessTokenSilently();
    const email = Cookies.get("email") || "";
    currentUser = await fetchUser(email, token);

    const response = await createMongoForm(
      data,
      title,
      description,
      currentUser?.group_id,
      currentUser?.id,
      "blank",
    );
    setFormId(response._id);
    setFields(response.form_data.fields);
    setOpenModal(true);
  };

  // TODO: save by mongo form ID
  const onSave = async (data: Form) => {
    if (formId == null) {
      throw new Error("Form ID is undefined");
    }
    const response = await updateForm(
      data,
      formId,
      title,
      description,
      currentUser,
    );
    setFields(response.fields);
  };

  // TODO: Implement server side csv download
  const onDownloadResponses = async () => {
    await exportToCsv(`${title}_responses`, formatFormResponses(formResponses));
  };

  return (
    <Page
      title={formId == null ? t("pageTitleNew") : t("pageTitleEdit")}
      className={styles.newFormPage}
    >
      <div className={styles.newFormHeader}>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            {t("backButton")}
          </button>
          {activeSection === "questions" && (
            <button
              type="button"
              onClick={handleSubmit}
              className={styles.submitButton}
            >
              {formId == null ? t("createButton") : t("saveButton")}
            </button>
          )}
          {activeSection === "responses" && formResponses.length > 0 && (
            <button
              type="button"
              onClick={onDownloadResponses}
              className={styles.submitButton}
            >
              {t("download")}
            </button>
          )}
        </div>
      </div>
      <ul className={styles.formNav}>
        <li
          className={
            activeSection === "questions"
              ? styles.activeSection
              : styles.questionsNav
          }
          onClick={() => setActiveSection("questions")}
        >
          {t("formNavOptions.questions")}
        </li>
        {formId != null && (
          <li
            className={
              activeSection === "responses"
                ? styles.activeSection
                : styles.responsesNav
            }
            onClick={() => setActiveSection("responses")}
          >
            {t("formNavOptions.responses")}
          </li>
        )}
      </ul>
      {activeSection === "questions" && (
        <div className={styles.newFormContainer}>
          <div className={styles.formElementsContainer}>
            <h2 className={styles.subtitle}>{t("formElements")}</h2>
            <hr />
            <p className={`${styles.smallText} ${styles.textElementsText}`}>
              {t("textElements")}
            </p>

            <div className={styles.draggableButtonContainer}>
              {draggableButtons.map((label, index) => (
                <DraggableButton
                  key={index}
                  label={label}
                  onDrop={() => handleDrop(label as FieldType)}
                />
              ))}
            </div>
          </div>

          <div className={styles.formCanvasContainer}>
            <div className={styles.formTitleContainer}>
              <input
                className={styles.formTitle}
                placeholder="Form Title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <input
                className={styles.formDescription}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("descriptionPlaceholder")}
                value={description}
              />
            </div>
            <p className={styles.smallText} style={{ color: "#b01254" }}>
              {t("sectionText")}
            </p>

            <div className={styles.canvasStyles}>
              <DNDCanvas
                ref={canvasRef}
                formId={formId}
                importedFields={fields}
                items={droppedItems}
                handleDelete={handleDelete}
                handleCopy={handleCopy}
                saveForm={formId === null ? onCreate : onSave}
              />
            </div>
          </div>
          <CreateFormConfirmationModal
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </div>
      )}
      {formId != null && activeSection === "responses" && (
        <FormResponses
          formId={formId}
          populateResponses={(responses) => populateResponses(responses)}
        />
      )}
    </Page>
  );
};

export default NewForm;
