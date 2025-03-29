import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

export const HomeCrumb = React.memo(function HomeBreadCrumb() {
  const { t } = useTranslation("Routes");
  return <Link to="/">{t("breadcrumb.home")}</Link>;
});

export const UserCrumb = React.memo(function UserBreadCrumb() {
  const { t } = useTranslation("Routes");
  return <Link to="/users">{t("breadcrumb.users")}</Link>;
});

export const SeasonBreadcrumb = React.memo(function SeasonBreadcrumb() {
  const { leagueId, leagueName } = useParams<{
    leagueId: string;
    leagueName: string;
  }>();
  return <Link to={`/season/${leagueId}/${leagueName}`}>{leagueName}</Link>;
});

export const DivisionBreadcrumb = React.memo(function DivisionBreadcrumb() {
  const { leagueId, leagueName, seasonId, seasonName } = useParams<{
    leagueId: string;
    leagueName: string;
    seasonId: string;
    seasonName: string;
  }>();
  return (
    <Link
      to={`/season/${leagueId}/${leagueName}/division/${seasonId}/${seasonName}`}>
      {seasonName}
    </Link>
  );
});

export const TeamBreadcrumb = React.memo(function TeamBreadcrumb() {
  const { leagueId, leagueName, seasonId, seasonName, divisionName } =
    useParams<{
      leagueId: string;
      leagueName: string;
      seasonId: string;
      seasonName: string;
      divisionId: string;
      divisionName: string;
    }>();
  return (
    <Link
      to={`/season/${leagueId}/${leagueName}/division/${seasonId}/${seasonName}`}>
      {divisionName}
    </Link>
  );
});
