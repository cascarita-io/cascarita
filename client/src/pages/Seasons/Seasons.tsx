import Search from "../../components/Search/Search";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import Page from "../../components/Page/Page";
import SelectMenu from "../../components/SelectMenu/SelectMenu";
import Modal from "../../components/Modal/Modal";
import SeasonForm from "../../components/Forms/SeasonForm/SeasonForm";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSeasonsByLeagueId } from "../../api/seasons/services";
import { SeasonType } from "./types";
import styles from "../pages.module.css";
import { useLocation } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const Seasons = () => {
  const { leagueId, leagueName } = useParams<{
    leagueId: string;
    leagueName: string;
  }>();
  const leagueIdNumber = leagueId ? parseInt(leagueId, 10) : 0;

  const { t } = useTranslation("Seasons");

  // const [filter, setFilter] = useState("");
  const [sorts, setSorts] = useState("");
  const [currentSeasonName, setCurrentSeasonName] = useState("");
  const [currentSeasonId, setCurrentSeasonId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // const filterStatuses = [t("filterOptions.item1"), t("filterOptions.item2")];
  const sortStatuses = [t("sortOptions.item1"), t("sortOptions.item2")];
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["seasons", leagueIdNumber],
    queryFn: getSeasonsByLeagueId,
  });

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handleDebounce);
    };
  }, [searchQuery]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const handleEdit = (seasonName: string, seasonId: number) => {
    setCurrentSeasonName(seasonName);
    setCurrentSeasonId(seasonId);
    setIsEditOpen(true);
  };

  const handleDelete = (seasonName: string, seasonId: number) => {
    setCurrentSeasonName(seasonName);
    setCurrentSeasonId(seasonId);
    setIsDeleteOpen(true);
  };

  const filteredData = data
    ?.filter((season: SeasonType) =>
      season.name.toLowerCase().includes(debouncedQuery.toLowerCase())
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

  const location = useLocation();
  const isDivisionRoute = location.pathname.includes("division");

  if (isDivisionRoute) {
    return <Outlet />;
  }

  return (
    <Page title={leagueName}>
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
            <SeasonForm
              afterSave={() => setIsCreateOpen(false)}
              requestType="POST"
              leagueId={leagueIdNumber}
            />
          </Modal.Content>
        </Modal>
      </div>

      {filteredData == null || filteredData?.length === 0 ? (
        <p className={styles.noItemsMessage}>{t("empty")}</p>
      ) : (
        <DashboardTable
          headers={[t("col1"), t("col2"), t("col3"), t("col4")]}
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
            filteredData?.map((season: SeasonType, idx: number) => (
              <tr key={idx} className={styles.tableRow}>
                <td className={styles.tableData}>
                  <Link to={`division/${season.id}/${season.name}`}>
                    {season.name}
                  </Link>
                </td>
                <td className={styles.tableData}>
                  {formatDate(season.start_date)}
                </td>
                <td className={styles.tableData}>
                  {formatDate(season.end_date)}
                </td>
                <td>
                  <DropdownMenuButton>
                    <DropdownMenuButton.Item
                      onClick={() => handleEdit(season.name, season.id)}
                    >
                      {t("edit")}
                    </DropdownMenuButton.Item>

                    <DropdownMenuButton.Separator
                      className={styles.separator}
                    />

                    <DropdownMenuButton.Item
                      onClick={() => handleDelete(season.name, season.id)}
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
        <Modal.Content title={`${t("edit")} ${currentSeasonName}`}>
          <SeasonForm
            afterSave={() => setIsEditOpen(false)}
            requestType="PATCH"
            seasonId={currentSeasonId}
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
    </Page>
  );
};

export default Seasons;
