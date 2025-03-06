"use strict";

const TestDb = require("../models");

const testDataGenerator = function () {
  const createDummyGroup = async function (groupName) {
    let newGroupData = {
      name: groupName,
      street_address: "123 Main Street",
      city: "Sample City",
      state: "CA",
      zip_code: "12345",
      group_code: "ABC123",
      logo_url: "https://example.com/logo",
    };
    const sampleGroup = await TestDb.Group.create(newGroupData);
    return sampleGroup;
  };

  const createLeague = async function (leagueName, groupId) {
    let newLeagueData = {
      group_id: groupId,
      name: leagueName,
      description: "This is a dummy league generated for testing purposes",
    };
    const sampleLeague = await TestDb.League.create(newLeagueData);
    return sampleLeague;
  };

  const createSeason = async function (
    leagueId,
    seasonName = "Default Season",
    startDate = new Date(),
    endDate = new Date(),
    isActive = true,
  ) {
    let newSeasonData = {
      name: seasonName,
      start_date: startDate,
      end_date: endDate,
      is_active: isActive,
      league_id: leagueId,
    };

    const sampleSeason = await TestDb.Season.create(newSeasonData);
    return sampleSeason;
  };

  const createDivision = async function (
    groupId,
    divisionName = "Default Division",
  ) {
    let newDivisionData = {
      group_id: groupId,
      name: divisionName,
    };

    const sampleDivision = await TestDb.Division.create(newDivisionData);
    return sampleDivision;
  };

  return {
    createDummyGroup,
    createLeague,
    createSeason,
    createDivision,
  };
};

module.exports = testDataGenerator();
