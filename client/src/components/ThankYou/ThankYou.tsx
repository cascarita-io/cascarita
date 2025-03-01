import BlueCheckMarkIcon from "../../assets/Icons/BlueCheckMarkIcon";
import FormFooter from "../FormFooter/FormFooter";
import FormHeader from "../FormHeader/FormHeader";
import styles from "./ThankYou.module.css";

const ThankYou = () => {
  return (
    <>
      <FormHeader used={100} total={100} />
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          <BlueCheckMarkIcon />
        </div>
        <h1 className={styles.title}>Completed!</h1>
        <p className={styles.message}>
          You have successfully submitted a response.
        </p>
        <FormFooter />
      </div>
    </>
  );
};

export default ThankYou;
