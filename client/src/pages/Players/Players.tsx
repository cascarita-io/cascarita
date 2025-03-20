import { useState, useEffect } from "react";
import styles from "../pages.module.css";
import Search from "../../components/Search/Search";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import { useTranslation } from "react-i18next";
import { PlayerType } from "./types";
import Modal from "../../components/Modal/Modal";
import PlayerForm from "../../components/Forms/PlayerForm/PlayerForm";
import { useGroup } from "../../components/GroupProvider/GroupProvider";
import { useGetTeamsByGroupId } from "../../api/teams/query";
import { useGetPlayersByGroupId } from "../../api/users/query";
import { useGetSeasonsByGroupId } from "../../api/seasons/query";
import { useGetLeaguesByGroupId } from "../../api/leagues/query";
import { useGetDivisionsByGroupId } from "../../api/divisions/query";
import { FaUsers } from "react-icons/fa";
import { Avatar } from "@radix-ui/themes";

const Players = () => {
  const { t } = useTranslation("Players");
  // const [sorts, setSorts] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);

  const { groupId } = useGroup();

  const { data: teams, isLoading } = useGetTeamsByGroupId(groupId);
  const { data: players } = useGetPlayersByGroupId(groupId);
  const { data: seasons } = useGetSeasonsByGroupId(groupId);
  const { data: divisions } = useGetDivisionsByGroupId(groupId);
  const { data: leagues } = useGetLeaguesByGroupId(groupId);

  const handleEdit = (player: PlayerType) => {
    setCurrentPlayer(player);
    setIsEditOpen(true);
  };

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handleDebounce);
    };
  }, [searchQuery]);

  const filteredData = players?.filter((player: PlayerType) =>
    player.first_name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <section className={styles.wrapper}>
      <div className={styles.sectionWrapper}>
        <div className={styles.filterSearch}>
          <div className={styles.dropdown}>
            {players && players.length > 0 && (
              <Search onSearchChange={setSearchQuery} />
            )}
          </div>
        </div>

        {filteredData == null || filteredData?.length === 0 ? (
          <p className={styles.noItemsMessage}>{t("empty")}</p>
        ) : (
          <DashboardTable
            headers={[
              t("tableHeaders.name"),
              t("tableHeaders.team"),
              t("tableHeaders.options"),
            ]}
            headerColor="light"
          >
            {isLoading ? (
              <tr>
                <td>{t("loading")}</td>
              </tr>
            ) : (
              filteredData?.map((player: PlayerType, idx: number) => (
                <tr key={idx} className={styles.tableRow}>
                  <td className={styles.tableData}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <Avatar
                        src={(player && player.picture) || ""}
                        className={styles.avatar}
                        fallback={
                          <div className={styles.avatarFallback}>
                            <FaUsers />
                          </div>
                        }
                        radius="full"
                        size={"4"}
                      />
                      {player.first_name} {player.last_name}
                    </div>
                  </td>
                  <td>
                    {player.teams && player.teams.length > 0 ? (
                      player.teams.map((team) => team.name).join(", ")
                    ) : (
                      <span>Not linked to a team</span>
                    )}
                  </td>
                  <td>
                    <DropdownMenuButton>
                      <DropdownMenuButton.Item
                        onClick={() => handleEdit(player)}
                      >
                        {t("edit")}
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
            title={`${t("edit")} ${currentPlayer?.first_name} ${currentPlayer?.last_name} Teams`}
          >
            {currentPlayer && (
              <PlayerForm
                afterSave={() => {
                  setIsEditOpen(false);
                }}
                requestType="PATCH"
                player={currentPlayer}
                leagues={leagues}
                divisions={divisions}
                seasons={seasons}
                teams={teams}
              />
            )}
          </Modal.Content>
        </Modal>
      </div>
    </section>
  );
};

export default Players;
