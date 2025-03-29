import { I18nextProvider } from "react-i18next";
import { RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { GroupProvider } from "./components/GroupProvider/GroupProvider";
import i18next from "./i18n/config";
import { useRouter } from "./pages/Routes";

const queryClient = new QueryClient();
const router = useRouter();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18next}>
        <GroupProvider>
          <RouterProvider router={router} />
        </GroupProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

export default App;
