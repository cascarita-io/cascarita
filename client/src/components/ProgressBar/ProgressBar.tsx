import * as Progress from "@radix-ui/react-progress";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  used: number;
  total: number;
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  getLabel?: (value: number, max: number) => string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  getLabel,
  used,
  total,
  asChild = false,
  children,
  className,
}) => {
  const progressBarClassName = `${styles.progressBarContainer} ${className}`;

  return (
    <Progress.Root
      value={used}
      max={total}
      asChild={asChild ? true : false}
      getValueLabel={getLabel}
      className={progressBarClassName}
    >
      <Progress.ProgressIndicator
        className={styles.progressIndicator}
        style={{
          transform: `translateX(-${100 - used}%)`,
        }}
      >
        {children}
      </Progress.ProgressIndicator>
    </Progress.Root>
  );
};

export default ProgressBar;
