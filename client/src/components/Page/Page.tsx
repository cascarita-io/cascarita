import BreadCrumb from "../BreadCrumb/BreadCrumb";
import styles from "./Page.module.css";
import { PageProps } from "./types";

const Page: React.FC<PageProps> = ({ children, title }) => {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </section>
  );
};

export default Page;
