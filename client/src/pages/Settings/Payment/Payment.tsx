import { useEffect, useState } from "react";
import styles from "../Payment/Payment.module.css";
import tableStyles from "../../pages.module.css";

import DashboardTable from "../../../components/DashboardTable/DashboardTable";
import Modal from "../../../components/Modal/Modal";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import StripeAccountForm from "../StripeAccountForm/StripeAccountForm";
import { useTranslation } from "react-i18next";
import useResponsiveHeader from "../../../hooks/useResponsiveHeader";
import { useGetAllStripeAccounts } from "../../../api/stripe/query";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchUser } from "../../../api/users/service";
import Cookies from "js-cookie";
import { FaExternalLinkAlt } from "react-icons/fa";
import StatusLabel from "../../../components/StatusLabel/StatusLabel";

const Payment = () => {
  const { t } = useTranslation("Settings");
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const [groupId, setGroupId] = useState(0);
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

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const email = Cookies.get("email") || "";
      const currentUser = await fetchUser(email, token);
      setGroupId(currentUser.group_id);
    })();
  }, []);

  const { data } = useGetAllStripeAccounts(groupId);

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

      <p>{t("payment.subtitle")}</p>

      {data == null || data?.length === 0 ? (
        <p className={tableStyles.noItemsMessage}>{t("payment.empty")}</p>
      ) : (
        <DashboardTable
          headers={planHeaders}
          headerColor="light"
          className={styles.table}
        >
          {data?.map((user) => (
            <tr key={user.id}>
              <td>{user.stripe_account_name}</td>
              <td>
                <StatusLabel status={user.stripe_status}>
                  {user.stripe_status}
                </StatusLabel>
              </td>
              <td className={tableStyles.showInDesktop}>
                {user.account_email}
              </td>
              <td>
                <a href="#">
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
