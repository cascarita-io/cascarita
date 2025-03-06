import React, { useCallback, useMemo } from "react";
import styles from "./FileUpload.module.css";
import { FileRejection, useDropzone } from "react-dropzone";
import { FileIcon, Cross1Icon } from "@radix-ui/react-icons";
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

const FileUpload: React.FC<FileUploadProps> = ({ className, setFileValue }) => {
  const [filePreview, setFilePreview] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    const file = new FileReader();

    file.onload = () => {
      setFilePreview(file.result as string);
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
    [isFocused, isDragAccept, isDragReject]
  );

  const removeFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setFilePreview("");
    if (setFileValue) {
      setFileValue(null);
    }
  };

  return (
    <div
      {...getRootProps({
        className: className,
        style: style,
      })}
    >
      {filePreview && (
        <div className={styles.imgContainer}>
          <img
            className={styles.img}
            src={filePreview || undefined}
            alt=""
            onLoad={() => {
              URL.revokeObjectURL(filePreview);
            }}
          />
        </div>
      )}

      <input {...getInputProps()} />
      {isDragActive ? (
        <div className={styles.dropZoneContent}>
          {!filePreview && (
            <>
              <FileIcon className={styles.fileIcon} width={60} height={60} />
              <p className={styles.textSm}>Drop the files here ...</p>
            </>
          )}
        </div>
      ) : (
        <div className={styles.dropZoneContent}>
          {!filePreview && (
            <>
              <FileIcon className={styles.fileIcon} width={60} height={60} />
              <p className={styles.textSm}>
                Drag and drop a file here or{" "}
                <span className={styles.boldLogoText}>Choose a file</span>
              </p>
            </>
          )}
        </div>
      )}

      {isDragReject && <p className={styles.errorText}>File is not accepted</p>}
      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

      {filePreview && (
        <aside>
          <button className={styles.removeBtn} onClick={removeFile}>
            <Cross1Icon />
          </button>
        </aside>
      )}
    </div>
  );
};

export default FileUpload;
