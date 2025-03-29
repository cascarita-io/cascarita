import React, { useEffect, useState } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "js-cookie";

import { fetchUser } from "../../api/users/service";
import { User } from "../../api/users/types";
import { changeLanguage } from "../../i18n/config";
import styles from "./LanguageDropdown.module.css";
import { LanguageDropdownProps } from "./types";

interface LanguageOption {
  value: string;
  label: string;
}

const languages: LanguageOption[] = [
  { value: "en", label: "English" },
  { value: "esp", label: "Español" },
];

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  handleSelect,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const email = Cookies.get("email") || "";
      const user = await fetchUser(email, token);
      setCurrentUser(user);
    })();
  }, []);

  useEffect(() => {
    const currLanguage = localStorage.getItem("defaultLanguage");
    if (currLanguage) {
      setSelectedLanguage(currLanguage);
    }

    const timeout = setTimeout(() => {
      handleSelect();
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [handleSelect]);

  const handleLanguageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (currentUser) {
      await setSelectedLanguage(event.target.value);
      await changeLanguage(currentUser.id, event.target.value);
    }
    handleSelect();
  };

  return (
    <div className={styles.languageDropdown}>
      {languages.map((language) => (
        <div key={language.value}>
          <input
            type="radio"
            id={language.value}
            name="language"
            value={language.value}
            checked={selectedLanguage === language.value}
            onChange={handleLanguageChange}
            className={styles.languagesInput}
          />
          <label htmlFor={language.value}>{language.label}</label>
        </div>
      ))}
    </div>
  );
};

export default LanguageDropdown;
