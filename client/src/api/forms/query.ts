import { useQuery } from "@tanstack/react-query";
import { FetchedForm, Error } from "../../pages/FormPage/types";
<FetchedForm, Error>
const useGetMongoFormById = () => {
  return useQuery({
    queryKey: ["form", formId],
    queryFn: () =>
      formId
        ? getMongoFormById(formId)
        : Promise.reject(new Error("Form ID is undefined")),
  });
};
