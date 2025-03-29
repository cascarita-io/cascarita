import { initReactI18next } from "react-i18next";

import i18next from "i18next";

import { updateUsersLanguages } from "../api/users/service";
import DeleteFormEn from "./en/components/DeleteForm.json";
import DraggableButtonsEn from "./en/components/DraggableButtons.json";
import DraggableFieldsEn from "./en/components/DraggableFields.json";
import DropdownMenuButtonEn from "./en/components/DropdownMenuButton.json";
import EmptyDNDCanvasEn from "./en/components/EmptyDNDCanvas.json";
import FormComponentsEn from "./en/components/FormComponents.json";
import FormResponsesEn from "./en/components/FormResponses.json";
import SearchEn from "./en/components/Search.json";
import SideNavEn from "./en/components/SideNav.json";
import DivisionsEn from "./en/pages/Divisions.json";
import FormsEn from "./en/pages/Forms.json";
import LeaguesEn from "./en/pages/Leagues.json";
import NewFormsEn from "./en/pages/NewForms.json";
import PlayersEn from "./en/pages/Players.json";
import RoutesEn from "./en/pages/Routes.json";
import SeasonsEn from "./en/pages/Seasons.json";
import SettingsEn from "./en/pages/Settings.json";
import TeamsEn from "./en/pages/Teams.json";
import UsersEn from "./en/pages/Users.json";
import DeleteFormEsp from "./esp/components/DeleteForm.json";
import DraggableButtonsEsp from "./esp/components/DraggableButtons.json";
import DraggableFieldsEsp from "./esp/components/DraggableFields.json";
import DropdownMenuButtonEsp from "./esp/components/DropdownMenuButton.json";
import EmptyDNDCanvasEsp from "./esp/components/EmptyDNDCanvas.json";
import FormComponentsEsp from "./esp/components/FormComponents.json";
import FormResponsesEsp from "./esp/components/FormResponses.json";
import SearchEsp from "./esp/components/Search.json";
import SideNavEsp from "./esp/components/SideNav.json";
import DivisionsEsp from "./esp/pages/Divisions.json";
import FormsEsp from "./esp/pages/Forms.json";
import LeaguesEsp from "./esp/pages/Leagues.json";
import NewFormsEsp from "./esp/pages/NewForms.json";
import PlayersEsp from "./esp/pages/Players.json";
import RoutesEsp from "./esp/pages/Routes.json";
import SeasonsEsp from "./esp/pages/Seasons.json";
import SettingsEsp from "./esp/pages/Settings.json";
import TeamsEsp from "./esp/pages/Teams.json";
import UsersEsp from "./esp/pages/Users.json";

i18next.use(initReactI18next).init({
  debug: true,
  fallbackLng: (localStorage.getItem("defaultLanguage") as string) || "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      DropdownMenuButton: DropdownMenuButtonEn,
      SideNav: SideNavEn,
      Search: SearchEn,
      Leagues: LeaguesEn,
      Seasons: SeasonsEn,
      Forms: FormsEn,
      NewForms: NewFormsEn,
      EmptyDNDCanvas: EmptyDNDCanvasEn,
      DraggableButtons: DraggableButtonsEn,
      FormResponses: FormResponsesEn,
      DraggableFields: DraggableFieldsEn,
      Users: UsersEn,
      Routes: RoutesEn,
      Divisions: DivisionsEn,
      DeleteForm: DeleteFormEn,
      Teams: TeamsEn,
      Settings: SettingsEn,
      FormComponents: FormComponentsEn,
      Players: PlayersEn,
    },
    esp: {
      DropdownMenuButton: DropdownMenuButtonEsp,
      SideNav: SideNavEsp,
      Search: SearchEsp,
      Leagues: LeaguesEsp,
      Seasons: SeasonsEsp,
      Forms: FormsEsp,
      NewForms: NewFormsEsp,
      EmptyDNDCanvas: EmptyDNDCanvasEsp,
      DraggableButtons: DraggableButtonsEsp,
      FormResponses: FormResponsesEsp,
      DraggableFields: DraggableFieldsEsp,
      Users: UsersEsp,
      Routes: RoutesEsp,
      Divisions: DivisionsEsp,
      DeleteForm: DeleteFormEsp,
      Teams: TeamsEsp,
      Settings: SettingsEsp,
      FormComponents: FormComponentsEsp,
      Players: PlayersEsp,
    },
  },
  ns: [
    "DropdownMenuButton",
    "SideNav",
    "Search",
    "Leagues",
    "Seasons",
    "Forms",
    "NewForms",
    "EmptyDNDCanvas",
    "DraggableButtons",
    "FormResponses",
    "DraggableFields",
    "Users",
    "Routes",
    "Divisions",
    "DeleteForm",
    "Teams",
    "Settings",
    "FormComponents",
    "Players",
  ],
});

export const changeLanguage = async (user_id: number, lng: string) => {
  await updateUsersLanguages(user_id, lng);
  localStorage.setItem("defaultLanguage", lng);
  i18next.changeLanguage(lng);
};

export default i18next;
