import Page from "../../components/Page/Page";
import Search from "../../components/Search/Search";
import SelectMenu from "../../components/SelectMenu/SelectMenu";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import { useEffect, useState } from "react";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import styles from "../pages.module.css";
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
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import useResponsiveHeader from "../../hooks/useResponsiveHeader";
import FormTemplateForm from "../../components/Forms/RegistrationTemplateForm/RegistrationTemplateForm";
import DeleteForm from "../../components/Forms/DeleteForm/DeleteForm";

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
    <Modal.Button asChild className={styles.modalTrigger}>
      <button onClick={() => onOpen(true)}>
        <ShareButton />
      </button>
    </Modal.Button>
    <Modal.Content title="Share Form">
      <ShareForm afterClose={() => onOpen(false)} formLink={formLink} />
    </Modal.Content>
  </Modal>
);

interface CreateTemplateModalProps {
  isOpen: boolean;
  onOpen: (isOpen: boolean) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onOpen,
}) => (
  <Modal open={isOpen} onOpenChange={onOpen}>
    <Modal.Content title="Create Form">
      <FormTemplateForm
        afterSave={() => {
          onOpen(false);
        }}
      />
    </Modal.Content>
  </Modal>
);

// Delete Form Modal
interface DeleteFormModalProps {
  isOpen: boolean;
  onOpen: (isOpen: boolean) => void;
}

const DeleteFormModal: React.FC<DeleteFormModalProps> = ({
  isOpen,
  onOpen,
}) => (
  <Modal open={isOpen} onOpenChange={onOpen}>
    <Modal.Content title="Delete Form">
      <DeleteForm afterSave={false} children={undefined} />
    </Modal.Content>
  </Modal>
);

const Forms = () => {
  const { t } = useTranslation("Forms");
  const [sorts, setSorts] = useState("");
  const [forms, setForms] = useState<Form[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentFormLink, setCurrentFormLink] = useState("");
  const navigate = useNavigate();
  const sortStatuses = [t("sortOptions.item1"), t("sortOptions.item2")];
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const { getAccessTokenSilently } = useAuth0();

  const headers = useResponsiveHeader(
    [t("col1"), t("col2"), t("col4"), t("col5")],
    [t("col1"), t("col5")]
  );

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

  // const handleNewFormClick = () => {
  //   navigate("/forms/edit");
  // };

  const handleTemplateClick = () => {
    setIsCreateOpen(true);
  };

  const handleShareClick = (formLink: string) => {
    setCurrentFormLink(formLink);
    setIsOpen(true);
  };

  const onDelete = async (id: string) => {
    setIsDeleteOpen(true);
    await deleteForm(id);
  };

  const onOpen = async (id: string) => {
    const form = await getMongoFormById(id);

    navigate("/forms/edit", {
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

  const onView = async (id: string) => {
    navigate(`/forms/${id}`);
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

        <div style={{ display: "flex", gap: "1rem" }}>
          <PrimaryButton
            className={`${styles.primaryBtnForms} ${styles.showInDesktop}`}
            onClick={handleTemplateClick}
          >
            <p className={styles.btnTextDesktop}>Template</p>
            {/* <FaPlus className={styles.btnTextMobile} /> */}
          </PrimaryButton>

          {/* TODO: UNCOMMENT CUSTOM FORMS WHEN READY */}
          {/* <PrimaryButton
            className={`${styles.primaryBtnForms} ${styles.showInDesktop}`}
            onClick={handleNewFormClick}
          >
            <p className={styles.btnTextDesktop}>New Form</p>
            <FaPlus className={styles.btnTextMobile} />
          </PrimaryButton> */}
        </div>
      </div>
      {filteredData == null || filteredData?.length === 0 ? (
        <p className={styles.noItemsMessage}>No forms to display...</p>
      ) : (
        <DashboardTable headers={headers} headerColor="light">
          {filteredData?.map((form, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={styles.tableData}>
                <p>
                  <button
                    onClick={() => onOpen(form._id)}
                    style={{ cursor: "pointer" }}
                  >
                    {form.form_data.title}
                  </button>
                  {/* <a href={`/forms/${form._id}`} style={{ cursor: "pointer" }}>
                    {form.form_data.title}
                  </a> */}
                </p>
              </td>

              <td className={`${styles.tableData} ${styles.showInDesktop}`}>
                <p>{form.created_by?.first_name ?? ""}</p>
              </td>

              <td className={`${styles.tableData} ${styles.showInDesktop}`}>
                <DropdownMenuButton
                  onDelete={() => onDelete(form._id)}
                  onEdit={() => onOpen(form._id)}
                  onView={() => onView(form._id)}
                />
              </td>

              <td className={styles.tableData}>
                <button
                  onClick={() =>
                    handleShareClick(
                      `${window.location.origin}/forms/${form._id}`
                    )
                  }
                >
                  <ShareButton />
                </button>
              </td>
            </tr>
          ))}
        </DashboardTable>
      )}

      {isOpen && (
        <ShareModal
          formLink={currentFormLink}
          isOpen={isOpen}
          onOpen={(isOpen: boolean) => setIsOpen(isOpen)}
        />
      )}

      {isCreateOpen && (
        <CreateTemplateModal
          isOpen={isCreateOpen}
          onOpen={(isOpen: boolean) => setIsCreateOpen(isOpen)}
        />
      )}

      {isDeleteOpen && (
        <DeleteFormModal
          isOpen={isDeleteOpen}
          onOpen={(isOpen: boolean) => setIsDeleteOpen(isOpen)}
        />
      )}
    </Page>
  );
};

export default Forms;
