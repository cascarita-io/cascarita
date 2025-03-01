import { useEffect, useState } from "react";
import styles from "./FormResponses.module.css";
import Cookies from "js-cookie";
import {
  AnswerRecordMap,
  FormPaymentType,
  FormResponse,
  FormResponsesProps,
} from "./types";
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
  getFormPayments,
  updateFormPaymentStatus,
} from "../../api/forms/service";
import PaymentCapture from "../PaymentCapture/PaymentCapture";

const StatusButton = (status: "approved" | "rejected" | "pending") => {
  return (
    <StatusLabel status={status} renderDropdown={true}>
      {status}
    </StatusLabel>
  );
};

interface PaymentCaptureModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  amount: string;
  user: string;
  index: number;
  response: Record<string, Answer>;
  status: "approved" | "rejected" | "pending";
  handleStatusChange: (
    index: number,
    statusUpdate: "approved" | "rejected" | "pending",
    response: Record<string, Answer>
  ) => void;
}

const PaymentCaptureModal: React.FC<PaymentCaptureModalProps> = ({
  openModal,
  setOpenModal,
  amount,
  status,
  index,
  response,
  user,
  handleStatusChange,
}) => {
  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Content title={`Capture Payment for ${user}`}>
        <PaymentCapture
          amount={amount}
          status={status}
          index={index}
          response={response}
          handleStatusChange={handleStatusChange}
        />
      </Modal.Content>
    </Modal>
  );
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
  const [openModal, setOpenModal] = useState(false);
  const adminEmail = Cookies.get("email") || "";
  const [formDocumentId, setFormDocumentId] = useState("");
  console.log(formDocumentId);
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
      setFormDocumentId(formData._id);
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
      const formPayments = await getFormPayments(formId);
      await Promise.all(
        formPayments.map(
          async (paymentData: FormPaymentType, index: number) => {
            if (paymentData.payment_intent_status === "succeeded") {
              statusData[index] = "approved";
            } else if (paymentData.payment_intent_status === "canceled") {
              statusData[index] = "rejected";
            } else {
              statusData[index] = "pending";
            }
            if (paymentData.payment_method_id === 1) {
              paymentTypeData[index] = "Credit Card / Stripe";
            } else {
              paymentTypeData[index] = "Cash / Check";
            }
          }
        )
      );

      setStatus(statusData);
      setPaymentType(paymentTypeData);
    })();
  }, [formId]);

  const handleStatusChange = async (
    index: number,
    statusUpdate: "approved" | "rejected" | "pending",
    response: Record<string, Answer>
  ) => {
    const newStatus = [...status];
    newStatus[index] = statusUpdate;
    setStatus(newStatus);

    let updatedStatus = statusUpdate as string;
    if (statusUpdate === "pending") {
      updatedStatus = "requires_payment_method";
    } else if (statusUpdate === "approved") {
      updatedStatus = "approved";
    } else {
      updatedStatus = "rejected";
    }

    await updateFormPaymentStatus(
      paymentIntentIds[index],
      updatedStatus,
      adminEmail,
      response
    );
  };

  const registrationTypeHeaders = [
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

  const blankTypeHeaders = ["#", "View Response", "Date Submitted"];

  return (
    <div className={styles.container}>
      {formType === 1 ? (
        <DashboardTable
          headers={registrationTypeHeaders}
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
                  <PaymentCaptureModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    status={status[index]}
                    amount={formatMoney(amount[index])}
                    user={user[index]}
                    index={index}
                    response={response}
                    handleStatusChange={handleStatusChange}
                  />
                  <DropdownMenuButton trigger={StatusButton(status[index])}>
                    <DropdownMenuButton.Item onClick={() => setOpenModal(true)}>
                      <StatusLabel status="approved">approved</StatusLabel>
                    </DropdownMenuButton.Item>

                    <DropdownMenuButton.Separator
                      className={styles.separator}
                    />

                    <DropdownMenuButton.Item onClick={() => setOpenModal(true)}>
                      <StatusLabel status="rejected">rejected</StatusLabel>
                    </DropdownMenuButton.Item>

                    <DropdownMenuButton.Separator
                      className={styles.separator}
                    />

                    <DropdownMenuButton.Item onClick={() => setOpenModal(true)}>
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
      ) : (
        <DashboardTable
          headers={blankTypeHeaders}
          headerColor="light"
          className={styles.table}
        >
          {formResponsesData.map((response: Record<string, Answer>, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
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
            </tr>
          ))}
        </DashboardTable>
      )}
      {formResponsesData.length === 0 && (
        <div className={styles.emptyFormResponses}>
          <h2>{t("noResponsesText")}</h2>
        </div>
      )}
    </div>
  );
};

export default FormResponses;
