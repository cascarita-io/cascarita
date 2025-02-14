import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import styles from "./DraggablePlayer.module.css";
import DraggableSubMenu from "../DraggableSubMenu/DraggableSubMenu";
import Switch from "react-switch";
// import { useTranslation } from "react-i18next";
import { DraggableProps } from "../types";
import { getLeagueByGroupId } from "../../../api/leagues/service";
import { getSeasonsByLeagueId } from "../../../api/seasons/services";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchUser } from "../../../api/users/service";
import { User } from "../../../api/users/types";
import Cookies from "js-cookie";
import { LeagueType } from "../../../pages/Leagues/types";
import { SeasonType } from "../../../pages/Seasons/types";
import { getDivisionsBySeasonId } from "../../../api/divisions/service";
import { DivisionType } from "../../../pages/Division/types";
import { getTeamsBySeasonDivisionId } from "../../../api/teams/service";
import { TeamType } from "../../../pages/Teams/types";

const DraggablePlayer: React.FC<DraggableProps> = ({
  index,
  formField,
  onDelete,
  onCopy,
}) => {
  //   const { t } = useTranslation("DraggableFields");
  const { getAccessTokenSilently } = useAuth0();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leagues, setLeagues] = useState<LeagueType[]>([]);
  const [seasons, setSeasons] = useState<SeasonType[]>([]);
  const [divisions, setDivisions] = useState<DivisionType[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser !== null) {
      const fetchLeagues = async () => {
        const leaguesData = await getLeagueByGroupId({
          queryKey: ["league", currentUser.group_id],
          signal: new AbortController().signal,
          meta: undefined,
        });
        setLeagues([...leagues, ...leaguesData]);
      };
      fetchLeagues();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedLeague !== null) {
      const fetchSeasons = async () => {
        const seasonsData = await Promise.all(
          leagues.map(async (league) => {
            const leagueId = league.id as number;
            const seasons = await getSeasonsByLeagueId({
              queryKey: ["season", leagueId],
              signal: new AbortController().signal,
              meta: undefined,
            });
            return seasons;
          })
        );
        const allSeasons = seasonsData.flat();
        setSeasons(allSeasons);
      };
      fetchSeasons();
      setSelectedSeason(null);
    }
  }, [selectedLeague]);

  useEffect(() => {
    if (selectedSeason !== null) {
      const seasonId = Number(selectedSeason.split(".")[1]);
      const fetchDivisions = async () => {
        const divisionData = await getDivisionsBySeasonId({
          queryKey: ["division", seasonId],
          signal: new AbortController().signal,
          meta: undefined,
        });
        setDivisions([...divisions, ...divisionData]);
      };
      fetchDivisions();
    }
  }, [selectedSeason]);

  useEffect(() => {
    if (divisions.length > 0 && selectedSeason !== null) {
      const seasonId = Number(selectedSeason.split(".")[1]);
      const fetchTeams = async () => {
        await Promise.all(
          divisions.map(async (division) => {
            const divisionId = division.id as number;
            const teamsData = await getTeamsBySeasonDivisionId({
              queryKey: ["team", seasonId, divisionId],
              signal: new AbortController().signal,
              meta: undefined,
            });
            const teams = teamsData.map((team: TeamType) => team.name);
            append({ division: division.name, teams: teams });
          })
        );
      };
      fetchTeams();
    }
  }, [divisions, selectedSeason]);

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const email = Cookies.get("email") || "";
      const currentUser = await fetchUser(email, token);
      setCurrentUser(currentUser);
    })();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { control } = useFormContext();

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { append } = useFieldArray({
    control,
    name: `fields.${index}.properties.player_block_choices`,
  });

  return (
    <Draggable draggableId={formField.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          onClick={handleClick}
        >
          <div style={{ position: "relative" }}>
            <p className={styles.textElementTypeText}>Player</p>
            <div className={styles.draggableContainer}>
              {formField.validations?.required != null && (
                <div className={styles.requiredSwitch}>
                  <p className={styles.requiredText}>Required</p>
                  <Controller
                    name={`fields.${index}.validations.required`}
                    control={control}
                    defaultValue={formField.validations.required}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={(checked) => field.onChange(checked)}
                        offColor="#DFE5EE"
                        onColor="#DFE5EE"
                        offHandleColor="#AAAAAA"
                        onHandleColor="#B01254"
                        handleDiameter={24}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        height={16}
                        width={44}
                      />
                    )}
                  />
                </div>
              )}
              <div className={styles.playerContainer}>
                <p className={styles.title}>Player</p>

                <div className={styles.playerContainerItem}>
                  <p className={styles.subtitle}>League: </p>
                  <Controller
                    name={`fields.${index}.league`}
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        onChange={(e) => {
                          console.log(e);
                          field.onChange(e);
                          setSelectedLeague(e.target.value);
                        }}
                      >
                        {selectedLeague === null && (
                          <option value="">Select a league</option>
                        )}
                        {leagues.map((league) => (
                          <option key={league.id} value={league.name}>
                            {league.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
                {selectedLeague !== null && (
                  <div className={styles.playerContainerItem}>
                    <p className={styles.subtitle}>Season: </p>
                    <Controller
                      name={`fields.${index}.season`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setSelectedSeason(e.target.value);
                          }}
                        >
                          {selectedSeason === null && (
                            <option value="">Select a season</option>
                          )}
                          {seasons.map((season) => (
                            <option
                              key={season.id}
                              value={`${season.name}.${season.id}`}
                            >
                              {season.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                )}
              </div>
              {isMenuOpen && (
                <DraggableSubMenu
                  onDelete={onDelete}
                  onCopy={onCopy}
                  onClose={handleClick}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggablePlayer;
