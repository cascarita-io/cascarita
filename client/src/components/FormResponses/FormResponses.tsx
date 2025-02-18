import { useEffect, useState } from "react";
import styles from "./FormResponses.module.css";
import { AnswerRecordMap, FormResponse, FormResponsesProps } from "./types";
import {
  getMongoFormById,
  getMongoFormResponses,
} from "../../api/forms/service";
// import { truncateText } from "../../utils/truncateText";
import { useTranslation } from "react-i18next";
import { Answer, Field } from "../../api/forms/types";
import StatusLabel from "../StatusLabel/StatusLabel";
import DashboardTable from "../DashboardTable/DashboardTable";
// import { set } from "react-hook-form";
import DropdownMenuButton from "../DropdownMenuButton/DropdownMenuButton";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import Modal from "../Modal/Modal";

const StatusButton = (status: "approved" | "rejected" | "pending") => {
  return <StatusLabel status={status}>{status}</StatusLabel>;
};

const FormResponses = ({ formId }: FormResponsesProps) => {
  const [formType, setFormType] = useState(0);
  const [formFields, setFormFields] = useState<Field[]>([]);
  const [createdAt, setCreatedAt] = useState<string[]>([]);
  const [createdBy, setCreatedBy] = useState<string[]>([]);
  const [email, setEmail] = useState<string[]>([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [status, setStatus] = useState<("approved" | "rejected" | "pending")[]>(
    []
  );
  const [formResponsesMap, setFormResponsesMap] = useState<AnswerRecordMap>(
    new Map()
  );
  const { t } = useTranslation("FormResponses");

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    (async () => {
      const formData = await getMongoFormById(formId);
      console.log("formData: ", formData);
      // setEmail(formData.created_by.email);
      // setCreatedAt(formatDate(formData.createdAt));
      // setCreatedBy(
      //   `${formData.created_by.first_name} ${formData.created_by.last_name}`
      // );
      setFormType(formData.form_type);
      setFormFields(formData.form_data.fields);
      console.log(formFields);
      const responsesData = await getMongoFormResponses(formData._id);
      console.log("responsesData", responsesData);
      const responsesMap = responsesData.reduce(
        (result: AnswerRecordMap, res: FormResponse) => {
          const answersMap: Map<string, Answer> = new Map();
          res.response.answers?.forEach((answer: Answer) => {
            answersMap.set(answer.field.id, answer);
          });

          const responseId = res._id;
          result.set(responseId, answersMap);
          return result;
        },
        new Map()
      );

      setFormResponsesMap(responsesMap);
      // TODO: add logic to get current status
      setStatus(responsesData.map(() => "pending"));
      setCreatedAt(
        responsesData.map((res: FormResponse) => formatDate(res.createdAt))
      );
      // TODO: MAKE SURE TO GET THE STATUS
      setCreatedBy(responsesData.map(() => "test"));
      setEmail(responsesData.map(() => "test@test.com"));
    })();
  }, [formId]);

  // const formatAnswer = (answer: Answer) => {
  //   const typeFormatters: Record<string, () => string | JSX.Element> = {
  //     short_text: () => answer.short_text ?? "",
  //     long_text: () => answer.long_text ?? "",
  //     number: () => String(answer.number ?? ""),
  //     email: () => answer.email ?? "",
  //     phone_number: () => answer.phone_number ?? "",
  //     choice: () => answer.choice?.label ?? "",
  //     choices: () => answer.choices?.labels.join(", ") ?? "",
  //     date: () =>
  //       answer.date ? new Date(answer.date).toLocaleDateString() : "",
  //     file_url: () =>
  //       answer.file_url ? <a href={answer.file_url}>{t("fileText")}</a> : "",
  //     boolean: () =>
  //       answer.boolean ? t("booleanOption.true") : t("booleanOption.false"),
  //     default: () => "",
  //   };

  //   return (typeFormatters[answer.type] ?? typeFormatters.default)();
  // };

  const handleStatusChange =
    (index: number, statusUpdate: "approved" | "rejected" | "pending") =>
    () => {
      const newStatus = [...status];
      newStatus[index] = statusUpdate;
      setStatus(newStatus);
    };

  const headers = [
    "#",
    "Name",
    "Status",
    "View Response",
    "Date Submitted",
    "Email",
  ];

  return (
    <div className={styles.container}>
      <DashboardTable
        headers={headers}
        headerColor="light"
        className={styles.table}
      >
        {Array.from(formResponsesMap.keys()).map((responseId, index) => (
          <tr key={responseId}>
            <td>{index + 1}</td>
            <td>{createdBy[index]}</td>
            {formType === 1 && (
              <td>
                {/* <button onClick={handleStatusChange(index)}>
                  <StatusLabel status="pending">pending</StatusLabel>
                </button> */}
                <DropdownMenuButton trigger={StatusButton(status[index])}>
                  <DropdownMenuButton.Item
                    onClick={handleStatusChange(index, "approved")}
                  >
                    <StatusLabel status="approved">approved</StatusLabel>
                  </DropdownMenuButton.Item>

                  <DropdownMenuButton.Separator className={styles.separator} />

                  <DropdownMenuButton.Item
                    onClick={handleStatusChange(index, "rejected")}
                  >
                    <StatusLabel status="rejected">rejected</StatusLabel>
                  </DropdownMenuButton.Item>

                  <DropdownMenuButton.Separator className={styles.separator} />

                  <DropdownMenuButton.Item
                    onClick={handleStatusChange(index, "pending")}
                  >
                    <StatusLabel status="pending">pending</StatusLabel>
                  </DropdownMenuButton.Item>
                </DropdownMenuButton>
              </td>
            )}
            <td>
              <Modal open={isViewOpen} onOpenChange={setIsViewOpen}>
                <Modal.Button asChild className={styles.modalTrigger}>
                  <PrimaryButton
                    className={styles.primaryBtn}
                    onClick={() => setIsViewOpen(true)}
                  >
                    <p className={styles.btnTextDesktop}>View</p>
                  </PrimaryButton>
                </Modal.Button>
                <Modal.Content title="test">
                  <></>
                </Modal.Content>
              </Modal>
            </td>
            <td>{createdAt[index]}</td>
            <td>{email[index]}</td>
            {/* {formFields.map((field) => (
              <td key={field.id}>
                {formResponsesMap.get(responseId)?.get(field.id)?.type &&
                  formatAnswer(
                    formResponsesMap.get(responseId)?.get(field.id) as Answer
                  )}
              </td>
            ))} */}
          </tr>
        ))}
      </DashboardTable>
      {formResponsesMap.size === 0 && (
        <div className={styles.emptyFormResponses}>
          <h2>{t("noResponsesText")}</h2>
        </div>
      )}
    </div>
  );
};

export default FormResponses;
