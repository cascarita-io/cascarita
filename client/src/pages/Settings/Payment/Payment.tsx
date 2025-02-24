import { useEffect, useState } from "react";
import styles from "../Settings.module.css";
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
      t("payment.headers.date"),
      t("payment.headers.link"),
    ],
    [
      t("payment.headers.name"),
      t("payment.headers.status"),
      t("payment.headers.link"),
    ],
  );

  const StatusLabels: { [key: string]: "approved" | "rejected" | "pending" } = {
    Complete: "approved",
    Restricted: "rejected",
    Pending: "pending",
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
  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const email = Cookies.get("email") || "";
      const currentUser = await fetchUser(email, token);
      setGroupId(currentUser.group_id);
    })();
  }, []);
  //TODO: Pass in groupID into this hook
  //It Makes a query to api
  const { data } = useGetAllStripeAccounts(groupId);
  console.log(data);

  const formatDate = (dateNumber: number): string => {
    const date = new Date(dateNumber);
    return date.toLocaleDateString();
  };

  return (
    <section className={styles.settingsWrapper}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleWrapper}>
          <h2>{t("payment.title")}</h2>
          <p style={{ marginBottom: "16px" }}>{t("payment.subtitle")}</p>
        </div>

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

      <DashboardTable
        headers={planHeaders}
        headerColor="light"
        className={styles.table}
      >
        {data == null || data?.length === 0 ? (
          <p className={tableStyles.noItemsMessage}>{t("payment.empty")}</p>
        ) : (
          data?.map((user) => (
            <tr key={user.id}>
              <td>{user.stripe_account_name}</td>
              <td>
                <p
                  className={styles.statusLabel}
                  style={statusLabelStyling(user.stripe_status)}
                >
                  {user.stripe_status}
                </p>
                <StatusLabel status={user.status}>{user.status}</StatusLabel>
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
          ))
        )}
      </DashboardTable>
    </section>
  );
};

export default Payment;
