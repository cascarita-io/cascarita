import Page from "../../components/Page/Page";
import Search from "../../components/Search/Search";
import SelectMenu from "../../components/SelectMenu/SelectMenu";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import { useEffect, useState } from "react";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import styles from "./Forms.module.css";
import pagesStyles from "../pages.module.css";
import ShareButton from "../../components/ShareButton/ShareButton";
import { useNavigate } from "react-router-dom";
import { Form } from "./types";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import {
  deleteForm,
  getMongoFormById,
  getMongoForms,
} from "../../api/forms/service";
import Modal from "../../components/Modal/Modal";
import React from "react";
import ShareForm from "../../components/Forms/ShareForm/ShareForm";
import Cookies from "js-cookie";
import { fetchUser } from "../../api/users/service";
import { FaPlus } from "react-icons/fa";

interface ShareModalProps {
  formLink: string;
  isOpen: boolean;
  onOpen: (isOpen: boolean) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  formLink,
  isOpen,
  onOpen,
}) => (
  <Modal open={isOpen} onOpenChange={onOpen}>
    <Modal.Button asChild className={styles.btn}>
      <button onClick={() => onOpen(true)}>
        <ShareButton />
      </button>
    </Modal.Button>
    <Modal.Content title="Share Form">
      <ShareForm afterClose={() => onOpen(false)} formLink={formLink} />
    </Modal.Content>
  </Modal>
);

const Forms = () => {
  const { t } = useTranslation("Forms");
  const [sorts, setSorts] = useState("");
  const [forms, setForms] = useState<Form[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentFormLink, setCurrentFormLink] = useState("");
  const navigate = useNavigate();
  const sortStatuses = [t("sortOptions.item1"), t("sortOptions.item2")];
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handleDebounce);
    };
  }, [searchQuery]);

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const email = Cookies.get("email") || "";
      const user = await fetchUser(email, token);
      const mongoForms = await getMongoForms(user?.group_id ?? -1);
      setForms(mongoForms);
    })();
  }, []);

  const handleNewFormClick = () => {
    navigate("/forms/check");
  };

  const handleShareClick = (formLink: string) => {
    setCurrentFormLink(formLink);
    setIsOpen(true);
  };

  // TODO: delete by mongo form ID
  const onDelete = async (id: string) => {
    await deleteForm(id);
    setForms((forms) => forms.filter((form) => form._id !== id));
  };

  const onEdit = async (id: string) => {
    const form = await getMongoFormById(id);

    navigate("/forms/check", {
      state: {
        id,
        title: form.form_data.title,
        description:
          form.form_data.welcome_screens?.[0]?.properties?.description ?? "",
        link: id,
        fields: form.form_data.fields,
      },
    });
  };

  const filteredData = forms
    ?.filter((form: Form) =>
      form.form_data.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    )
    ?.sort((a: Form, b: Form) => {
      if (sorts === t("sortOptions.item1")) {
        return a.form_data.title.localeCompare(b.form_data.title);
      } else if (sorts === t("sortOptions.item2")) {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }
      return 0;
    });

  return (
    <Page title={t("title")}>
      <div className={styles.filterSearch}>
        <div className={styles.dropdown}>
          <Search onSearchChange={setSearchQuery} />
          <div className={styles.filterContainer}>
            <p className={styles.filterSubTitle}>{t("sort")}</p>
            <SelectMenu
              placeholder={t("sortOptions.item1")}
              name="sorts"
              value={sorts}
              onValueChange={(value) => setSorts(value)}
            >
              <SelectMenu.Group>
                {sortStatuses.map((status, idx) => (
                  <SelectMenu.Item key={idx} value={status}>
                    {status}
                  </SelectMenu.Item>
                ))}
              </SelectMenu.Group>
            </SelectMenu>
          </div>
        </div>
        <PrimaryButton
          className={pagesStyles.primaryBtn}
          onClick={handleNewFormClick}
        >
          <p className={pagesStyles.btnTextDesktop}>{t("button")}</p>
          <FaPlus className={pagesStyles.btnTextMobile} />
        </PrimaryButton>
      </div>
      {filteredData == null || filteredData?.length === 0 ? (
        <p className={styles.noLeagueMessage}>No divisions to display...</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.cols}>
            <h3>{t("col1")}</h3>
            <h3>{t("col2")}</h3>
            <h3>{t("col3")}</h3>
            <h3>{t("col4")}</h3>
            <h3>{t("col5")}</h3>
          </div>
          <div>
            {filteredData.map((form, index) => (
              <div className={styles.cols} key={index}>
                <p>
                  <a href={`/forms/${form._id}`} style={{ cursor: "pointer" }}>
                    {form.form_data.title}
                  </a>
                </p>
                <p>{form.created_by?.first_name ?? ""}</p>
                <p>{new Date(form.updatedAt).toLocaleString()}</p>
                <DropdownMenuButton
                  onDelete={() => onDelete(form._id)}
                  onEdit={() => onEdit(form._id)}
                />
                <button
                  onClick={() =>
                    handleShareClick(
                      `${window.location.origin}/forms/${form._id}`
                    )
                  }
                >
                  <ShareButton />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <ShareModal
          formLink={currentFormLink}
          isOpen={isOpen}
          onOpen={(isOpen: boolean) => setIsOpen(isOpen)}
        />
      )}
    </Page>
  );
};

export default Forms;
