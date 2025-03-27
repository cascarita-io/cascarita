import { useTranslation } from "react-i18next";

import DashboardTable from "../../../components/DashboardTable/DashboardTable";
import ProgressBar from "../../../components/ProgressBar/ProgressBar";
import { useFormatDate } from "../../../hooks/useFormatDate";
import styles from "./Plan.module.css";

const Plan = () => {
  const { t } = useTranslation("Settings");
  const planHeaders = [
    t("plan.headers.membership"),
    t("plan.headers.status"),
    t("plan.headers.renewal"),
    t("plan.headers.actions"),
  ];
  const mockPlanData = [
    {
      id: 123,
      type: "Basic Subscription",
      status: true,
      renewalDate: Date.now(),
    },
  ];

  const formatDate = useFormatDate;

  return (
    <section className={styles.wrapper}>
      <div className={styles.sectionWrapper}>
        <h2>{t("plan.title")}</h2>

        <DashboardTable
          headers={planHeaders}
          headerColor="light"
          className={styles.table}>
          {mockPlanData == null || mockPlanData?.length === 0 ? (
            <p>{t("plan.empty")}</p>
          ) : (
            mockPlanData?.map((user) => (
              <tr key={user.id}>
                <td>{user.type}</td>
                <td>
                  {user.status ? (
                    <p>{t("plan.status.active")}</p>
                  ) : (
                    <p>{t("plan.status.inactive")}</p>
                  )}
                </td>
                <td>{formatDate(user.renewalDate)}</td>
                <td>
                  <a href="#" className={styles.link}>
                    {t("plan.upgrade")}
                  </a>
                  <a href="#" className={styles.link}>
                    {t("plan.cancel")}
                  </a>
                </td>
              </tr>
            ))
          )}
        </DashboardTable>
      </div>

      <div className={styles.sectionWrapper}>
        <h2>{t("plan.details.title")}</h2>
        <div className={styles.progressWrapper}>
          <h3>{t("plan.details.users")}</h3>

          <div>
            <ProgressBar
              used={70}
              total={100}
              getLabel={(value, max) => {
                return `${value} ${t("plan.details.of")} ${max} ${t(
                  "plan.details.used",
                )}`;
              }}
            />

            <span>{`${70} ${t("plan.details.of")} ${100} ${t(
              "plan.details.used",
            )}`}</span>
          </div>
        </div>

        <div className={styles.progressWrapper}>
          <h3>{t("plan.details.players")}</h3>

          <div>
            <ProgressBar
              used={30}
              total={100}
              getLabel={(value, max) => {
                return `${value} ${t("plan.details.of")} ${max} ${t(
                  "plan.details.used",
                )}`;
              }}
            />

            <span>{`${30} ${t("plan.details.of")} ${100} ${t(
              "plan.details.used",
            )}`}</span>
          </div>
        </div>

        <div className={styles.progressWrapper}>
          <h3>{t("plan.details.storage")}</h3>

          <div>
            <ProgressBar
              used={50}
              total={100}
              getLabel={(value, max) => {
                return `${value} ${t("plan.details.of")} ${max} ${t(
                  "plan.details.used",
                )}`;
              }}
            />

            <span>{`${50} ${t("plan.details.of")} ${100} ${t(
              "plan.details.used",
            )}`}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Plan;
