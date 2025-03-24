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
import { useTranslation } from "react-i18next";
import { getMongoFormById } from "../../api/forms/service";
import Modal from "../../components/Modal/Modal";
import React from "react";
import ShareForm from "../../components/Forms/ShareForm/ShareForm";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import useResponsiveHeader from "../../hooks/useResponsiveHeader";
import FormTemplateForm from "../../components/Forms/RegistrationTemplateForm/RegistrationTemplateForm";
import DeleteForm from "../../components/Forms/DeleteForm/DeleteForm";
import { useDeleteForm } from "../../api/forms/mutations";
import { useGetMongoForms } from "../../api/forms/query";
import { useGroup } from "../../components/GroupProvider/GroupProvider";
import { FetchedForm } from "../FormPage/types";
import { NewFormSections } from "../NewForm/types";

interface ShareModalProps {
  formLink: string;
  isOpen: boolean;
  onOpen: (isOpen: boolean) => void;
}
const MOBILE_WIDTH = 768;
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
  formId: string;
}
const DeleteFormModal: React.FC<DeleteFormModalProps> = ({
  isOpen,
  onOpen,
  formId,
}) => {
  const deleteMutation = useDeleteForm();
  const [responseError, setResponseError] = useState("");

  const handleDelete = async (
    e: React.FormEvent<HTMLFormElement>,
    formId: string,
  ) => {
    e.preventDefault();
    try {
      const deleteResult = await deleteMutation.mutateAsync(formId);
      if (deleteResult.error) {
        setResponseError(deleteResult.error);
      } else {
        onOpen(false);
      }
    } catch (error) {
      console.error("Unexpected error during form deletion:", error);
      setResponseError("Unexpected error occurred");
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onOpen}>
      <Modal.Content title="Delete Form">
        <DeleteForm
          destructBtnLabel={"Yes, I'm sure"}
          className={styles.form}
          onSubmit={(e) => handleDelete(e, formId)}
        >
          <p>Are you sure you want to delete this form?</p>
          {responseError && <p style={{ color: "red" }}>{responseError}</p>}
        </DeleteForm>
      </Modal.Content>
    </Modal>
  );
};

const Forms = () => {
  const { t: tForms } = useTranslation("Forms");
  const { t: tDropDownButton } = useTranslation("DropdownMenuButton");

  const [sorts, setSorts] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentFormLink, setCurrentFormLink] = useState("");
  const navigate = useNavigate();
  const sortStatuses = [
    tForms("sortOptions.item1"),
    tForms("sortOptions.item2"),
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [currentFormId, setCurrentFormId] = useState("");
  const { groupId } = useGroup();

  const headers = useResponsiveHeader(
    [tForms("col1"), tForms("col2"), tForms("col4"), tForms("col5")],
    [tForms("col1"), tForms("col5")],
  );

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handleDebounce);
    };
  }, [searchQuery]);

  const { data: forms, refetch } = useGetMongoForms(groupId);

  useEffect(() => {
    setSorts(tForms("sortOptions.item1"));
  }, [tForms]);

  useEffect(() => {
    if (!isDeleteOpen) {
      // Re-fetch forms when delete modal is closed
      refetch();
    }
  }, [isDeleteOpen]);

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
    setCurrentFormId(id);
    setIsDeleteOpen(true);
  };

  const onEdit = async (
    id: string,
    editFormSection: NewFormSections = "questions",
  ) => {
    // only enable viewing responses on desktop view
    if (window.innerWidth >= MOBILE_WIDTH) {
      const form = await getMongoFormById(id);

      navigate("/forms/edit", {
        state: {
          id,
          title: form.form_data.title,
          description:
            form.form_data.welcome_screens?.[0]?.properties?.description ?? "",
          link: id,
          fields: form.form_data.fields,
          activeSection: editFormSection,
        },
      });
    }
  };

  const onView = async (id: string) => {
    navigate(`/forms/${id}`);
  };

  const filteredData = forms
    ?.filter((form: Form) =>
      form.form_data.title.toLowerCase().includes(debouncedQuery.toLowerCase()),
    )
    ?.sort((a: Form, b: Form) => {
      if (sorts === tForms("sortOptions.item1")) {
        return a.form_data.title.localeCompare(b.form_data.title);
      } else if (sorts === tForms("sortOptions.item2")) {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }
      return 0;
    });

  return (
    <Page title={tForms("title")}>
      <div className={styles.filterSearch}>
        <div className={styles.dropdown}>
          <Search onSearchChange={setSearchQuery} />
          <div className={styles.filterContainer}>
            <p className={styles.filterSubTitle}>{tForms("sort")}</p>
            <SelectMenu
              placeholder={tForms("sortOptions.item1")}
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
            <p className={styles.btnTextDesktop}>New Form</p>
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
          {filteredData?.map((form: FetchedForm, index: number) => (
            <tr key={index} className={styles.tableRow}>
              <td className={styles.tableData}>
                <p>
                  <button
                    onClick={() => onEdit(form._id)}
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
                <DropdownMenuButton>
                  <DropdownMenuButton.Item onClick={() => onEdit(form._id)}>
                    {tDropDownButton("edit")}
                  </DropdownMenuButton.Item>
                  <DropdownMenuButton.Separator className={styles.separator} />
                  <DropdownMenuButton.Item onClick={() => onDelete(form._id)}>
                    {tDropDownButton("delete")}
                  </DropdownMenuButton.Item>
                  <DropdownMenuButton.Item onClick={() => onView(form._id)}>
                    {tDropDownButton("view")}
                  </DropdownMenuButton.Item>
                  <DropdownMenuButton.Item
                    onClick={() => onEdit(form._id, "responses")}
                  >
                    {tDropDownButton("responses")}
                  </DropdownMenuButton.Item>
                </DropdownMenuButton>
              </td>

              <td className={styles.tableData}>
                <button
                  onClick={() =>
                    handleShareClick(
                      `${window.location.origin}/forms/${form._id}`,
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
          formId={currentFormId}
        />
      )}
    </Page>
  );
};

export default Forms;
