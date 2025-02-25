import { useState, useEffect } from "react";
import styles from "../pages.module.css";
import Search from "../../components/Search/Search";
import { getPlayersByGroupId } from "../../api/users/service";
import * as Avatar from "@radix-ui/react-avatar";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import { useQueries } from "@tanstack/react-query";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { PlayerType } from "./types";
import Modal from "../../components/Modal/Modal";
import { getDivisionByGroupId } from "../../api/divisions/service";
import { getSeasonsByGroupId } from "../../api/seasons/services";
import { getTeamsByGroupId } from "../../api/teams/service";
import { getLeagueByGroupId } from "../../api/leagues/service";
import PlayerForm from "../../components/Forms/PlayerForm/PlayerForm";

const Players = () => {
  const { t } = useTranslation("Players");
  // const [sorts, setSorts] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);

  const groupId = Number(Cookies.get("group_id")) || 0;

  const result = useQueries({
    queries: [
      {
        queryKey: ["players", groupId],
        queryFn: async () =>
          await getPlayersByGroupId({
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
      {
        queryKey: ["leagues", groupId],
        queryFn: async () =>
          await getLeagueByGroupId({
            queryKey: ["leagues", groupId],
            meta: undefined,
            signal: new AbortController().signal,
          }),
        enabled: groupId !== 0,
      },
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
    ],
  });

  const [playersQuery, seasonsQuery, divisionsQuery, leaguesQuery, teamsQuery] =
    result;
  const { data, isLoading } = playersQuery;

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

  useEffect(() => {
    playersQuery.refetch();
  }, [isEditOpen]);

  const filteredData = data?.filter((player: PlayerType) =>
    player.first_name.toLowerCase().includes(debouncedQuery.toLowerCase())
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
              data?.map((player: PlayerType, idx: number) => (
                <tr key={idx} className={styles.tableRow}>
                  <td className={styles.tableData}>
                    {/* <td className={styles.tableData}> */}
                    <Avatar.Root className="AvatarRoot" key={player.picture}>
                      <Avatar.Image
                        className={styles.avatar}
                        src={player.picture || ""}
                        alt={player.first_name + " " + player.last_name}
                      />
                      <Avatar.Fallback className="AvatarFallback">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                          alt={player.first_name + " " + player.last_name}
                          className={styles.avatar}
                        />
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div style={{ display: "grid" }}>
                      <p>{`${player.first_name} ${player.last_name}`}</p>
                    </div>
                    {/* </td> */}
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

        <Modal
          open={isEditOpen}
          onOpenChange={(isOpen) => {
            setIsEditOpen(isOpen);
            if (!isOpen) {
              playersQuery.refetch();
            }
          }}
        >
          <Modal.Content
            title={`${t("edit")} ${currentPlayer?.first_name} ${currentPlayer?.last_name} Teams`}
          >
            {currentPlayer && (
              <PlayerForm
                afterSave={() => {
                  setIsEditOpen(false);
                  playersQuery.refetch();
                }}
                requestType="PATCH"
                player={currentPlayer}
                leagues={leaguesQuery.data}
                divisions={divisionsQuery.data}
                seasons={seasonsQuery.data}
                teams={teamsQuery.data}
              />
            )}
          </Modal.Content>
        </Modal>
      </div>
    </section>
  );
};

export default Players;
