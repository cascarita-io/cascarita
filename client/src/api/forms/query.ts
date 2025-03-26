import { useQuery } from "@tanstack/react-query";
import {
  getFormByDocumentId,
  getMongoFormResponses,
  getMongoForms,
} from "./service";

export const useGetFormByDocumentId = (documentId: string) => {
  return useQuery({
    queryKey: ["forms", documentId],
    queryFn: getFormByDocumentId,
    enabled: documentId !== "",
  });
};

export const useGetMongoForms = (groupId: number) => {
  return useQuery({
    queryKey: ["forms", groupId],
    queryFn: getMongoForms,
    enabled: groupId !== 0,
  });
};

export const useGetResponsesById = (formId: string) => {
  return useQuery({
    queryKey: ["responses", formId],
    queryFn: getMongoFormResponses,
    enabled: formId !== "",
  });
};
