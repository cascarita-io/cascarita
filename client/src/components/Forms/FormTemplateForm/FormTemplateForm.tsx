import React, { useState } from "react";
import styles from "../Form.module.css";
import Modal from "../../Modal/Modal";
import { FormTemplateFormProps } from "./types";

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createMongoForm } from "../../../api/forms/service";
import { Field, Form } from "../../../api/forms/types";
import { useQueries } from "@tanstack/react-query";
import { fetchUser } from "../../../api/users/service";
import { getSeasonsByGroupId } from "../../../api/seasons/services";
import { getLeagueByGroupId } from "../../../api/leagues/service";
import { useAuth0 } from "@auth0/auth0-react";
import { LeagueType } from "../../../pages/Leagues/types";
import { SeasonType } from "../../../pages/Seasons/types";

const liabilityText =
  "I recognize the possibility of bodily harm associated with Soccer, and I voluntarily accept and assume the risk as part of my responsibility as a player with the aforementioned association.  I hereby waive, release, and otherwise indemnify my club and team, Salinas Soccer Femenil, its sponsors, its affiliated organizations, sports facilities and their employees and associated personnel with these organizations, against any claims made by me or on my part, as a result of my participation in programs and competitions.";
const signatureText =
  "By providing my e-signature below, I consent that I have read, reviewed and accept the terms contained within this registration form.";

const createRegistrationFormData = (
  leagueId: number,
  leagueName: string,
  seasonId: number,
  seasonName: string,
): Form => {
  const first_name_id = uuidv4();
  const last_name_id = uuidv4();
  const email_id = uuidv4();
  const phone_number_id = uuidv4();
  const date_id = uuidv4();
  const age_id = uuidv4();
  const address_id = uuidv4();
  const team_name_id = uuidv4();
  const liability_id = uuidv4();
  const signature_id = uuidv4();
  const player_block_id = uuidv4();

  const data: Field[] = [
    {
      id: first_name_id,
      ref: first_name_id,
      type: "short_text",
      title: "First Name",
      secondary_type: "first_name",
      validations: {
        required: true,
        max_length: 20,
      },
    },
    {
      id: last_name_id,
      ref: last_name_id,
      type: "short_text",
      title: "Last Name",
      secondary_type: "last_name",
      validations: {
        required: true,
        max_length: 20,
      },
    },
    {
      id: email_id,
      ref: email_id,
      type: "email",
      title: "Email",
      validations: {
        required: true,
      },
    },
    {
      id: phone_number_id,
      ref: phone_number_id,
      type: "phone_number",
      title: "Phone Number",
      properties: { default_country_code: "US" },
      validations: {
        required: true,
      },
    },
    {
      id: date_id,
      ref: date_id,
      type: "date",
      title: "Date of Birth",
      validations: {
        required: true,
      },
    },
    {
      id: age_id,
      ref: age_id,
      type: "short_text",
      secondary_type: "age",
      title: "Age",
      validations: {
        required: true,
        max_length: 20,
      },
    },
    {
      id: address_id,
      ref: address_id,
      type: "long_text",
      secondary_type: "address",
      title: "Address",
      validations: {
        required: true,
        max_length: 100,
      },
    },
    {
      id: team_name_id,
      ref: team_name_id,
      type: "short_text",
      secondary_type: "team_name",
      title: "Team Name",
      validations: {
        required: true,
        max_length: 20,
      },
    },
    {
      id: liability_id,
      ref: liability_id,
      type: "liability",
      title: "Liability Waiver, Release, And Indemnification Agreement",
      properties: {
        description: liabilityText,
      },
      validations: {
        required: true,
      },
    },
    {
      id: signature_id,
      ref: signature_id,
      type: "signature",
      title: "Signature",
      properties: {
        description: signatureText,
      },
      validations: {
        required: true,
      },
    },
    {
      id: player_block_id,
      ref: player_block_id,
      title: "Player Block",
      type: "player",
      season_name: seasonName,
      season_id: seasonId,
      league_name: leagueName,
      league_id: leagueId,
      properties: {
        player_block_choices: [
          {
            division_name: "Division 1",
            division_id: 1,
            teams: [
              {
                team_name: "team 1",
                team_id: 1,
              },
              {
                team_name: "team 2",
                team_id: 2,
              },
              {
                team_name: "team 3",
                team_id: 3,
              },
            ],
          },
        ],
      },
    },
  ];
  return { fields: data };
};

const FormTemplateForm: React.FC<FormTemplateFormProps> = ({ afterSave }) => {
  const [template, setTemplate] = useState("");
  const [title, setTitle] = useState("Registration Form");
  const [leagueName, setLeagueName] = useState("");
  const [leagueId, setLeagueId] = useState(0);
  const [seasonName, setSeasonName] = useState("");
  const [seasonId, setSeasonId] = useState(0);
  const navigate = useNavigate();
  const groupId = Number(Cookies.get("group_id")) || 0;
  const email = Cookies.get("email") || "";
  const { getAccessTokenSilently } = useAuth0();

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
        queryKey: ["leagues", groupId],
        queryFn: async () =>
          await getLeagueByGroupId({
            queryKey: ["leagues", groupId],
            meta: undefined,
            signal: new AbortController().signal,
          }),
        enabled: groupId !== 0,
      },
    ],
  });

  const [seasonsQuery, leaguesQuery] = results;
  //   const data = seasonsQuery.data;
  //   const isLoading = seasonsQuery.isLoading;
  //   const isError = seasonsQuery.isError;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (template !== "registration") {
      navigate("/forms/check");
    } else {
      const data = createRegistrationFormData(
        leagueId,
        leagueName,
        seasonId,
        seasonName,
      );
      const token = await getAccessTokenSilently();
      const currentUser = await fetchUser(email, token);

      const form = await createMongoForm(
        data,
        title,
        description,
        currentUser?.group_id,
        currentUser?.id,
      );

      navigate("/forms/check", {
        state: {
          id: form._id,
          title: form.form_data.title,
          description:
            form.form_data.welcome_screens?.[0]?.properties?.description ?? "",
          link: form._id,
          fields: form.form_data.fields,
        },
      });
    }

    afterSave();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <label className={styles.label}>Template Type</label>
        <select
          className={styles.input}
          name="template"
          id="template"
          onChange={(e) => setTemplate(e.target.value)}
          required
        >
          <option value="">Select a template</option>
          <option value="registration">Registration</option>
          <option value="blank">Blank</option>
        </select>
      </div>
      {template === "registration" && (
        <>
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="leagueName">
              Form Title
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="leagueName">
              League Name
            </label>
            <select
              className={styles.input}
              name="leagueName"
              id="leagueName"
              required
              onChange={(e) => {
                const [name, id] = e.target.value.split(".");
                setLeagueName(name);
                setLeagueId(Number(id));
              }}
            >
              <option value="">Select a league</option>
              {leaguesQuery.data?.map((league: LeagueType) => (
                <option key={league.id} value={`${league.name}.${league.id}`}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="seasonName">
              Season Name
            </label>
            <select
              className={styles.input}
              name="leagueName"
              id="leagueName"
              required
              onChange={(e) => {
                const [name, id] = e.target.value.split(".");
                setSeasonName(name);
                setSeasonId(Number(id));
              }}
            >
              <option value="">Select a season</option>
              {seasonsQuery.data?.map((season: SeasonType) => (
                <option key={season.id} value={`${season.name}.${season.id}`}>
                  {season.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      <div className={styles.formBtnContainer}>
        <Modal.Close className={`${styles.btn} ${styles.cancelBtn}`}>
          Cancel
        </Modal.Close>

        <div>
          <button type="submit" className={`${styles.btn} ${styles.submitBtn}`}>
            Create
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormTemplateForm;
