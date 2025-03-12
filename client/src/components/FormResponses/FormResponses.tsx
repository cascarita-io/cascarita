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
  sendApprovalEmail,
  sendRejectionEmail,
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
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [currentPaymentIndex, setCurrentPaymentIndex] = useState<number | null>(
    null
  );
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
            if (paymentData.internal_status_id === 3) {
              statusData[index] = "approved";
            } else if (paymentData.internal_status_id === 11) {
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

    const leagueName =
      formResponsesData[index].player.player?.league_name || "";
    const email = formResponsesData[index]["email"].email;
    const seasonName =
      formResponsesData[index].player.player?.season_name || "";
    const playerName = `${formResponsesData[index]["first_name"].short_text} ${formResponsesData[index]["last_name"].short_text}`;
    const paymentAmount =
      Number(formResponsesData[index]["payment"].amount) / 100;
    const paymentDate = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const transactionId =
      formResponsesData[index]["payment"].paymentIntentId || "";

    if (statusUpdate === "pending") {
      updatedStatus = "requires_payment_method";
    } else if (statusUpdate === "approved") {
      if (email) {
        await sendApprovalEmail(
          [email],
          leagueName,
          seasonName,
          playerName,
          paymentAmount,
          paymentDate,
          transactionId
        );
      }
      updatedStatus = "succeeded";
    } else {
      if (email) {
        await sendRejectionEmail(
          [email],
          leagueName,
          seasonName,
          playerName,
          paymentAmount
        );
      }
      updatedStatus = "canceled";
    }

    await updateFormPaymentStatus(
      paymentIntentIds[index],
      updatedStatus,
      adminEmail,
      response
    );
  };

  const handleOpenPaymentModal = (index: number) => {
    setCurrentPaymentIndex(index);
    setOpenPaymentModal(true);
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
      {currentPaymentIndex !== null && (
        <PaymentCaptureModal
          openModal={openPaymentModal}
          setOpenModal={setOpenPaymentModal}
          status={status[currentPaymentIndex]}
          amount={formatMoney(amount[currentPaymentIndex])}
          user={user[currentPaymentIndex]}
          index={currentPaymentIndex}
          response={formResponsesData[currentPaymentIndex]}
          handleStatusChange={handleStatusChange}
        />
      )}

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
                  <DropdownMenuButton trigger={StatusButton(status[index])}>
                    <DropdownMenuButton.Item
                      onClick={() => handleOpenPaymentModal(index)}
                    >
                      <StatusLabel status="approved">approved</StatusLabel>
                    </DropdownMenuButton.Item>

                    <DropdownMenuButton.Separator
                      className={styles.separator}
                    />

                    <DropdownMenuButton.Item
                      onClick={() => handleOpenPaymentModal(index)}
                    >
                      <StatusLabel status="rejected">rejected</StatusLabel>
                    </DropdownMenuButton.Item>

                    <DropdownMenuButton.Separator
                      className={styles.separator}
                    />

                    <DropdownMenuButton.Item
                      onClick={() => handleOpenPaymentModal(index)}
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
