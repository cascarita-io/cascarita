import {
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Route } from "react-router-dom";

import { UserCrumb } from "../components/BreadCrumb/BreadCrumbComponents";
import Layout from "../components/Layout/Layout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import ThankYou from "../components/ThankYou/ThankYou";
import Divisions from "./Division/Division";
import FormPage from "./FormPage/FormPage";
import Forms from "./Forms/Forms";
import Home from "./Home/Home";
import Leagues from "./Leagues/Leagues";
import Login from "./Login/Login";
import NewForm from "./NewForm/NewForm";
import NotFound from "./NotFound/NotFound";
import Players from "./Players/Players";
import Privacy from "./Privacy/Privacy";
import Seasons from "./Seasons/Seasons";
import AccountInfo from "./Settings/AccountInfo/AccountInfo";
import Payment from "./Settings/Payment/Payment";
import Settings from "./Settings/Settings";
import Teams from "./Teams/Teams";
import Terms from "./Terms/Terms";
import Users from "./Users/Users";

export const useRouter = () =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />}>
            <Route index element={<Leagues />} />
            <Route path="seasons" element={<Seasons />} />
            <Route path="divisions" element={<Divisions />} />
            <Route path="teams" element={<Teams />} />
            <Route path="players" element={<Players />} />
          </Route>

          <Route
            path="users"
            element={<Users />}
            handle={{ crumb: <UserCrumb /> }}
          />
          <Route path="forms" element={<Forms />} />
          <Route path="forms/edit" element={<NewForm />} />
          <Route path="settings" element={<Settings />}>
            <Route index element={<AccountInfo />} />
            <Route path="payment" element={<Payment />} />
          </Route>
        </Route>
        <Route path="forms/:formId" element={<FormPage />} />
        <Route path="login" element={<Login />} />
        <Route path="thanks" element={<ThankYou />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>,
    ),
  );
