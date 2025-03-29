import { useTranslation } from "react-i18next";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";

import styles from "./Search.module.css";
import { SearchProps } from "./types";

const Search = ({ onSearchChange }: SearchProps) => {
  const { t } = useTranslation("Search");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <TextField.Root
      className={styles.search}
      placeholder={t("item1")}
      onChange={handleChange}
      size="1">
      <TextField.Slot className={styles["search-icon"]}>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
    </TextField.Root>
  );
};
export default Search;
