import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

import { sendEmail } from "../../../api/forms/service";
import styles from "../Form.module.css";
import { ShareFormProps } from "./types";

const ShareForm: React.FC<ShareFormProps> = ({ afterClose, formLink }) => {
  const textBoxRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState<string>("");

  const handleEmail = async (emails: string[], formLink: string) => {
    const response = await sendEmail(emails, formLink);
    if (response.error) {
      toast.error("Specify at least one email");
    } else {
      toast.success("Form shared! 🎉");
    }
  };

  const handleCopy = () => {
    if (textBoxRef.current) {
      const text = textBoxRef.current.innerText;
      toast.success("Copied to clipboard!");
      navigator.clipboard.writeText(text).catch((err) => {
        toast.error("Failed to copy text");
        console.error("Failed to copy text: ", err);
      });
    }
  };

  return (
    <div className={styles.form}>
      <hr />
      <div>
        <label className={styles.boldLabel}>Form Link</label>
        <div className={styles.shareContainer}>
          <p ref={textBoxRef}>{formLink}</p>
          <button
            className={`${styles.btn} ${styles.copyBtn}`}
            onClick={handleCopy}>
            copy
          </button>
        </div>
      </div>
      <hr />
      <div>
        <label className={styles.boldLabel}>Share Form</label>
        <div className={styles.shareContainer}>
          <textarea
            value={email}
            placeholder="Enter email addresses, separated by commas or new lines"
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputShare}
            rows={4}
          />
          <button
            className={`${styles.btn} ${styles.sendBtn}`}
            onClick={() => {
              const emails = email
                .split(/[\n,]+/)
                .map((e) => e.trim())
                .filter((e) => e);
              const formLink = textBoxRef.current?.innerText || "";
              handleEmail(emails, formLink).finally();
            }}>
            send
          </button>
        </div>
      </div>

      <div className={styles.formBtnContainer}>
        <button
          className={`${styles.btn} ${styles.cancelBtn}`}
          onClick={afterClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareForm;
