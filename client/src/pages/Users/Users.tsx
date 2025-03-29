import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
// import Modal from "../../components/Modal/Modal";
// import UserForm from "../../components/Forms/UserForm/UserForm";
import { FaUser } from "react-icons/fa";

import { Avatar } from "@radix-ui/themes";

import { useGetUsersByGroupId } from "../../api/users/query";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import { useGroup } from "../../components/GroupProvider/GroupProvider";
import Page from "../../components/Page/Page";
import Search from "../../components/Search/Search";
import useResponsiveHeader from "../../hooks/useResponsiveHeader";
import styles from "../pages.module.css";
import pagesStyles from "../pages.module.css";
// import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import { User } from "./types";

const Users = () => {
  const { t } = useTranslation("Users");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  // const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  // const [isEditOpen, setIsEditOpen] = useState(false);
  // const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  // // const [selectedUser, setSelectedUser] = useState<User>();

  const { groupId } = useGroup();
  const tableHeaders = useResponsiveHeader(
    ["Name", "Role", "Email"],
    ["Name", "Email"],
  );

  const { data: users, isLoading, isError } = useGetUsersByGroupId(groupId);

  // const formatName = (user: User) => {
  //   return `${user.first_name} ${user.last_name}`;
  // };

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handleDebounce);
    };
  }, [searchQuery]);

  // //TODO: UNCOMMENT ONCE WE CAN ADD USERS
  // const handleEditUser = (user: User) => {
  //   setSelectedUser(user);
  //   setIsEditOpen(true);
  // };

  // const handleDeleteUser = (user: User) => {
  //   setSelectedUser(user);
  //   setIsDeleteOpen(true);
  // };

  const filteredUsers = users?.filter((user: User) => {
    const fullName = `${user.first_name.toLowerCase()} ${user.last_name.toLowerCase()}`;
    const query = debouncedQuery.toLowerCase();
    return fullName.includes(query) || user.email.toLowerCase().includes(query);
  });

  return (
    <Page title={t("title")}>
      <div className={styles.filterSearch}>
        <div className={styles.dropdown}>
          <Search onSearchChange={setSearchQuery} />
        </div>
        {/* //TODO: UNCOMMENT ONCE WE CAN ADD USERS
        <Modal open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <Modal.Button asChild className={pagesStyles.modalTrigger}>
            <PrimaryButton
              className={pagesStyles.primaryBtn}
              onClick={() => setIsAddUserOpen(true)}
            >
              <p className={pagesStyles.btnTextDesktop}>{t("addUser")}</p>
              <FaPlus className={pagesStyles.btnTextMobile} />
            </PrimaryButton>
          </Modal.Button>
          <Modal.Content title="Add User">
            <UserForm
              afterSave={() => setIsAddUserOpen(false)}
              requestType="POST"
              selectedUserId={selectedUser?.id}
              parentUserGroupId={groupId}
            />
          </Modal.Content>
        </Modal> */}
      </div>

      {filteredUsers == null || filteredUsers.length == 0 ? (
        <p className={pagesStyles.noItemsMessage}>No users to display...</p>
      ) : (
        <DashboardTable headers={tableHeaders} headerColor="light">
          {isLoading ? (
            <tr>
              <td>Loading...</td>
            </tr>
          ) : isError || !users ? (
            <tr>
              <td>Error Fetching Data</td>
            </tr>
          ) : (
            filteredUsers?.map((user: User) => (
              <tr key={user.id} className={styles.tableRow}>
                <td className={styles.tableData}>
                  <Avatar
                    src={user && user.picture}
                    className={styles.avatar}
                    alt={user.first_name + " " + user.last_name}
                    fallback={
                      <div className={styles.avatarFallback}>
                        <FaUser />
                      </div>
                    }
                  />

                  <div style={{ display: "grid" }}>
                    <p>{`${user.first_name} ${user.last_name}`}</p>
                    <p
                      className={styles.showInMobile}
                      style={{ fontSize: "0.7rem" }}>
                      {user.user_roles?.length > 0
                        ? user.user_roles?.join(", ")
                        : "No Role Given"}
                    </p>
                  </div>
                </td>

                <td className={`${styles.tableData} ${styles.showInDesktop}`}>
                  {user?.user_roles?.length > 0
                    ? user.user_roles?.join(", ")
                    : "No Role"}
                </td>

                <td className={`${styles.tableData} `}>{user.email}</td>
                {/* //TODO: UNCOMMENT ONCE WE CAN ADD USERS
                <td className={styles.tableData}>
                  <DropdownMenuButton>
                    <DropdownMenuButton.Item
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </DropdownMenuButton.Item>

                    <DropdownMenuButton.Separator
                      className={styles.separator}
                    />

                    <DropdownMenuButton.Item
                      onClick={() => handleDeleteUser(user)}
                    >
                      Delete
                    </DropdownMenuButton.Item>
                  </DropdownMenuButton>
                </td> */}
              </tr>
            ))
          )}
        </DashboardTable>
      )}

      {/* //TODO: UNCOMMENT ONCE WE CAN ADD USERS
       <Modal open={isEditOpen} onOpenChange={setIsEditOpen}>
        <Modal.Content
          title={`Edit ${selectedUser ? formatName(selectedUser) : ""}`}
        >
          <UserForm
            afterSave={() => setIsEditOpen(false)}
            requestType="PATCH"
            selectedUserId={selectedUser?.id}
            parentUserGroupId={groupId}
          />
        </Modal.Content>
      </Modal>
      <Modal open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <Modal.Content
          title={`Delete ${selectedUser ? formatName(selectedUser) : ""}`}
        >
          <UserForm
            afterSave={() => setIsDeleteOpen(false)}
            requestType="DELETE"
            selectedUserId={selectedUser?.id}
          />
        </Modal.Content>
      </Modal> */}
    </Page>
  );
};

export default Users;
