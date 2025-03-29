import React, { useState } from "react";
import { TfiWorld } from "react-icons/tfi";

import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";

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
    <>
      <TfiWorld
        className={className}
        onClick={handleIconClick}
        style={{ cursor: "pointer" }}
      />
      {showDropdown && <LanguageDropdown handleSelect={handleSelect} />}
    </>
  );
};

export default LanguagePreferenceButton;
