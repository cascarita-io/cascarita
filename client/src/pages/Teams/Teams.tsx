import { useState, useEffect } from "react";
import styles from "../pages.module.css";
import Search from "../../components/Search/Search";
// import SelectMenu from "../../components/SelectMenu/SelectMenu";
import Modal from "../../components/Modal/Modal";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { getTeamsByGroupId } from "../../api/teams/service";
import { getSeasonsByGroupId } from "../../api/seasons/services";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import { useQueries } from "@tanstack/react-query";
import { TeamType } from "./types";
import { getDivisionByGroupId } from "../../api/divisions/service";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import TeamForm from "../../components/Forms/TeamsForm/TeamForm";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";
import Cookies from "js-cookie";
import { DummyImage } from "react-simple-placeholder-image";

const Teams = () => {
  const { t } = useTranslation("Teams");
  // const [sorts, setSorts] = useState("");
  const [currentTeamName, setCurrentTeamName] = useState("");
  const [currentTeamId, setCurrentTeamId] = useState(0);
  const [currentDivisionId, setCurrentDivisionId] = useState(0);
  const [currentSeasonId, setCurrentSeasonId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const groupId = Number(Cookies.get("group_id")) || 0;

  const results = useQueries({
    queries: [
      {
        queryKey: ["teams", groupId],
        queryFn: async () =>
          await getTeamsByGroupId({
            queryKey: ["teams", groupId],
            meta: undefined,
            signal: new AbortController().signal,
          }),
        enabled: groupId !== 0,
      },
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

  const [teamsQuery, seasonsQuery, divisionsQuery] = results;
  const data = teamsQuery.data;
  const isLoading = teamsQuery.isLoading;
  const isError = teamsQuery.isError;

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handleDebounce);
    };
  }, [searchQuery]);

  const handleEdit = (
    teamName: string,
    teamId: number,
    divisionId: number,
    seasonId: number
  ) => {
    setCurrentTeamName(teamName);
    setCurrentTeamId(teamId);
    setCurrentDivisionId(divisionId);
    setCurrentSeasonId(seasonId);
    setIsEditOpen(true);
  };

  const handleDelete = (teamName: string, teamId: number) => {
    setCurrentTeamName(teamName);
    setCurrentTeamId(teamId);
    setIsDeleteOpen(true);
  };

  const filteredData = data?.filter((team: TeamType) =>
    team.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <section className={styles.wrapper}>
      <div className={styles.sectionWrapper}>
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
              <TeamForm
                afterSave={() => setIsCreateOpen(false)}
                divisionsData={divisionsQuery.data}
                seasonsData={seasonsQuery.data}
                requestType="POST"
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
              t("tableHeaders.season"),
              t("tableHeaders.division"),
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
              data?.map((team: TeamType, idx: number) => (
                <tr key={idx} className={styles.tableRow}>
                  <td className={styles.tableData}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {team.team_logo ? (
                        <img
                          style={{
                            width: "75px",
                            height: "75px",
                          }}
                          src={team.team_logo}
                          alt={team.name}
                        />
                      ) : (
                        <DummyImage width={75} height={75} shape="image" />
                      )}
                      {team.name}
                    </div>
                  </td>
                  <td>
                    {team.season_name || <span>Not linked to season</span>}
                  </td>
                  <td>
                    {team.division_name || <span>Not linked to season</span>}
                  </td>
                  <td>
                    <DropdownMenuButton>
                      <DropdownMenuButton.Item
                        onClick={() =>
                          handleEdit(
                            team.name,
                            team.id,
                            team.division_id,
                            team.season_id
                          )
                        }
                      >
                        {t("edit")}
                      </DropdownMenuButton.Item>

                      <DropdownMenuButton.Separator
                        className={styles.separator}
                      />

                      <DropdownMenuButton.Item
                        onClick={() => handleDelete(team.name, team.id)}
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
          <Modal.Content title={`${t("edit")} ${currentTeamName}`}>
            <TeamForm
              afterSave={() => setIsEditOpen(false)}
              requestType="PATCH"
              divisionsData={divisionsQuery.data}
              seasonsData={seasonsQuery.data}
              name={currentTeamName}
              division_id={currentDivisionId}
              season_id={currentSeasonId}
              teamId={currentTeamId}
            />
          </Modal.Content>
        </Modal>

        <Modal open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <Modal.Content title={`${t("delete")} ${currentTeamName}`}>
            <TeamForm
              afterSave={() => setIsDeleteOpen(false)}
              requestType="DELETE"
              teamId={currentTeamId}
            />
          </Modal.Content>
        </Modal>
      </div>
    </section>
  );
};

export default Teams;
