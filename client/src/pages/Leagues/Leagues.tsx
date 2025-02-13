import styles from "../pages.module.css";
import Search from "../../components/Search/Search";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import Page from "../../components/Page/Page";
// import SelectMenu from "../../components/SelectMenu/SelectMenu";
import Modal from "../../components/Modal/Modal";
import LeagueForm from "../../components/Forms/LeagueForm/LeagueForm";
import { LeagueType } from "./types";
import { useQuery } from "@tanstack/react-query";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLeagueByGroupId } from "../../api/leagues/service";
import { Link, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchUser } from "../../api/users/service";
import { FaPlus } from "react-icons/fa";

const Leagues = () => {
  const { t } = useTranslation("Leagues");

  // const [filter, setFilter] = useState("");
  // const [sorts, setSorts] = useState("");
  const [currentLeagueName, setCurrentLeagueName] = useState("");
  const [currentLeagueId, setCurrentLeagueId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { getAccessTokenSilently } = useAuth0();
  const [groupId, setGroupId] = useState<null | number>(null);

  // const filterStatuses = [t("filterOptions.item1"), t("filterOptions.item2")];
  // const sortStatuses = [t("sortOptions.item1"), t("sortOptions.item2")];
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const email = Cookies.get("email") || "";
      const currentUser = await fetchUser(email, token);
      setGroupId(currentUser.group_id);
    })();
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["leagues", groupId ? groupId : 0],
    queryFn: getLeagueByGroupId,
  });

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handleDebounce);
    };
  }, [searchQuery]);

  const handleEdit = (leagueName: string, leagueId: number) => {
    setCurrentLeagueName(leagueName);
    setCurrentLeagueId(leagueId);
    setIsEditOpen(true);
  };

  const handleDelete = (leagueName: string, leagueId: number) => {
    setCurrentLeagueName(leagueName);
    setCurrentLeagueId(leagueId);
    setIsDeleteOpen(true);
  };

  const filteredData = data?.filter((league: LeagueType) =>
    league.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const location = useLocation();
  const isLeagueRoute = location.pathname.includes("league");

  if (isLeagueRoute) {
    return <Outlet />;
  }

  return (
    <Page title={t("title")}>
      <div className={styles.filterSearch}>
        {/*TODO: Create a reusable component for Filter and Search  */}
        <div className={styles.dropdown}>
          <Search onSearchChange={setSearchQuery} />
        </div>

        <Modal open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <Modal.Button asChild className={styles.modalTrigger}>
            <PrimaryButton
              className={styles.primaryBtn}
              onClick={() => setIsCreateOpen(true)}
            >
              <p className={styles.btnTextDesktop}>{t("button")}</p>
              <FaPlus className={styles.btnTextMobile} />
            </PrimaryButton>
          </Modal.Button>
          <Modal.Content title={t("formContent.title")}>
            <LeagueForm
              afterSave={() => setIsCreateOpen(false)}
              requestType="POST"
            />
          </Modal.Content>
        </Modal>
      </div>

      {filteredData == null || filteredData?.length === 0 ? (
        <p className={styles.noItemsMessage}>{t("empty")}</p>
      ) : (
        <DashboardTable
          headers={[t("tableHeaders.name"), t("tableHeaders.options")]}
          headerColor="light"
        >
          {isLoading ? (
            <tr>
              <td>{t("loading")}</td>
            </tr>
          ) : isError || !data ? (
            <tr>
              <td>{t("error")}</td>
            </tr>
          ) : (
            filteredData?.map((league: LeagueType, idx: number) => (
              <tr key={idx} className={styles.tableRow}>
                <td className={styles.tableData}>
                  <Link to={`/season/${league.id}/${league.name}`}>
                    {league.name}
                  </Link>
                </td>
                <td className={styles.tableData}>
                  <DropdownMenuButton>
                    <DropdownMenuButton.Item
                      onClick={() => handleEdit(league.name, league.id)}
                    >
                      {t("edit")}
                    </DropdownMenuButton.Item>

                    <DropdownMenuButton.Separator
                      className={styles.separator}
                    />

                    <DropdownMenuButton.Item
                      onClick={() => handleDelete(league.name, league.id)}
                    >
                      {t("delete")}
                    </DropdownMenuButton.Item>
                  </DropdownMenuButton>
                </td>
              </tr>
            ))
          )}
        </DashboardTable>
      )}

      <Modal open={isEditOpen} onOpenChange={setIsEditOpen}>
        <Modal.Content title={`${t("edit")} ${currentLeagueName}`}>
          <LeagueForm
            afterSave={() => setIsEditOpen(false)}
            requestType="PATCH"
            leagueId={currentLeagueId}
          />
        </Modal.Content>
      </Modal>

      <Modal open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <Modal.Content title={`${t("delete")} ${currentLeagueName}`}>
          <LeagueForm
            afterSave={() => setIsDeleteOpen(false)}
            requestType="DELETE"
            leagueId={currentLeagueId}
          />
        </Modal.Content>
      </Modal>
    </Page>
  );
};

export default Leagues;
