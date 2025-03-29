import React, { useCallback, useEffect, useMemo } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import PulseLoader from "react-spinners/PulseLoader";

import { Cross1Icon, ImageIcon } from "@radix-ui/react-icons";

import styles from "./FileUpload.module.css";
import { FileUploadProps } from "./types";

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const FileUpload: React.FC<FileUploadProps> = ({
  className,
  setFileValue,
  imagePreview,
}) => {
  const [filePreview, setFilePreview] = React.useState<string>(
    imagePreview || "",
  );
  const [isLoading, setIsLoading] = React.useState(imagePreview ? true : false);

  useEffect(() => {
    if (imagePreview) {
      setIsLoading(false);
      setFilePreview(imagePreview);
    } else {
      setFilePreview("");
    }
  }, [imagePreview]);

  const [errorMessage, setErrorMessage] = React.useState("");

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    const file = new FileReader();

    file.onload = () => {
      setIsLoading(true);
      if (setFileValue) {
        setFileValue(acceptedFiles[0]);
      }
    };

    file.readAsDataURL(acceptedFiles[0]);
    setErrorMessage("");
  }, []);

  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const { errors } = rejectedFiles[0];
      if (errors && errors.length > 0) {
        const error = errors[0];
        if (error.code === "file-too-large") {
          setErrorMessage("Image size is too big");
        } else {
          setErrorMessage(error.message);
        }
      }
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused,
  } = useDropzone({
    onDropAccepted,
    onDropRejected,
    maxFiles: 1,
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000 * 10,
  });

  const style = useMemo(
    () => ({
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  const removeFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setFilePreview("");
    if (setFileValue) {
      setFileValue(undefined);
    }
  };

  return (
    <div
      {...getRootProps({
        className: className,
        style: style,
      })}>
      {filePreview && (
        <div className={styles.imgContainer}>
          <img
            className={styles.img}
            src={filePreview || undefined}
            alt=""
            onLoad={() => {
              if (filePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(filePreview);
              }
            }}
          />
          {filePreview && (
            <aside>
              <button className={styles.removeBtn} onClick={removeFile}>
                <Cross1Icon />
              </button>
            </aside>
          )}
        </div>
      )}

      <input {...getInputProps()} />
      {isLoading && !filePreview ? (
        <PulseLoader color="#2196f3" loading={isLoading} />
      ) : isDragActive ? (
        <div className={styles.dropZoneContent}>
          {!filePreview && (
            <>
              <ImageIcon className={styles.fileIcon} width={60} height={60} />
              <p className={styles.textSm}>Drop the files here ...</p>
            </>
          )}
        </div>
      ) : (
        <>
          {!filePreview && (
            <div className={styles.dropZoneContent}>
              <ImageIcon className={styles.fileIcon} width={60} height={60} />
              <p className={styles.textSm}>
                Drag and drop a file here or{" "}
                <span className={styles.boldLogoText}>Choose a file</span>
              </p>
              <p className={`${styles.textSm} ${styles.noShowInMobile}`}>
                Supported upload types:{" "}
                <span className={styles.boldLogoText}>
                  jpeg, jpg, png, heic
                </span>
              </p>
              <p className={`${styles.textSm} ${styles.noShowInMobile}`}>
                Ideal photo dimensions:{" "}
                <span className={styles.boldLogoText}>400x500, 300x300</span>
              </p>
            </div>
          )}
        </>
      )}

      {isDragReject && <p className={styles.errorText}>File is not accepted</p>}
      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
    </div>
  );
};

export default FileUpload;
