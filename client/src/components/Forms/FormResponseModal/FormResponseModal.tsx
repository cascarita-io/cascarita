import { Answer } from "../../../api/forms/types";
import DashboardTable from "../../DashboardTable/DashboardTable";
import styles from "./FormResponseModal.module.css";
import { formatCurrency } from "../../../utils/formatCurrency";

interface FormResponseModalProps {
  answers: Record<string, Answer> | undefined;
}

const FormResponseModal: React.FC<FormResponseModalProps> = ({ answers }) => {
  const headers = answers ? Object.keys(answers) : [];

  if (headers.includes("player")) {
    const playerIndex = headers.indexOf("player");
    headers.splice(playerIndex, 1, "league", "season", "division", "team");
  }
  return (
    <DashboardTable
      headers={headers}
      headerColor="light"
      className={styles.table}
    >
      <tr>
        {answers &&
          Object.keys(answers).map((key) => {
            const response = answers[key] as Answer;
            return (
              <>
                {key === "first_name" && <td>{response.short_text}</td>}
                {key === "last_name" && <td>{response.short_text}</td>}
                {key === "email" && <td>{response.email}</td>}
                {key === "phone_number" && <td>{response.phone_number}</td>}
                {key === "date" && <td>{response.date}</td>}
                {key === "age" && <td>{response.short_text}</td>}
                {key === "address" && <td>{response.long_text}</td>}
                {key === "photo" && (
                  <td>
                    <img src={response.photo} />
                  </td>
                )}
                {key === "team_name" && <td>{response.short_text}</td>}
                {key === "liability" && (
                  <td>{response.liability ? "Yes" : "No"}</td>
                )}
                {key === "signature" && <td>{response.short_text}</td>}
                {key === "player" && (
                  <>
                    <td>{response.player?.league_name}</td>
                    <td>{response.player?.season_name}</td>
                    <td>{response.player?.division_name}</td>
                    <td>{response.player?.team_name}</td>
                  </>
                )}
                {key === "payment" && (
                  <td>
                    {response.payment_type && response.amount
                      ? `${response.payment_type} - $${formatCurrency([response.amount])[0]}`
                      : "no payment data"}
                  </td>
                )}
              </>
            );
          })}
      </tr>
    </DashboardTable>
  );
};

export default FormResponseModal;
