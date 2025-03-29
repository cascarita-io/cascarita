import { useEffect, useState } from "react";

import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Text } from "@radix-ui/themes";

import { Answer } from "../../api/forms/types";
import { AcceptIcon, RejectIcon } from "../../assets/Icons";
import styles from "../Forms/Form.module.css";
import Modal from "../Modal/Modal";

interface PaymentCaptureModalProps {
  amount: string;
  status: string;
  index: number;
  response: Record<string, Answer>;
  handleStatusChange: (
    index: number,
    statusUpdate: "approved" | "rejected" | "pending",
    response: Record<string, Answer>,
  ) => void;
}

interface PaymentCaptureProps {
  amount: string;
}

const REJECTED = "rejected";
const APPROVED = "approved";

interface CapturePaymentProps {
  index: number;
  response: Record<string, Answer>;
  setCaptureStatus: React.Dispatch<React.SetStateAction<string>>;
  handleStatusChange: (
    index: number,
    statusUpdate: "approved" | "rejected" | "pending",
    response: Record<string, Answer>,
  ) => void;
}

const CapturePayment: React.FC<CapturePaymentProps> = ({
  index,
  response,
  setCaptureStatus,
  handleStatusChange,
}) => {
  return (
    <div style={{ justifyContent: "center", alignItems: "center" }}>
      <div className={styles.inputContainer}>
        <Text className={styles.boldLabel}>
          Are you sure you want to capture these payments
        </Text>
        <Text className={styles.subtitle}>
          Note that these changes are not reversible.
        </Text>
      </div>
      <div className={styles.formBtnContainer}>
        <Modal.Close className={`${styles.btn} ${styles.cancelBtn}`}>
          Cancel
        </Modal.Close>

        <button
          className={`${styles.btn} ${styles.btnReject}`}
          onClick={() => {
            setCaptureStatus(REJECTED);
            handleStatusChange(index, REJECTED, response);
          }}>
          <CrossCircledIcon style={{ borderRadius: "50%" }} />
          Reject
        </button>

        <button
          className={`${styles.btn} ${styles.btnApprove}`}
          onClick={() => {
            setCaptureStatus(APPROVED);
            handleStatusChange(index, APPROVED, response);
          }}>
          <CheckCircledIcon style={{ borderRadius: "50%" }} />
          Approve
        </button>
      </div>
    </div>
  );
};

const ApprovePaymentCapture: React.FC<PaymentCaptureProps> = ({ amount }) => {
  return (
    <div className={styles.centered}>
      <AcceptIcon width={100} height={100} />
      <Text>The payment of {amount} been approved and captured.</Text>
    </div>
  );
};

const RejectPaymentCapture: React.FC<PaymentCaptureProps> = ({ amount }) => {
  return (
    <div className={styles.centered}>
      <RejectIcon width={100} height={100} />
      <Text>The payment of {amount} has been rejected.</Text>
    </div>
  );
};

const PaymentCapture: React.FC<PaymentCaptureModalProps> = ({
  amount,
  status,
  index,
  response,
  handleStatusChange,
}) => {
  const [page, setPage] = useState(0);
  const [captureStatus, setCaptureStatus] = useState("pending");

  // setting from the status being passed in
  useEffect(() => {
    if (status === APPROVED) {
      setPage(1);
    } else if (status === REJECTED) {
      setPage(2);
    }
  }, [status]);

  // setting when action has been taken
  useEffect(() => {
    if (captureStatus === APPROVED) {
      setPage(1);
    } else if (captureStatus === REJECTED) {
      setPage(2);
    }
  }, [captureStatus]);

  return (
    <>
      {page === 0 && (
        <CapturePayment
          index={index}
          response={response}
          setCaptureStatus={setCaptureStatus}
          handleStatusChange={handleStatusChange}
        />
      )}
      {page === 1 && <ApprovePaymentCapture amount={amount} />}
      {page === 2 && <RejectPaymentCapture amount={amount} />}
    </>
  );
};

export default PaymentCapture;
