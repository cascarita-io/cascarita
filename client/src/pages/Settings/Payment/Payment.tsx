import { useState } from "react";
import styles from "./Payment.module.css";

import DashboardTable from "../../../components/DashboardTable/DashboardTable";
import Modal from "../../../components/Modal/Modal";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import StripeAccountForm from "../StripeAccountForm/StripeAccountForm";
import { useTranslation } from "react-i18next";
import StatusLabel from "../../../components/StatusLabel/StatusLabel";

const Payment = () => {
  const { t } = useTranslation("Settings");
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const planHeaders = [
    t("payment.headers.name"),
    t("payment.headers.email"),
    t("payment.headers.date"),
    t("payment.headers.status"),
  ];

  const StatusLabels = {
    Complete: t("payment.status.approved"),
    Restricted: t("payment.status.rejected"),
    Pending: t("payment.status.pending"),
  };

  const mockPaymentData = [
    {
      id: 123,
      name: "Juan Ramos",
      email: "juanramos@gmail.com",
      date_submitted: Date.now(),
      status: StatusLabels.Complete,
    },
    {
      id: 124,
      name: "Jose Patino",
      email: "josepatino@gmail.com",
      date_submitted: Date.now(),
      status: StatusLabels.Restricted,
    },
    {
      id: 125,
      name: "Saul Reyes",
      email: "saulreyes@gmail.com",
      date_submitted: Date.now(),
      status: StatusLabels.Pending,
    },
    {
      id: 126,
      name: "Chuy Gomez",
      email: "chuy@gmail.com",
      date_submitted: Date.now(),
      status: StatusLabels.Complete,
    },
  ];

  const formatDate = (dateNumber: number): string => {
    const date = new Date(dateNumber);
    return date.toLocaleDateString();
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.sectionHeader}>
        <h2>{t("payment.title")}</h2>

        <Modal open={isStripeModalOpen} onOpenChange={setIsStripeModalOpen}>
          <Modal.Button asChild>
            <PrimaryButton
              onClick={() => setIsStripeModalOpen(true)}
              className={styles.btn}
            >
              {t("payment.addStripe")}
            </PrimaryButton>
          </Modal.Button>

          <Modal.Content title={t("payment.formContent.title")}>
            <StripeAccountForm
              afterSave={() => setIsStripeModalOpen(false)}
              requestType="POST"
            />
          </Modal.Content>
        </Modal>
      </div>

      <p style={{ marginBottom: "16px" }}>{t("payment.subtitle")}</p>

      <DashboardTable
        headers={planHeaders}
        headerColor="light"
        className={styles.table}
      >
        {mockPaymentData == null || mockPaymentData?.length === 0 ? (
          <p>{t("payment.empty")}</p>
        ) : (
          mockPaymentData?.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{formatDate(user.date_submitted)}</td>
              <td>
                {/* @ts-ignore */}
                <StatusLabel status={user.status}>{user.status}</StatusLabel>
              </td>
            </tr>
          ))
        )}
      </DashboardTable>
    </section>
  );
};

export default Payment;
