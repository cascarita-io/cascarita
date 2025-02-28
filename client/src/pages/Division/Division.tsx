import { useState, useEffect } from "react";
import styles from "../pages.module.css";
import { useLocation, Outlet } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { DivisionType } from "./types";
import Search from "../../components/Search/Search";
// import SelectMenu from "../../components/SelectMenu/SelectMenu";
import Modal from "../../components/Modal/Modal";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useQueries } from "@tanstack/react-query";
import { getDivisionByGroupId } from "../../api/divisions/service";
import { getSeasonsByGroupId } from "../../api/seasons/services";
import DivisionForm from "../../components/Forms/DivisionForm/DivisionForm";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";
import Cookies from "js-cookie";

const Divisions = () => {
  const { t } = useTranslation("Divisions");

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

  const groupId = Number(Cookies.get("group_id")) || 0;

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handleDebounce);
    };
  }, [searchQuery]);

  const results = useQueries({
    queries: [
      {
        queryKey: ["seasons", groupId],
        queryFn: async () =>
          await getSeasonsByGroupId({
            queryKey: ["seasons", groupId],
            meta: undefined,
            signal: new AbortController().signal,
          }),
        enabled: groupId !== 0,
      },
      {
        queryKey: ["divisions", groupId],
        queryFn: async () =>
          await getDivisionByGroupId({
            queryKey: ["divisions", groupId],
            meta: undefined,
            signal: new AbortController().signal,
          }),
        enabled: groupId !== 0,
      },
    ],
  });

  const [seasonsQuery, divisionsQuery] = results;
  const data = divisionsQuery.data;
  const isLoading = divisionsQuery.isLoading;
  const isError = divisionsQuery.isError;

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
    division.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  const location = useLocation();
  const isTeamRoute = location.pathname.includes("team");
  if (isTeamRoute) {
    return <Outlet />;
  }

  return (
    <>
      <div className={styles.filterSearch}>
        <div className={styles.dropdown}>
          {data && data.length > 0 && (
            <Search onSearchChange={setSearchQuery} />
          )}
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
              seasonData={seasonsQuery.data}
            />
          </Modal.Content>
        </Modal>
      </div>

      {filteredData == null || filteredData?.length === 0 ? (
        <p className={styles.noItemsMessage}>{t("empty")}</p>
      ) : (
        <DashboardTable
          headers={[
            t("tableHeaders.name"),
            t("tableHeaders.leagueName"),
            t("tableHeaders.seasonName"),
            t("tableHeaders.options"),
          ]}
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
                <td className={styles.tableData}>{division.name}</td>
                <td className={styles.tableData}>{division.league_name}</td>
                <td className={styles.tableData}>{division.season_name}</td>
                <td className={styles.tableData}>
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
            seasonData={seasonsQuery.data}
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
    </>
  );
};

export default Divisions;
