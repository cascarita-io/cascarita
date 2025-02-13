import { useState, useEffect } from "react";
import styles from "../pages.module.css";
import Search from "../../components/Search/Search";
// import SelectMenu from "../../components/SelectMenu/SelectMenu";
import Modal from "../../components/Modal/Modal";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { getTeamsBySeasonDivisionId } from "../../api/teams/service";
import { useParams } from "react-router-dom";
import DashboardTable from "../../components/DashboardTable/DashboardTable";
import { useQuery } from "@tanstack/react-query";
import { TeamType } from "./types";
import DropdownMenuButton from "../../components/DropdownMenuButton/DropdownMenuButton";
import TeamForm from "../../components/Forms/TeamsForm/TeamForm";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";

const Teams = () => {
  const { seasonId, divisionId } = useParams<{
    seasonId: string;
    divisionId: string;
  }>();
  const { t } = useTranslation("Teams");
  const seasonIdNumber = seasonId ? parseInt(seasonId, 10) : 0;
  const divisionIdNumber = divisionId ? parseInt(divisionId, 10) : 0;
  // const [sorts, setSorts] = useState("");
  const [currentTeamName, setCurrentTeamName] = useState("");
  const [currentTeamId, setCurrentTeamId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["teams", seasonIdNumber, divisionIdNumber],
    queryFn: getTeamsBySeasonDivisionId,
  });

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handleDebounce);
    };
  }, [searchQuery]);

  const handleEdit = (teamName: string, teamId: number) => {
    setCurrentTeamName(teamName);
    setCurrentTeamId(teamId);
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
                seasonId={seasonIdNumber}
                divisionId={divisionIdNumber}
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
                      <img src={team.team_logo} />
                      {team.name}
                    </div>
                  </td>
                  <td>
                    <DropdownMenuButton>
                      <DropdownMenuButton.Item
                        onClick={() => handleEdit(team.name, team.id)}
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
              divisionId={divisionIdNumber}
              seasonId={seasonIdNumber}
              teamId={currentTeamId}
            />
          </Modal.Content>
        </Modal>

        <Modal open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <Modal.Content title={`${t("delete")} ${currentTeamName}`}>
            <TeamForm
              afterSave={() => setIsDeleteOpen(false)}
              requestType="DELETE"
              divisionId={divisionIdNumber}
              seasonId={seasonIdNumber}
              teamId={currentTeamId}
            />
          </Modal.Content>
        </Modal>
      </div>
    </section>
  );
};

export default Teams;
