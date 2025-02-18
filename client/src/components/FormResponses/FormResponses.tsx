import { useEffect, useState } from "react";
import styles from "./FormResponses.module.css";
import { AnswerRecordMap, FormResponse, FormResponsesProps } from "./types";
import {
  getMongoFormById,
  getMongoFormResponses,
} from "../../api/forms/service";
import { truncateText } from "../../utils/truncateText";
import { useTranslation } from "react-i18next";
import { Answer, Field } from "../../api/forms/types";
import StatusLabel from "../StatusLabel/StatusLabel";

const FormResponses = ({ formId }: FormResponsesProps) => {
  const [formType, setFormType] = useState(0);
  const [formFields, setFormFields] = useState<Field[]>([]);
  const [formResponsesMap, setFormResponsesMap] = useState<AnswerRecordMap>(
    new Map()
  );
  const { t } = useTranslation("FormResponses");

  useEffect(() => {
    (async () => {
      const formData = await getMongoFormById(formId);
      setFormType(formData.form_type);
      setFormFields(formData.form_data.fields);
      const responsesData = await getMongoFormResponses(formData._id);
      const responsesMap = responsesData.reduce(
        (result: AnswerRecordMap, res: FormResponse) => {
          const answersMap: Map<string, Answer> = new Map();
          res.response.answers?.forEach((answer: Answer) => {
            answersMap.set(answer.field.id, answer);
          });

          const responseId = res._id;
          result.set(responseId, answersMap);
          return result;
        },
        new Map()
      );

      setFormResponsesMap(responsesMap);
    })();
  }, [formId]);

  const formatAnswer = (answer: Answer) => {
    const typeFormatters: Record<string, () => string | JSX.Element> = {
      short_text: () => answer.short_text ?? "",
      long_text: () => answer.long_text ?? "",
      number: () => String(answer.number ?? ""),
      email: () => answer.email ?? "",
      phone_number: () => answer.phone_number ?? "",
      choice: () => answer.choice?.label ?? "",
      choices: () => answer.choices?.labels.join(", ") ?? "",
      date: () =>
        answer.date ? new Date(answer.date).toLocaleDateString() : "",
      file_url: () =>
        answer.file_url ? <a href={answer.file_url}>{t("fileText")}</a> : "",
      boolean: () =>
        answer.boolean ? t("booleanOption.true") : t("booleanOption.false"),
      default: () => "",
    };

    return (typeFormatters[answer.type] ?? typeFormatters.default)();
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {formType === 1 && <th>Status</th>}
            {formFields.map((field) => (
              <th key={field.id} title={field.title}>
                <p>{truncateText(field.title, 35)}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from(formResponsesMap.keys()).map((responseId) => (
            <tr key={responseId}>
              {formType === 1 && (
                <td>
                  <StatusLabel status="pending">pending</StatusLabel>
                </td>
              )}
              {formFields.map((field) => (
                <td key={field.id}>
                  {formResponsesMap.get(responseId)?.get(field.id)?.type &&
                    formatAnswer(
                      formResponsesMap.get(responseId)?.get(field.id) as Answer
                    )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {formResponsesMap.size === 0 && (
        <div className={styles.emptyFormResponses}>
          <h2>{t("noResponsesText")}</h2>
        </div>
      )}
    </div>
  );
};

export default FormResponses;
