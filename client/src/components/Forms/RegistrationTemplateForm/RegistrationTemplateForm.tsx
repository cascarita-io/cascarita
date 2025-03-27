import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
import Tooltip from "@mui/material/Tooltip";
import { useQueries } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

import { getDivisionsBySeasonId } from "../../../api/divisions/service";
import { createMongoForm } from "../../../api/forms/service";
import { Currency, Field, Form } from "../../../api/forms/types";
import { getLeaguesByGroupId } from "../../../api/leagues/service";
import { getSeasonsByGroupId } from "../../../api/seasons/services";
import { useGetAllStripeAccounts } from "../../../api/stripe/query";
import { getStripeAccounts } from "../../../api/stripe/service";
import { getTeamsBySeasonDivisionId } from "../../../api/teams/service";
import { fetchUser } from "../../../api/users/service";
import { DivisionType } from "../../../pages/Division/types";
import { LeagueType } from "../../../pages/Leagues/types";
import { SeasonType } from "../../../pages/Seasons/types";
import { TeamType } from "../../../pages/Teams/types";
import { StripeAccount } from "../../DragAndDropComponents/DraggablePayment/types";
import Modal from "../../Modal/Modal";
import styles from "../Form.module.css";
import { calculateFee } from "./helper";
import { RegistrationTemplateFormProps } from "./types";

const liabilityText =
  "I recognize the possibility of bodily harm associated with Soccer, and I voluntarily accept and assume the risk as part of my responsibility as a player with the aforementioned association.  I hereby waive, release, and otherwise indemnify my club and team, Salinas Soccer Femenil, its sponsors, its affiliated organizations, sports facilities and their employees and associated personnel with these organizations, against any claims made by me or on my part, as a result of my participation in programs and competitions.";
const signatureText =
  "By providing my e-signature below, I consent that I have read, reviewed and accept the terms contained within this registration form.";
const termsOfServiceText = `By filling this form, I agree to the terms of service and privacy policy of Cascarita.`;
const termsOfServiceLink = `${window.location.origin}/terms`;
const privacyPolicyLink = `${window.location.origin}/privacy`;

const createRegistrationFormData = (
  leagueId: number,
  leagueName: string,
  seasonId: number,
  seasonName: string,
  divisionName: string,
  divisionId: number,
  teams: TeamType[],
  price: number,
  feeValue: string,
  stripeUser: string,
  stripeAccountId: string,
  paymentFeeRecipient: string,
): Form => {
  const terms_of_service_id = uuidv4();
  const first_name_id = uuidv4();
  const last_name_id = uuidv4();
  const email_id = uuidv4();
  const phone_number_id = uuidv4();
  const date_id = uuidv4();
  const address_id = uuidv4();
  const liability_id = uuidv4();
  const signature_id = uuidv4();
  const player_block_id = uuidv4();
  const payment_block_id = uuidv4();
  const photo_block_id = uuidv4();

  const data: Field[] = [
    {
      id: terms_of_service_id,
      ref: terms_of_service_id,
      type: "liability",
      title: "Terms of Service and Privacy Policy",
      properties: {
        description: termsOfServiceText,
        termsOfService: termsOfServiceLink,
        privacyPolicy: privacyPolicyLink,
      },
      validations: {
        required: true,
      },
    },
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
      id: photo_block_id,
      ref: photo_block_id,
      type: "photo",
      title: "Upload picture for your ID",
      properties: {
        description: "Make sure its your full face",
      },
      validations: {
        required: true,
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
      division_name: divisionName,
      division_id: divisionId,
      validations: { required: false },
      properties: {
        player_block_choices: {
          teams: teams.map((team: TeamType) => ({
            team_id: team.id,
            team_name: team.name,
          })),
        },
      },
    },
    {
      title: "Payment",
      type: "payment",
      id: payment_block_id,
      ref: payment_block_id,
      properties: {
        price: {
          type: "fixed",
          value: price.toString(),
          feeValue: feeValue.toString(),
          currency: Currency.USD,
          isCustomerPayingFee: paymentFeeRecipient === "customer",
        },
        stripe_account: { id: stripeUser, stripe_account_id: stripeAccountId },
        description: "",
      },
      validations: { required: false },
    },
  ];
  return { fields: data };
};

const RedirectToLeagues = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <div>
      <div className={styles.inputContainer}>
        <label className={styles.label} style={{ paddingBottom: "10px" }}>
          You have no leagues and seasons. Please create a league and season.
        </label>
      </div>
      <div className={styles.formBtnContainer}>
        <Modal.Close className={`${styles.btn} ${styles.cancelBtn}`}>
          Cancel
        </Modal.Close>

        <div>
          <button
            onClick={handleRedirect}
            className={`${styles.btn} ${styles.submitBtn}`}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const FormTemplateForm: React.FC<RegistrationTemplateFormProps> = ({
  afterSave,
}) => {
  const [template, setTemplate] = useState("");
  const [title, setTitle] = useState("Registration Form");
  const [leagueName, setLeagueName] = useState("");
  const [leagueId, setLeagueId] = useState(0);
  const [seasonName, setSeasonName] = useState("");
  const [seasonId, setSeasonId] = useState(0);
  const [divisionId, setDivisionId] = useState(0);
  const [divisionName, setDivisionName] = useState("");
  const [divisions, setDivisions] = useState<DivisionType[]>([]);
  const [teams, setTeams] = useState<TeamType[]>([]);
  const [price, setPrice] = useState(0);
  const [feeValue, setFeeValue] = useState("");
  const [stripeAccountId, setStripeAccountId] = useState("");
  const [stripeUser, setStripeUser] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentFeeRecipient, setPaymentFeeRecipient] = useState("org");
  const description = "Please fill out all details for the registration form!";
  const [page, setPage] = useState(1);

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
          await getLeaguesByGroupId({
            queryKey: ["leagues", groupId],
            meta: undefined,
            signal: new AbortController().signal,
          }),
        enabled: groupId !== 0,
      },
      {
        queryKey: ["stripeAccounts", groupId],
        queryFn: async () =>
          await getStripeAccounts({
            queryKey: ["stripeAccounts", groupId],
            signal: new AbortController().signal,
            meta: undefined,
          }),
        enabled: groupId !== 0,
      },
    ],
  });
  const { data: stripeAccounts } = useGetAllStripeAccounts(groupId);

  const [seasonsQuery, leaguesQuery, stripeAccountsQuery] = results;

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsData = await getTeamsBySeasonDivisionId({
        queryKey: ["team", seasonId, divisionId],
        signal: new AbortController().signal,
        meta: undefined,
      });
      setTeams(teamsData);
    };
    if (seasonId !== 0 && leagueId !== 0 && divisionId !== 0) {
      fetchTeams();
    }
  }, [seasonId, leagueId, divisionId]);

  useEffect(() => {
    const fetchDivisions = async () => {
      const divisionData = await getDivisionsBySeasonId({
        queryKey: ["division", seasonId],
        signal: new AbortController().signal,
        meta: undefined,
      });
      setDivisions(divisionData);
    };
    if (seasonId !== 0) {
      fetchDivisions();
    }
  }, [seasonId]);

  useEffect(() => {
    if (stripeAccountsQuery.data) {
      const stripeAccount = stripeAccountsQuery.data.find(
        (account: StripeAccount) => account.user_email === email,
      );
      if (stripeAccount) {
        setStripeAccountId(stripeAccount.stripe_account_id);
        setStripeUser(stripeAccount.id.toString());
      }
    }
  }, [stripeAccountsQuery.data]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (seasonId === 0 || leagueId === 0 || divisionId === 0) {
      setErrorMsg("Form needs both a league, a season, and a division.");
      setTimeout(() => {
        setErrorMsg("");
      }, 5000);
      return;
    } else if (price === 0 || feeValue === "") {
      setErrorMsg("Price cannot be 0.");
      setTimeout(() => {
        setErrorMsg("");
      }, 5000);
      return;
    }

    if (template !== "registration") {
      navigate("/forms/edit");
    } else {
      const data = createRegistrationFormData(
        leagueId,
        leagueName,
        seasonId,
        seasonName,
        divisionName,
        divisionId,
        teams,
        price,
        feeValue,
        stripeUser,
        stripeAccountId,
        paymentFeeRecipient,
      );
      const token = await getAccessTokenSilently();
      const currentUser = await fetchUser(email, token);

      const form = await createMongoForm(
        data,
        title,
        description,
        currentUser?.group_id,
        currentUser?.id,
        template,
      );

      navigate("/forms/edit", {
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

  if (Array.isArray(seasonsQuery.data) && Array.isArray(leaguesQuery.data)) {
    if (template === "registration") {
      if (seasonsQuery.data.length === 0 && leaguesQuery.data.length === 0) {
        return <RedirectToLeagues />;
      }
    }
  }

  const getIsPageComplete = (pageNumber: number) => {
    switch (pageNumber) {
      case 1:
        return (
          title.trim() !== "" &&
          leagueName.trim() !== "" &&
          seasonName.trim() !== "" &&
          divisionName.trim() !== ""
        );

      case 2:
        return false;

      default:
        return false;
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div style={{ display: "grid", gap: "24px" }}>
        {stripeAccounts === undefined ||
          (stripeAccounts.length === 0 && (
            <label className={styles.label} style={{ color: "red" }}>
              Please link a Stripe Account before creating a form
            </label>
          ))}

        {page === 1 && (
          <div className={styles.inputContainer}>
            <label className={styles.label}>Template Type</label>
            <select
              className={styles.input}
              name="template"
              id="template"
              onChange={(e) => setTemplate(e.target.value)}
              required
              disabled={
                stripeAccounts === undefined || stripeAccounts.length === 0
              }>
              <option value="">Select a template</option>
              <option value="registration">Registration</option>
            </select>
          </div>
        )}

        {template === "registration" && (
          <>
            {page === 1 && (
              <>
                <div className={styles.inputContainer}>
                  {errorMsg && (
                    <label className={styles.label} style={{ color: "red" }}>
                      {errorMsg}
                    </label>
                  )}
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
                    id="leagueId"
                    value={`${leagueName}.${leagueId}`}
                    required
                    onChange={(e) => {
                      const [name, id] = e.target.value.split(".");
                      setLeagueName(name);
                      setLeagueId(Number(id));
                    }}>
                    <option value="">Select a league</option>
                    {leaguesQuery.data?.map((league: LeagueType) => (
                      <option
                        key={league.id}
                        value={`${league.name}.${league.id}`}>
                        {league.name}
                      </option>
                    ))}
                  </select>
                </div>
                {leagueId !== 0 &&
                  seasonsQuery.data?.filter(
                    (season: SeasonType) => season.league_id === leagueId,
                  ).length > 0 && (
                    <div className={styles.inputContainer}>
                      <label className={styles.label} htmlFor="seasonName">
                        Season Name
                      </label>
                      <select
                        className={styles.input}
                        name="seasonName"
                        value={`${seasonName}.${seasonId}`}
                        id="seasonId"
                        required
                        onChange={(e) => {
                          const [name, id] = e.target.value.split(".");
                          setSeasonName(name);
                          setSeasonId(Number(id));
                        }}>
                        <option value="">Select a season</option>
                        {seasonsQuery.data
                          ?.filter(
                            (season: SeasonType) =>
                              season.league_id === leagueId,
                          )
                          .map((season: SeasonType) => (
                            <option
                              key={season.id}
                              value={`${season.name}.${season.id}`}>
                              {season.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                {seasonId !== 0 && (
                  <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="divisionName">
                      Division Name
                    </label>
                    <select
                      className={styles.input}
                      name="divisionName"
                      id="divisionId"
                      value={`${divisionName}.${divisionId}`}
                      required
                      onChange={(e) => {
                        const [name, id] = e.target.value.split(".");
                        setDivisionName(name);
                        setDivisionId(Number(id));
                      }}>
                      <option value="">Select a division</option>
                      {divisions.map((division: DivisionType) => (
                        <option
                          key={division.id}
                          value={`${division.name}.${division.id}`}>
                          {division.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {page === 2 && (
              <>
                <div className={styles.inlineInputContainer}>
                  <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="price">
                      Price $USD
                    </label>

                    <input
                      className={styles.input}
                      type="text"
                      placeholder="Price"
                      value={price}
                      onChange={(e) => {
                        setPrice(Number(e.target.value));
                        const calcFee = calculateFee(Number(e.target.value));
                        setFeeValue(calcFee);
                      }}
                      required
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="fee">
                      Processing Fee $USD
                      <Tooltip title="The customer will pay both Stripe and Cascarita processing fees.">
                        <span style={{ color: "grey", paddingLeft: "4px" }}>
                          ?
                        </span>
                      </Tooltip>
                    </label>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="Fee"
                      value={feeValue}
                      readOnly
                    />
                  </div>
                </div>
                <p className={styles.label} style={{ color: "green" }}>
                  Payments accepted are <strong>cash</strong> and{" "}
                  <strong>credit card</strong>.
                </p>
                <div className={styles.inputContainer}>
                  <label className={styles.label} htmlFor="isCustomerPayingFee">
                    Who will pay the processing fee?
                  </label>
                  <select
                    className={styles.input}
                    name="isCustomerPayingFee"
                    id="isCustomerPayingFee"
                    onChange={(e) => {
                      setPaymentFeeRecipient(e.target.value);
                    }}
                    required>
                    <option value="">Select Option</option>
                    {/* TODO: UNCOMMENT ONCE ORG FEES FIGURED OUT */}
                    {/* <option value="org">Organization</option> */}
                    <option value="customer">Customer</option>
                  </select>
                </div>
              </>
            )}
          </>
        )}
        <div className={styles.formBtnContainer}>
          {page === 1 ? (
            <>
              <Modal.Close className={`${styles.btn} ${styles.cancelBtn}`}>
                Cancel
              </Modal.Close>

              <button
                className={`${styles.btn} ${styles.submitBtn}`}
                onClick={() => setPage(2)}
                disabled={!getIsPageComplete(1)}>
                Next
              </button>
            </>
          ) : (
            <>
              <button
                className={`${styles.btn} ${styles.cancelBtn}`}
                onClick={() => setPage(1)}>
                Back
              </button>
              <button
                type="submit"
                className={`${styles.btn} ${styles.submitBtn}`}>
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default FormTemplateForm;
