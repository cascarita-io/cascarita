import { useEffect, useState } from "react";
import styles from "./FormResponses.module.css";
import Cookies from "js-cookie";
import { AnswerRecordMap, FormResponse, FormResponsesProps } from "./types";
import {
  getMongoFormById,
  getMongoFormResponses,
} from "../../api/forms/service";
import { useTranslation } from "react-i18next";
import { Answer } from "../../api/forms/types";
import StatusLabel from "../StatusLabel/StatusLabel";
import DashboardTable from "../DashboardTable/DashboardTable";
import DropdownMenuButton from "../DropdownMenuButton/DropdownMenuButton";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import Modal from "../Modal/Modal";
import FormResponseForm from "../Forms/FormResponseModal/FormResponseModal";
import {
  getFormPaymentsByPaymentIntentId,
  updateFormPaymentStatus,
} from "../../api/forms/service";

const StatusButton = (status: "approved" | "rejected" | "pending") => {
  return <StatusLabel status={status}>{status}</StatusLabel>;
};

const FormResponses = ({ formId }: FormResponsesProps) => {
  const [formType, setFormType] = useState(0);
  const [user, setUser] = useState<string[]>([]);
  const [amount, setAmount] = useState<number[]>([]);
  const [submittedAt, setSubmittedAt] = useState<string[]>([]);
  const [paymentType, setPaymentType] = useState<string[]>([]);
  const [paymentIntentIds, setPaymentIntentIds] = useState<string[]>([]);
  const [email, setEmail] = useState<string[]>([]);
  const [isViewOpen, setIsViewOpen] = useState<{ [key: number]: boolean }>({});
  const [status, setStatus] = useState<("approved" | "rejected" | "pending")[]>(
    []
  );
  const [formResponsesData, setFormResponsesData] = useState<AnswerRecordMap>(
    []
  );
  const adminEmail = Cookies.get("email") || "";
  const { t } = useTranslation("FormResponses");

  const formatDate = (dateString: string, daysAhead: number = 0): string => {
    const date = new Date(dateString);
    if (daysAhead > 0) {
      date.setDate(date.getDate() + daysAhead);
    }
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const formatMoney = (amount: number): string => {
    //formats cents to dollars
    return `$${(amount / 100).toFixed(2)}`;
  };

  useEffect(() => {
    (async () => {
      const formData = await getMongoFormById(formId);
      setFormType(formData.form_type);
      const responsesData = await getMongoFormResponses(formData._id);
      const submittedAtData: string[] = [];
      responsesData.map((response: FormResponse) => {
        submittedAtData.push(response.createdAt);
      });
      setSubmittedAt(submittedAtData);
      const responsesArray = responsesData.map((res: FormResponse) => {
        const answersMap: { [key: string]: Answer } = {};
        res.response.answers?.forEach((answer: Answer) => {
          if (answer.secondary_type) {
            answersMap[answer.secondary_type] = answer;
          } else {
            answersMap[answer.type] = answer;
          }
        });

        return answersMap;
      });

      setFormResponsesData(responsesArray);

      const emailData: string[] = [];
      const userData: string[] = [];
      const amountData: number[] = [];
      const paymentIntentIdsData: string[] = [];
      responsesArray.forEach((answersMap: Map<string, Answer>) => {
        let email = "N/A";
        let firstName = "";
        let lastName = "";
        let amount = 0;
        let paymentIntentId = "";
        Object.entries(answersMap).forEach(([key, answer]) => {
          if (key === "email") {
            email = (answer as Answer).email ?? "N/A";
          }
          if (key === "first_name") {
            firstName = (answer as Answer).short_text ?? "";
          }
          if (key === "last_name") {
            lastName = (answer as Answer).short_text ?? "";
          }
          if (key === "payment") {
            amount = (answer as Answer).amount ?? 0;
            paymentIntentId = (answer as Answer).paymentIntentId ?? "";
          }
        });

        emailData.push(email);
        userData.push(`${firstName} ${lastName}`);
        amountData.push(amount);
        paymentIntentIdsData.push(paymentIntentId);
      });

      setEmail(emailData);
      setUser(userData);
      setAmount(amountData);
      setPaymentIntentIds(paymentIntentIdsData);
      const statusData: ("approved" | "rejected" | "pending")[] = [];
      const paymentTypeData: string[] = [];

      await Promise.all(
        paymentIntentIdsData.map(async (paymentIntentId, index) => {
          let paymentData;
          try {
            paymentData =
              await getFormPaymentsByPaymentIntentId(paymentIntentId);
          } catch (error) {
            console.log(error);
            paymentData = undefined;
          }

          if (paymentData.payment_intent_status === "approved") {
            statusData[index] = "approved";
          } else if (paymentData.payment_intent_status === "rejected") {
            statusData[index] = "rejected";
          } else {
            statusData[index] = "pending";
          }
          if (paymentData.payment_method_id === 1) {
            paymentTypeData[index] = "Credit Card / Stripe";
          } else {
            paymentTypeData[index] = "Cash / Check";
          }
        })
      );

      setStatus(statusData);
      setPaymentType(paymentTypeData);
    })();
  }, [formId]);

  const handleStatusChange = (
    index: number,
    statusUpdate: "approved" | "rejected" | "pending",
    response: Record<string, Answer>
  ) => {
    return async () => {
      const newStatus = [...status];
      newStatus[index] = statusUpdate;
      setStatus(newStatus);

      let updatedStatus = statusUpdate as string;
      if (statusUpdate == "pending") {
        updatedStatus = "requires_payment_method";
      }

      await updateFormPaymentStatus(
        paymentIntentIds[index],
        updatedStatus,
        adminEmail,
        response
      );
    };
  };

  const headers = [
    "#",
    "Name",
    "Payment Type",
    "Payment Status",
    "View Response",
    "Date Submitted",
    "Email",
    "Amount",
    "Transaction Expiry",
  ];

  return (
    <div className={styles.container}>
      <DashboardTable
        headers={headers}
        headerColor="light"
        className={styles.table}
      >
        {formResponsesData.map((response: Record<string, Answer>, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{user[index]}</td>
            <td>{paymentType[index]}</td>
            {formType === 1 && (
              <td>
                <DropdownMenuButton trigger={StatusButton(status[index])}>
                  <DropdownMenuButton.Item
                    onClick={handleStatusChange(index, "approved", response)}
                  >
                    <StatusLabel status="approved">approved</StatusLabel>
                  </DropdownMenuButton.Item>

                  <DropdownMenuButton.Separator className={styles.separator} />

                  <DropdownMenuButton.Item
                    onClick={handleStatusChange(index, "rejected", response)}
                  >
                    <StatusLabel status="rejected">rejected</StatusLabel>
                  </DropdownMenuButton.Item>

                  <DropdownMenuButton.Separator className={styles.separator} />

                  <DropdownMenuButton.Item
                    onClick={handleStatusChange(index, "pending", response)}
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
                  <FormResponseForm answers={response} />
                </Modal.Content>
              </Modal>
            </td>
            <td>{formatDate(submittedAt[index])}</td>
            <td>{email[index]}</td>
            <td>{formatMoney(amount[index])}</td>
            <td>
              {paymentType[index] === "Credit Card / Stripe"
                ? formatDate(submittedAt[index], 3)
                : ""}
            </td>
          </tr>
        ))}
      </DashboardTable>
      {formResponsesData.length === 0 && (
        <div className={styles.emptyFormResponses}>
          <h2>{t("noResponsesText")}</h2>
        </div>
      )}
    </div>
  );
};

export default FormResponses;
