import {
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Home from "./Home/Home";
import Login from "./Login/Login";
import Layout from "../components/Layout/Layout";
import { Route } from "react-router-dom";
import Leagues from "./Leagues/Leagues";
import Seasons from "./Seasons/Seasons";
import Users from "./Users/Users";
import Divisions from "./Division/Division";
import Teams from "./Teams/Teams";
import Forms from "./Forms/Forms";
import Players from "./Players/Players";
import NewForm from "./NewForm/NewForm";
import Settings from "./Settings/Settings";
import FormPage from "./FormPage/FormPage";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Plan from "./Settings/Plan/Plan";
import Payment from "./Settings/Payment/Payment";
import { UserCrumb } from "../components/BreadCrumb/BreadCrumbComponents";
import NotFound from "./NotFound/NotFound";
import ThankYou from "../components/ThankYou/ThankYou";

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
            <Route index element={<Plan />} />
            <Route path="payment" element={<Payment />} />
          </Route>
        </Route>
        <Route path="forms/:formId" element={<FormPage />} />
        <Route path="login" element={<Login />} />
        <Route path="thanks" element={<ThankYou />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );
