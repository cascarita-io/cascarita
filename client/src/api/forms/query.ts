import { useQuery } from "@tanstack/react-query";
import { getFormByDocumentId } from "./service";

export const useGetFormByDocumentId = (documentId: string) => {
  return useQuery({
    queryKey: ["forms", documentId],
    queryFn: getFormByDocumentId,
    enabled: documentId !== "",
  });
};
