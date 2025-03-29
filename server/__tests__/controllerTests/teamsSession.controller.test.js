"use strict";

const TeamsSessionController = require("../../controllers/teamSession.controller");
const TestDb = require("../../models");
const TestDataGenerator = require("../../utilityFunctions/testDataGenerator");

var createMockResponse = function () {
  return {
    status: jest.fn(function (statusCode) {
      return this;
    }),
    json: jest.fn(function (data) {
      this.body = data;
    }),
  };
};

var setUpForTeamsSession = async function (
  groupName,
  LeagueName,
  SeasonName,
  DivisionName,
  TeamName,
) {
  const group = await TestDataGenerator.createDummyGroup(groupName);
  const league = await TestDataGenerator.createLeague(LeagueName, group.id);
  const sampleSeason = await TestDataGenerator.createSeason(
    league.id,
    SeasonName,
  );
  const sampleDivision = await TestDataGenerator.createDivision(
    group.id,
    DivisionName,
  );

  const sampleSession = await TestDb.Session.create({
    division_id: sampleDivision.id,
    season_id: sampleSeason.id,
  });

  const sampleTeam = await TestDb.Team.create({
    group_id: group.id,
    name: TeamName,
    team_logo: "www.google.com",
  });

  const response = {
    teamId: sampleTeam.id,
    sessionId: sampleSession.id,
    divisionId: sampleDivision.id,
    seasonId: sampleSeason.id,
    groupId: group.id,
  };

  return response;
};

var createSampleTeamsSession = async function () {
  const data = await setUpForTeamsSession(
    "group",
    "league",
    "season",
    "division",
    "team",
  );
  const sampleTeamsSession = await TestDb.TeamsSession.create({
    team_id: data.teamId,
    session_id: data.sessionId,
  });
  return { teamsSessionData: sampleTeamsSession, groupId: data.groupId };
};

afterAll(async function () {
  await TestDb.sequelize.close();
});

describe("Session Controller", () => {
  beforeEach(async function () {
    await TestDb.Group.sync();
    await TestDb.League.sync();
    await TestDb.Season.sync();
    await TestDb.Division.sync();
    await TestDb.Session.sync();
    await TestDb.Team.sync();
    await TestDb.TeamsSession.sync();
  });

  afterEach(async function () {
    await TestDb.TeamsSession.destroy({ where: {} });
    await TestDb.Team.destroy({ where: {} });
    await TestDb.Session.destroy({ where: {} });
    await TestDb.Division.destroy({ where: {} });
    await TestDb.Season.destroy({ where: {} });
    await TestDb.League.destroy({ where: {} });
    await TestDb.Group.destroy({ where: {} });
  });

  describe("setup", () => {
    it("should do setup", async () => {
      const sampleData = await setUpForTeamsSession(
        "Dummy Group",
        "Best League",
        "Winter 23",
        "U-18",
        "Sussy Sauls",
      );
    });
  });

  describe("createTeamsSession", () => {
    it("should create a new session", async () => {
      const sampleData = await setUpForTeamsSession(
        "Dummy Group",
        "Best League",
        "Winter 23",
        "U-18",
        "Sussy Sauls",
      );

      const req = {
        body: {
          team_id: sampleData.teamId,
          session_id: sampleData.sessionId,
        },
      };

      const res = createMockResponse();

      const next = jest.fn();

      await TeamsSessionController.createTeamsSession(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          team_id: sampleData.teamId,
          session_id: sampleData.sessionId,
        }),
      );
    });

    it("should handle error during teams session creation, when passing in an invalid id", async () => {
      const sampleData = await setUpForTeamsSession(
        "Big Group",
        "top League",
        "Summer 23",
        "1st",
        "Sussy Sauls",
      );

      const req = {
        body: {
          team_id: sampleData.teamId,
          session_id: "Yo momma",
        },
      };

      const res = createMockResponse();

      const next = jest.fn();

      await TeamsSessionController.createTeamsSession(req, res, next);

      const nextArgs = next.mock.calls[0];
      const caughtError = nextArgs[0];

      expect(next).toHaveBeenCalled();
      expect(caughtError).toEqual(
        expect.objectContaining({
          name: "SequelizeDatabaseError",
          original: expect.objectContaining({
            sqlMessage:
              "Incorrect integer value: 'Yo momma' for column 'session_id' at row 1",
          }),
        }),
      );
    });

    it("should handle error during team session creation, when passing in an unexisting team id", async () => {
      const sampleData = await setUpForTeamsSession(
        "Big Group 2",
        "top League 2",
        "Summer 25",
        "2nd",
        "Sussy Sauls",
      );

      const req = {
        body: { team_id: sampleData.teamId, session_id: 111 },
      };

      const res = createMockResponse();

      const next = jest.fn();

      await TeamsSessionController.createTeamsSession(req, res, next);

      const nextArgs = next.mock.calls[0];
      const caughtError = nextArgs[0];

      expect(next).toHaveBeenCalled();
      expect(caughtError.toString()).toMatch(
        /^SequelizeForeignKeyConstraintError: Cannot add or update a child row:/,
      );
    });

    it("should handle error during team session creation, when passing in an unexisting team id", async () => {
      const sampleData = await setUpForTeamsSession(
        "Big Group 2",
        "top League 2",
        "Summer 25",
        "2nd",
        "Sussy Sauls",
      );

      const req = {
        body: { team_id: 111, session_id: sampleData.sessionId },
      };

      const res = createMockResponse();

      const next = jest.fn();

      await TeamsSessionController.createTeamsSession(req, res, next);

      const nextArgs = next.mock.calls[0];
      const caughtError = nextArgs[0];

      expect(next).toHaveBeenCalled();
      expect(caughtError.toString()).toMatch(
        /^SequelizeForeignKeyConstraintError: Cannot add or update a child row:/,
      );
    });
  });

  describe("UpdateTeamsSession", () => {
    it("update a team session successfully", async () => {
      const sampleData = await setUpForTeamsSession(
        "Big Group 2",
        "top League 2",
        "Summer 25",
        "2nd",
        "Sussy Sauls",
      );
      const oldTeamsSession = await createSampleTeamsSession();

      const req = {
        body: {
          id: oldTeamsSession.teamsSessionData.id,
          team_id: sampleData.teamId,
          session_id: oldTeamsSession.teamsSessionData.session_id,
        },
      };

      const res = createMockResponse();
      const next = jest.fn();

      await TeamsSessionController.updateTeamsSession(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          team_id: sampleData.teamId,
          session_id: oldTeamsSession.teamsSessionData.session_id,
        }),
      );
    });

    it("should not update a team session, if id is not valid", async () => {
      const sampleData = await setUpForTeamsSession(
        "Big Group",
        "top League",
        "Summer 23",
        "1st",
        "Sussy Sauls",
      );
      const oldTeamsSession = await createSampleTeamsSession();
      const newSession = await TestDb.Session.create({
        division_id: sampleData.divisionId,
        season_id: sampleData.seasonId,
      });

      const req = {
        body: {
          team_id: oldTeamsSession.id,
          session_id: newSession.id,
        },
      };
      const res = createMockResponse();
      const next = jest.fn();

      await TeamsSessionController.updateTeamsSession(req, res, next);

      const nextArgs = next.mock.calls[0];
      const caughtError = nextArgs[0];

      expect(next).toHaveBeenCalled();
      expect(caughtError.toString()).toMatch(
        'Error: WHERE parameter "id" has invalid "undefined" value',
      );
    });
  });

  describe("getTeamSessionBySessionId", () => {
    it("returns found Sessions based on the id", async () => {
      const newTeamsSession = await createSampleTeamsSession();

      const req = { body: { id: newTeamsSession.teamsSessionData.session_id } };
      const res = createMockResponse();
      const next = jest.fn();

      await TeamsSessionController.getTeamSessionBySessionId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            session_id: newTeamsSession.teamsSessionData.session_id,
          }),
        ]),
      );
    });

    it("returns error if team sessions id does not exist", async () => {
      const ghostSessionId = 1234;

      const req = { body: { id: ghostSessionId } };
      const res = createMockResponse();
      const next = jest.fn();

      await TeamsSessionController.getTeamSessionBySessionId(req, res, next);

      const nextArgs = next.mock.calls[0];
      const caughtError = nextArgs[0];

      expect(next).toHaveBeenCalled();
      expect(caughtError.toString()).toMatch(
        "Error: group with given id has no teams",
      );
    });
  });

  describe("deleteTeamsSession", () => {
    it("delete a session successfully", async () => {
      const newTeamsSession = await createSampleTeamsSession();

      const req = { body: { id: newTeamsSession.teamsSessionData.id } };
      const res = createMockResponse();
      const next = jest.fn();

      await TeamsSessionController.deleteTeamsSession(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.body).toEqual("delete team session successfully");
    });

    it("sends error if a team session is not found", async () => {
      const ghostSessionId = 789;

      const req = { body: { id: ghostSessionId } };
      const res = createMockResponse();
      const next = jest.fn();

      await TeamsSessionController.deleteTeamsSession(req, res, next);

      const nextArgs = next.mock.calls[0];
      const caughtError = nextArgs[0];

      expect(next).toHaveBeenCalled();
      expect(caughtError.toString()).toMatch(
        "Error: no team session found with the given id",
      );
    });
  });
});
