import { useState, useEffect } from "react";
import styles from "../pages.module.css";
import { useParams, Link, useLocation, Outlet } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { DivisionType } from "./types";
import Page from "../../components/Page/Page";
import Search from "../../components/Search/Search";
// import SelectMenu from "../../components/SelectMenu/SelectMenu";
import Modal from "../../components/Modal/Modal";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useQuery } from "@tanstack/react-query";
import { getDivisionsBySeasonId } from "../../api/divisions/service";
import DivisionForm from "../../components/Forms/DivisionForm/DivisionForm";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";

const Divisions = () => {
  const { t } = useTranslation("Divisions");
  const { seasonId } = useParams<{ seasonId: string }>();
  const { seasonName } = useParams<{ seasonName: string }>();
  const seasonIdNumber = seasonId ? parseInt(seasonId, 10) : 0;

  // const { t } = useTranslation("Leagues");

  // const [filter, setFilter] = useState("");
  // const [sorts, setSorts] = useState("");
  const [currentDivisionName, setCurrentDivisionName] = useState("");
  const [currentDivisionId, setCurrentDivisionId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // const filterStatuses = [t("filterOptions.item1"), t("filterOptions.item2")];
  // const sortStatuses = [t("sortOptions.item1"), t("sortOptions.item2")];
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handleDebounce);
    };
  }, [searchQuery]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["divisions", seasonIdNumber],
    queryFn: getDivisionsBySeasonId,
  });

  const handleEdit = (divisionName: string, divisionId: number) => {
    setCurrentDivisionName(divisionName);
    setCurrentDivisionId(divisionId);
    setIsEditOpen(true);
  };

  const handleDelete = (divisionName: string, divisionId: number) => {
    setCurrentDivisionName(divisionName);
    setCurrentDivisionId(divisionId);
    setIsDeleteOpen(true);
  };

  const filteredData = data?.filter((division: DivisionType) =>
    division.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const location = useLocation();
  const isTeamRoute = location.pathname.includes("team");
  if (isTeamRoute) {
    return <Outlet />;
  }

  return (
    <Page title={seasonName}>
      <div className={styles.filterSearch}>
        <div className={styles.dropdown}>
          <Search onSearchChange={setSearchQuery} />
          {/* NOTE: WILL UNCOMMENT ONCE ACTIVE STATUS ADDED TO VIEW
            <div className={styles.filterContainer}>
            <p className={styles.filterSubTitle}>{t("filter")}</p>
            <SelectMenu
              placeholder={t("filterOptions.item1")}
              name="filter"
              value={filter}
              onValueChange={(value) => setFilter(value)}>
              <SelectMenu.Group>
                {filterStatuses.map((status, idx) => (
                  <SelectMenu.Item key={idx} value={status}>
                    {status}
                  </SelectMenu.Item>
                ))}
              </SelectMenu.Group>
            </SelectMenu>
          </div>

          <div className={styles.filterContainer}>
            <p className={styles.filterSubTitle}>{t("sort")}</p>
            <SelectMenu
              placeholder={t("sortOptions.item1")}
              name="sorts"
              value={sorts}
              onValueChange={(value) => setSorts(value)}>
              <SelectMenu.Group>
                {sortStatuses.map((status, idx) => (
                  <SelectMenu.Item key={idx} value={status}>
                    {status}
                  </SelectMenu.Item>
                ))}
              </SelectMenu.Group>
            </SelectMenu>
          </div> */}
        </div>

        <Modal open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <Modal.Button asChild className={styles.modalTrigger}>
            <PrimaryButton
              className={styles.primaryBtn}
              onClick={() => setIsCreateOpen(true)}
            >
              <p className={styles.btnTextDesktop}>{t("addButton")}</p>
              <FaPlus className={styles.btnTextMobile} />
            </PrimaryButton>
          </Modal.Button>
          <Modal.Content title={t("formContent.title")}>
            <DivisionForm
              afterSave={() => setIsCreateOpen(false)}
              requestType="POST"
              seasonId={seasonIdNumber}
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
            data?.map((division: DivisionType, idx: number) => (
              <tr key={idx} className={styles.tableRow}>
                <td className={styles.tableData}>
                  <Link
                    to={`teams/seasons/${seasonIdNumber}/division/${division.id}/${division.name}`}
                  >
                    {division.name}
                  </Link>
                </td>
                <td>
                  <DropdownMenuButton>
                    <DropdownMenuButton.Item
                      onClick={() => handleEdit(division.name, division.id)}
                    >
                      {t("edit")}
                    </DropdownMenuButton.Item>

                    <DropdownMenuButton.Separator
                      className={styles.separator}
                    />

                    <DropdownMenuButton.Item
                      onClick={() => handleDelete(division.name, division.id)}
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
        <Modal.Content title={`${t("edit")} ${currentDivisionName}`}>
          <DivisionForm
            afterSave={() => setIsEditOpen(false)}
            requestType="PATCH"
            divisionId={currentDivisionId}
          />
        </Modal.Content>
      </Modal>

      <Modal open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <Modal.Content title={`${t("delete")} ${currentDivisionName}`}>
          <DivisionForm
            afterSave={() => setIsDeleteOpen(false)}
            requestType="DELETE"
            divisionId={currentDivisionId}
          />
        </Modal.Content>
      </Modal>
    </Page>
  );
};

export default Divisions;
