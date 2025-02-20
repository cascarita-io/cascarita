import { useEffect, useState } from "react";
import styles from "./FormResponses.module.css";
import { AnswerRecordMap, FormResponse, FormResponsesProps } from "./types";
import {
  getMongoFormById,
  getMongoFormResponses,
} from "../../api/forms/service";
// import { truncateText } from "../../utils/truncateText";
import { useTranslation } from "react-i18next";
import { Answer } from "../../api/forms/types";
import StatusLabel from "../StatusLabel/StatusLabel";
import DashboardTable from "../DashboardTable/DashboardTable";
// import { set } from "react-hook-form";
import DropdownMenuButton from "../DropdownMenuButton/DropdownMenuButton";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import Modal from "../Modal/Modal";
import FormResponseForm from "../Forms/FormResponseModal/FormResponseModal";

const StatusButton = (status: "approved" | "rejected" | "pending") => {
  return <StatusLabel status={status}>{status}</StatusLabel>;
};

const FormResponses = ({ formId }: FormResponsesProps) => {
  const [formType, setFormType] = useState(0);
  const [user, setUser] = useState<string[]>([]);
  const [submittedAt, setSubmittedAt] = useState<string[]>([]);
  // const [createdBy, setCreatedBy] = useState<string[]>([]);
  const [email, setEmail] = useState<string[]>([]);
  const [isViewOpen, setIsViewOpen] = useState<{ [key: number]: boolean }>({});
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
      setFormType(formData.form_type);
      const responsesData = await getMongoFormResponses(formData._id);
      responsesData.map((response: FormResponse) => {
        setSubmittedAt((prev) => [...prev, response.createdAt]);
      });
      const responsesMap = responsesData.reduce(
        (result: AnswerRecordMap, res: FormResponse) => {
          const answersMap: Map<string, Answer> = new Map();
          res.response.answers?.forEach((answer: Answer) => {
            if (answer.secondary_type) {
              answersMap.set(answer.secondary_type, answer);
            } else {
              answersMap.set(answer.type, answer);
            }
          });

          const responseId = res._id;
          result.set(responseId, answersMap);
          return result;
        },
        new Map()
      );

      setFormResponsesMap(responsesMap);

      const emailData: string[] = [];
      const userData: string[] = [];

      responsesMap.forEach((answersMap: Map<string, Answer>) => {
        let email = "N/A";
        let firstName = "";
        let lastName = "";

        answersMap.forEach((answer, key) => {
          if (key === "email") {
            email = answer.email ?? "N/A";
          }
          if (key === "first_name") {
            firstName = answer.short_text ?? "";
          }
          if (key === "last_name") {
            lastName = answer.short_text ?? "";
          }
        });

        emailData.push(email);
        userData.push(`${firstName} ${lastName}`);
      });

      setEmail(emailData);
      setUser(userData);
      // TODO: determine status setup
      setStatus(responsesData.map(() => "pending"));
    })();
  }, [formId]);

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
            <td>{user[index]}</td>
            {formType === 1 && (
              <td>
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
              <Modal
                open={isViewOpen[index] || false}
                onOpenChange={(open) =>
                  setIsViewOpen((prev) => ({ ...prev, [index]: open }))
                }
              >
                <Modal.Button asChild className={styles.modalTrigger}>
                  <PrimaryButton
                    className={styles.primaryBtn}
                    onClick={() =>
                      setIsViewOpen((prev) => ({ ...prev, [index]: true }))
                    }
                  >
                    <p className={styles.btnTextDesktop}>View</p>
                  </PrimaryButton>
                </Modal.Button>
                <Modal.Content maximize={true} title={user[index]}>
                  <FormResponseForm
                    answers={formResponsesMap.get(responseId)}
                  />
                </Modal.Content>
              </Modal>
            </td>
            <td>{formatDate(submittedAt[index])}</td>
            <td>{email[index]}</td>
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
