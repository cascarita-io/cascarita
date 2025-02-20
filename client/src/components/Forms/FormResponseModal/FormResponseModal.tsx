import { Answer } from "../../../api/forms/types";
import DashboardTable from "../../DashboardTable/DashboardTable";
import styles from "./FormResponseModal.module.css";

interface FormResponseModalProps {
  answers: Map<string, Answer> | undefined;
}

const FormResponseModal: React.FC<FormResponseModalProps> = ({ answers }) => {
  console.log("answers: ", answers);
  const headers = answers ? Array.from(answers.keys()) : [];

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
          Array.from(answers.entries()).map(([key, response]) => (
            <>
              {key === "first_name" && <td>{response.short_text}</td>}
              {key === "last_name" && <td>{response.short_text}</td>}
              {key === "email" && <td>{response.email}</td>}
              {key === "phone_number" && <td>{response.phone_number}</td>}
              {key === "date" && <td> {response.date}</td>}
              {key === "age" && <td>{response.short_text}</td>}
              {key === "address" && <td>{response.long_text}</td>}
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
              {/* TODO: What to add here? */}
              {key === "payment" && <td>Payment Info</td>}
            </>
          ))}
      </tr>
    </DashboardTable>
  );
};

export default FormResponseModal;
