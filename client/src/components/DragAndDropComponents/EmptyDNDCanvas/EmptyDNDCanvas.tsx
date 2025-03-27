import { useTranslation } from "react-i18next";

import { DropIcon } from "../../../assets/Icons";
import styles from "./EmptyDNDCanvas.module.css";

const EmptyDNDCanvas = () => {
  const { t } = useTranslation("EmptyDNDCanvas");
  return (
    <div className={styles.container}>
      <div className={styles.iconsContainer}>
        <DropIcon width={90} height={90} color={"#1D74C5"} />
      </div>
      <p className={styles.dragText}>{t("dragText")}</p>
    </div>
  );
};
export default EmptyDNDCanvas;
