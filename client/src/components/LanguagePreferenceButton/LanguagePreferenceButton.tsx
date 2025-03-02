import { TfiWorld } from "react-icons/tfi";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";
import React, { useState } from "react";
import styles from "./LanguagePreferenceButton.module.css";

interface LanguagePreferenceButtonProps {
  className?: string;
}

const LanguagePreferenceButton: React.FC<LanguagePreferenceButtonProps> = ({
  className,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleIconClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSelect = () => {
    setShowDropdown(false);
  };

  return (
    <div className={styles.dropdownButton}>
      <TfiWorld
        className={className}
        onClick={handleIconClick}
        style={{ cursor: "pointer" }}
      />
      {showDropdown && <LanguageDropdown handleSelect={handleSelect} />}
    </div>
  );
};

export default LanguagePreferenceButton;
