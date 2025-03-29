import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaExternalLinkAlt, FaPlus } from "react-icons/fa";

import Cookies from "js-cookie";

import { useGetAllStripeAccounts } from "../../../api/stripe/query";
import DashboardTable from "../../../components/DashboardTable/DashboardTable";
import Modal from "../../../components/Modal/Modal";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import StatusLabel from "../../../components/StatusLabel/StatusLabel";
import useResponsiveHeader from "../../../hooks/useResponsiveHeader";
import tableStyles from "../../pages.module.css";
import styles from "../Payment/Payment.module.css";
import StripeAccountForm from "../StripeAccountForm/StripeAccountForm";

const Payment = () => {
  const { t } = useTranslation("Settings");
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  // TODO: MOBILE NOT SHOWING SPECIFIED COLUMNS
  const planHeaders = useResponsiveHeader(
    [
      t("payment.headers.name"),
      t("payment.headers.status"),
      t("payment.headers.email"),
      t("payment.headers.link"),
    ],
    [
      t("payment.headers.name"),
      t("payment.headers.status"),
      t("payment.headers.link"),
    ],
  );
  const groupId = Number(Cookies.get("group_id")) || 0;

  const { data } = useGetAllStripeAccounts(groupId);

  return (
    <section className={styles.wrapper}>
      <div className={styles.sectionHeader}>
        <h2>{t("payment.title")}</h2>

        <Modal open={isStripeModalOpen} onOpenChange={setIsStripeModalOpen}>
          <Modal.Button asChild className={styles.modalTrigger}>
            <PrimaryButton
              onClick={() => setIsStripeModalOpen(true)}
              className={styles.btn}>
              <p className={styles.showInDesktop}>{t("payment.addStripe")}</p>
              <FaPlus className={styles.showInMobile} />
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

      <p className={styles.subtitle}>{t("payment.subtitle")}</p>

      {data == null || data?.length === 0 ? (
        <p className={tableStyles.noItemsMessage}>{t("payment.empty")}</p>
      ) : (
        <DashboardTable
          headers={planHeaders}
          headerColor="light"
          className={styles.table}>
          {data?.map((user) => (
            <tr key={user.id}>
              <td>{`${user.first_name} ${user.last_name}`}</td>
              <td>
                <StatusLabel
                  className={styles.statusLabel}
                  status={user.stripe_status}>
                  {user.stripe_status}
                </StatusLabel>
              </td>
              <td className={tableStyles.showInDesktop}>{user.user_email}</td>
              <td>
                <a
                  href={user.stripe_account_link}
                  target="_blank"
                  rel="noopener noreferrer">
                  <FaExternalLinkAlt />
                </a>
              </td>
            </tr>
          ))}
        </DashboardTable>
      )}
    </section>
  );
};

export default Payment;
