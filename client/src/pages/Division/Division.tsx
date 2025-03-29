import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";
import { Outlet, useLocation } from "react-router-dom";

import { useGetDivisionsByGroupId } from "../../api/divisions/query";
import { useGetSeasonsByGroupId } from "../../api/seasons/query";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import DivisionForm from "../../components/Forms/DivisionForm/DivisionForm";
import { useGroup } from "../../components/GroupProvider/GroupProvider";
// import SelectMenu from "../../components/SelectMenu/SelectMenu";
import Modal from "../../components/Modal/Modal";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Search from "../../components/Search/Search";
import styles from "../pages.module.css";
// import { useTranslation } from "react-i18next";
import { DivisionType } from "./types";

const Divisions = () => {
  const { t } = useTranslation("Divisions");

  // const [filter, setFilter] = useState("");
  // const [sorts, setSorts] = useState("");
  const [currentDivisionName, setCurrentDivisionName] = useState("");
  const [currentDivisionId, setCurrentDivisionId] = useState(0);
  const [currentSeasonId, setCurrentSeasonId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // const filterStatuses = [t("filterOptions.item1"), t("filterOptions.item2")];
  // const sortStatuses = [t("sortOptions.item1"), t("sortOptions.item2")];
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { groupId } = useGroup();

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handleDebounce);
    };
  }, [searchQuery]);

  const { data: seasons } = useGetSeasonsByGroupId(groupId);
  const { data: divisions } = useGetDivisionsByGroupId(groupId);

  const handleEdit = (
    divisionName: string,
    divisionId: number,
    seasonId: number,
  ) => {
    setCurrentDivisionName(divisionName);
    setCurrentDivisionId(divisionId);
    setCurrentSeasonId(seasonId);
    setIsEditOpen(true);
  };

  const handleDelete = (divisionName: string, divisionId: number) => {
    setCurrentDivisionName(divisionName);
    setCurrentDivisionId(divisionId);
    setIsDeleteOpen(true);
  };

  const filteredData = divisions?.filter((division: DivisionType) =>
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
          {divisions && divisions.length > 0 && (
            <Search onSearchChange={setSearchQuery} />
          )}
        </div>

        <Modal open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <Modal.Button asChild className={styles.modalTrigger}>
            <PrimaryButton
              className={styles.primaryBtn}
              onClick={() => setIsCreateOpen(true)}>
              <p className={styles.btnTextDesktop}>{t("addButton")}</p>
              <FaPlus className={styles.btnTextMobile} />
            </PrimaryButton>
          </Modal.Button>
          <Modal.Content title={t("formContent.title")}>
            <DivisionForm
              afterSave={() => setIsCreateOpen(false)}
              requestType="POST"
              seasonData={seasons}
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
          headerColor="light">
          {filteredData?.map((division: DivisionType, idx: number) => (
            <tr key={idx} className={styles.tableRow}>
              <td className={styles.tableData}>{division.name}</td>
              <td className={styles.tableData}>{division.league_name}</td>
              <td className={styles.tableData}>{division.season_name}</td>
              <td className={styles.tableData}>
                <DropdownMenuButton>
                  <DropdownMenuButton.Item
                    onClick={() =>
                      handleEdit(division.name, division.id, division.season_id)
                    }>
                    {t("edit")}
                  </DropdownMenuButton.Item>

                  <DropdownMenuButton.Separator className={styles.separator} />

                  <DropdownMenuButton.Item
                    onClick={() => handleDelete(division.name, division.id)}>
                    {t("delete")}
                  </DropdownMenuButton.Item>
                </DropdownMenuButton>
              </td>
            </tr>
          ))}
        </DashboardTable>
      )}

      <Modal open={isEditOpen} onOpenChange={setIsEditOpen}>
        <Modal.Content title={`${t("edit")} ${currentDivisionName}`}>
          <DivisionForm
            afterSave={() => setIsEditOpen(false)}
            requestType="PATCH"
            divisionId={currentDivisionId}
            divisionName={currentDivisionName}
            seasonId={currentSeasonId}
            seasonData={seasons}
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
