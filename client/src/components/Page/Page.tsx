import styles from "./Page.module.css";
import { DashboardProps } from "./types";

const Page: React.FC<DashboardProps> = ({ children, title }) => {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </section>
  );
};

export default Page;
