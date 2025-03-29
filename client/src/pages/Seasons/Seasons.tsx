import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";

import { useGetLeaguesByGroupId } from "../../api/leagues/query";
import { useGetSeasonsByGroupId } from "../../api/seasons/query";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import SeasonForm from "../../components/Forms/SeasonForm/SeasonForm";
import { useGroup } from "../../components/GroupProvider/GroupProvider";
import Modal from "../../components/Modal/Modal";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Search from "../../components/Search/Search";
import SelectMenu from "../../components/SelectMenu/SelectMenu";
import styles from "../pages.module.css";
import { SeasonType } from "./types";

const Seasons = () => {
  const { t } = useTranslation("Seasons");

  // const [filter, setFilter] = useState("");
  const [sorts, setSorts] = useState("");
  const [currentSeasonName, setCurrentSeasonName] = useState("");
  const [currentSeasonId, setCurrentSeasonId] = useState(0);
  const [currentSeasonLeagueId, setCurrentSeasonLeagueId] = useState(0);
  const [currentSeasonStartDate, setCurrentSeasonStartDate] = useState("");
  const [currentSeasonEndDate, setCurrentSeasonEndDate] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const sortStatuses = [t("sortOptions.item1"), t("sortOptions.item2")];
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { groupId } = useGroup();

  const {
    data: seasons,
    isLoading: isSeasonsLoading,
    isError: isSeasonsError,
  } = useGetSeasonsByGroupId(groupId);
  const { data: leagues } = useGetLeaguesByGroupId(groupId);

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handleDebounce);
    };
  }, [searchQuery]);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = (
    seasonName: string,
    seasonId: number,
    seasonLeagueId: number,
    seasonStartDate: string,
    seasonEndDate: string,
  ) => {
    setCurrentSeasonName(seasonName);
    setCurrentSeasonId(seasonId);
    setCurrentSeasonLeagueId(Number(seasonLeagueId));
    setCurrentSeasonStartDate(seasonStartDate);
    setCurrentSeasonEndDate(seasonEndDate);
    setIsEditOpen(true);
  };

  const handleDelete = (seasonName: string, seasonId: number) => {
    setCurrentSeasonName(seasonName);
    setCurrentSeasonId(seasonId);
    setIsDeleteOpen(true);
  };

  const filteredSeasons = seasons
    ?.filter((season: SeasonType) =>
      season.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    )
    ?.sort((a: SeasonType, b: SeasonType) => {
      if (sorts === t("sortOptions.item1")) {
        return a.name.localeCompare(b.name);
      } else if (sorts === t("sortOptions.item2")) {
        return (
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );
      }
      return 0;
    });

  return (
    <>
      <div className={styles.filterSearch}>
        <div className={styles.dropdown}>
          {seasons && seasons.length > 0 && (
            <Search onSearchChange={setSearchQuery} />
          )}

          {seasons && seasons.length > 0 && (
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
            </div>
          )}
        </div>

        <Modal open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <Modal.Button asChild className={styles.modalTrigger}>
            <PrimaryButton
              className={styles.primaryBtn}
              onClick={() => setIsCreateOpen(true)}>
              <p className={styles.btnTextDesktop}>{t("button")}</p>
              <FaPlus className={styles.btnTextMobile} />
            </PrimaryButton>
          </Modal.Button>
          <Modal.Content title={t("formContent.title")}>
            <SeasonForm
              afterSave={() => setIsCreateOpen(false)}
              requestType="POST"
              leagueData={leagues}
            />
          </Modal.Content>
        </Modal>
      </div>

      {filteredSeasons == null || filteredSeasons?.length === 0 ? (
        <p className={styles.noItemsMessage}>{t("empty")}</p>
      ) : (
        <DashboardTable
          headers={[t("col1"), t("col2"), t("col3"), t("col4"), t("col5")]}
          headerColor="light">
          {isSeasonsLoading ? (
            <tr>
              <td>{t("loading")}</td>
            </tr>
          ) : isSeasonsError || !seasons ? (
            <tr>
              <td>{t("error")}</td>
            </tr>
          ) : (
            filteredSeasons?.map((season: SeasonType, idx: number) => (
              <tr key={idx} className={styles.tableRow}>
                <td className={styles.tableData}>{season.name}</td>
                <td className={styles.tableData}>{season.league_name}</td>
                <td className={styles.tableData}>
                  {formatDate(season.start_date)}
                </td>
                <td className={styles.tableData}>
                  {formatDate(season.end_date)}
                </td>
                <td>
                  <DropdownMenuButton>
                    <DropdownMenuButton.Item
                      onClick={() =>
                        handleEdit(
                          season.name,
                          season.id,
                          season.league_id,
                          season.start_date,
                          season.end_date,
                        )
                      }>
                      {t("edit")}
                    </DropdownMenuButton.Item>

                    <DropdownMenuButton.Separator
                      className={styles.separator}
                    />

                    <DropdownMenuButton.Item
                      onClick={() => handleDelete(season.name, season.id)}>
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
        <Modal.Content title={`${t("edit")} ${currentSeasonName}`}>
          <SeasonForm
            afterSave={() => setIsEditOpen(false)}
            requestType="PATCH"
            seasonId={currentSeasonId}
            seasonName={currentSeasonName}
            seasonLeagueId={currentSeasonLeagueId}
            seasonStartDate={currentSeasonStartDate}
            seasonEndDate={currentSeasonEndDate}
            leagueData={leagues}
          />
        </Modal.Content>
      </Modal>

      <Modal open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <Modal.Content title={`${t("delete")} ${currentSeasonName}`}>
          <SeasonForm
            afterSave={() => setIsDeleteOpen(false)}
            requestType="DELETE"
            seasonId={currentSeasonId}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default Seasons;
