import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";

import { Avatar } from "@radix-ui/themes";

import { useGetSeasonsByGroupId } from "../../api/seasons/query";
import { useGetTeamsByGroupId } from "../../api/teams/query";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import TeamForm from "../../components/Forms/TeamsForm/TeamForm";
import { useGroup } from "../../components/GroupProvider/GroupProvider";
// import SelectMenu from "../../components/SelectMenu/SelectMenu";
import Modal from "../../components/Modal/Modal";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Search from "../../components/Search/Search";
import styles from "../pages.module.css";
import { TeamType } from "./types";

const Teams = () => {
  const { t } = useTranslation("Teams");
  // const [sorts, setSorts] = useState("");
  const [currentTeamName, setCurrentTeamName] = useState("");
  const [currentTeamId, setCurrentTeamId] = useState(0);
  const [currentTeamSeasonId, setCurrentTeamSeasonId] = useState(0);
  const [currentTeamDivisionId, setCurrentTeamDivisionId] = useState(0);
  const [currentTeamLogo, setCurrentTeamLogo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { groupId } = useGroup();

  const { data: teams, isLoading, isError } = useGetTeamsByGroupId(groupId);
  const { data: seasons } = useGetSeasonsByGroupId(groupId);

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
    seasonId: number,
    divisionId: number,
    teamLogo: string,
  ) => {
    setCurrentTeamName(teamName);
    setCurrentTeamId(teamId);
    setCurrentTeamSeasonId(seasonId);
    setCurrentTeamDivisionId(divisionId);
    setCurrentTeamLogo(teamLogo);
    setIsEditOpen(true);
  };

  const handleDelete = (teamName: string, teamId: number) => {
    setCurrentTeamName(teamName);
    setCurrentTeamId(teamId);
    setIsDeleteOpen(true);
  };

  const filteredData = teams?.filter((team: TeamType) =>
    team.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  return (
    <>
      <div className={styles.filterSearch}>
        <div className={styles.dropdown}>
          {teams && teams.length > 0 && (
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
            <TeamForm
              afterSave={() => setIsCreateOpen(false)}
              seasonsData={seasons}
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
          headerColor="light">
          {isLoading ? (
            <tr>
              <td>{t("loading")}</td>
            </tr>
          ) : isError || !teams ? (
            <tr>
              <td>{t("error")}</td>
            </tr>
          ) : (
            filteredData?.map((team: TeamType, idx: number) => (
              <tr key={idx} className={styles.tableRow}>
                <td className={styles.tableData}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}>
                    <Avatar
                      src={team && team.team_logo}
                      className={styles.avatar}
                      fallback={
                        <div className={styles.avatarFallback}>
                          <FaUsers />
                        </div>
                      }
                      radius="full"
                      size={"4"}
                    />
                    {team.name}
                  </div>
                </td>
                <td className={styles.showInDesktop}>
                  {team.season_name || <span>Not linked to a season</span>}
                </td>
                <td className={styles.showInDesktop}>
                  {team.division_name || <span>Not linked to a division</span>}
                </td>
                <td>
                  <DropdownMenuButton>
                    <DropdownMenuButton.Item
                      onClick={() =>
                        handleEdit(
                          team.name,
                          team.id,
                          team.season_id,
                          team.division_id,
                          team.team_logo,
                        )
                      }>
                      {t("edit")}
                    </DropdownMenuButton.Item>

                    <DropdownMenuButton.Separator
                      className={styles.separator}
                    />

                    <DropdownMenuButton.Item
                      onClick={() => handleDelete(team.name, team.id)}>
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
            seasonsData={seasons}
            teamId={currentTeamId}
            teamName={currentTeamName}
            seasonId={currentTeamSeasonId}
            divisionId={currentTeamDivisionId}
            teamLogo={currentTeamLogo}
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
    </>
  );
};

export default Teams;
