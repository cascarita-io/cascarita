// Libraries
import { useTranslation } from "react-i18next";
import * as Avatar from "@radix-ui/react-avatar";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// Data Retrieval
import { fetchUser, getUsersByGroupId } from "../../api/users/service";

// Components
// import { useAuth } from "../../components/AuthContext/AuthContext";
import Page from "../../components/Page/Page";
import styles from "../pages.module.css";
import pagesStyles from "../pages.module.css";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import { User } from "./types";
import Search from "../../components/Search/Search";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Modal from "../../components/Modal/Modal";
import UserForm from "../../components/Forms/UserForm/UserForm";
import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "js-cookie";
import { FaPlus } from "react-icons/fa";

const Users = () => {
  // Confligure translation
  const { t } = useTranslation("Users");

  // State variables
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const email = Cookies.get("email") || "";
      const currentUser = await fetchUser(email, token);
      setCurrentUser(currentUser);
    })();
  }, []);

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();

  const groupId = currentUser?.group_id;

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", groupId ? groupId : 0],
    queryFn: getUsersByGroupId,
  });

  const formatName = (user: User) => {
    return `${user.first_name} ${user.last_name}`;
  };

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handleDebounce);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (users) {
      const filteredData = users.filter((user: User) => {
        const fullName = `${user.first_name.toLowerCase()} ${user.last_name.toLowerCase()}`;
        const query = debouncedQuery.toLowerCase();
        return (
          (fullName.includes(query) ||
            user.email.toLowerCase().includes(query)) &&
          user.email !== currentUser?.email
        ); // Exclude current user
      });
      setFilteredUsers(filteredData);
    }
  }, [users, debouncedQuery]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  return (
    <Page title={t("title")}>
      <div className={styles.filterSearch}>
        <div className={styles.dropdown}>
          <Search onSearchChange={setSearchQuery} />
        </div>
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
        </Modal>
      </div>

      {filteredUsers == null || filteredUsers.length == 0 ? (
        <p className={styles.noUsersMessage}>No users to display...</p>
      ) : (
        <DashboardTable headers={["Name", "Options"]} headerColor="light">
          {isLoading ? (
            <tr>
              <td>Loading...</td>
            </tr>
          ) : isError || !users ? (
            <tr>
              <td>Error Fetching Data</td>
            </tr>
          ) : (
            mockUsers?.map((user) => (
              <tr key={user.id} className={styles.tableRow}>
                <td className={styles.tableData}>
                  <Avatar.Root className="AvatarRoot">
                    <Avatar.Image
                      className={styles.avatar}
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                      alt={user.first_name + " " + user.last_name}
                    />
                    <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                      {user.first_name.charAt(0).toUpperCase() +
                        user.last_name.charAt(0).toUpperCase}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div style={{ display: "grid" }}>
                    <p>{`${user.first_name} ${user.last_name}`}</p>
                    <p style={{ fontSize: "0.7rem" }}>{`${user.role}`}</p>
                  </div>
                </td>
                <td className={styles.tableData}>
                  <DropdownMenuButton>
                    <DropdownMenuButton.Item
                      // @ts-expect-error - TODO: Remove these silencers once we start retrieving users from db

                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </DropdownMenuButton.Item>

                    <DropdownMenuButton.Separator
                      className={styles.separator}
                    />

                    <DropdownMenuButton.Item
                      // @ts-expect-error - TODO: Remove these silencers once we start retrieving users from db
                      onClick={() => handleDeleteUser(user)}
                    >
                      Delete
                    </DropdownMenuButton.Item>
                  </DropdownMenuButton>
                </td>
              </tr>
            ))
          )}
        </DashboardTable>
      )}

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
      </Modal>
    </Page>
  );
};

const mockUsers = [
  {
    id: 1,
    first_name: "Kelly",
    last_name: "Frazer",
    email: "kfrazer0@patch.com",
    role: "Food Chemist",
  },
  {
    id: 2,
    first_name: "Felix",
    last_name: "Magnay",
    email: "fmagnay1@bloglines.com",
    role: "Systems Administrator III",
  },
  {
    id: 3,
    first_name: "Nicolis",
    last_name: "McNirlan",
    email: "nmcnirlan2@google.de",
    role: "Electrical Engineer",
  },
  {
    id: 4,
    first_name: "Miltie",
    last_name: "Monelle",
    email: "mmonelle3@e-recht24.de",
    role: "Technical Writer",
  },
  {
    id: 5,
    first_name: "Benedetto",
    last_name: "Finder",
    email: "bfinder4@ameblo.jp",
    role: "Senior Cost Accountant",
  },
  {
    id: 6,
    first_name: "Gaynor",
    last_name: "Hehir",
    email: "ghehir5@imdb.com",
    role: "Accountant I",
  },
  {
    id: 7,
    first_name: "Madelina",
    last_name: "Grebbin",
    email: "mgrebbin6@amazon.com",
    role: "Product Engineer",
  },
  {
    id: 8,
    first_name: "Sherri",
    last_name: "Assandri",
    email: "sassandri7@cdc.gov",
    role: "Community Outreach Specialist",
  },
  {
    id: 9,
    first_name: "Hale",
    last_name: "Cannon",
    email: "hcannon8@deviantart.com",
    role: "Senior Cost Accountant",
  },
  {
    id: 10,
    first_name: "Levi",
    last_name: "Auchinleck",
    email: "lauchinleck9@sina.com.cn",
    role: "Speech Pathologist",
  },
  {
    id: 11,
    first_name: "Albina",
    last_name: "Abba",
    email: "aabbaa@technorati.com",
    role: "GIS Technical Architect",
  },
  {
    id: 12,
    first_name: "Sallyanne",
    last_name: "Emanueli",
    email: "semanuelib@home.pl",
    role: "Software Test Engineer I",
  },
  {
    id: 13,
    first_name: "Nessy",
    last_name: "Winspear",
    email: "nwinspearc@google.com",
    role: "Human Resources Assistant III",
  },
  {
    id: 14,
    first_name: "Albina",
    last_name: "Abba",
    email: "aabbaa@technorati.com",
    role: "GIS Technical Architect",
  },
  {
    id: 15,
    first_name: "Sallyanne",
    last_name: "Emanueli",
    email: "semanuelib@home.pl",
    role: "Software Test Engineer I",
  },
  {
    id: 16,
    first_name: "Nessy",
    last_name: "Winspear",
    email: "nwinspearc@google.com",
    role: "Human Resources Assistant III",
  },
];

export default Users;
