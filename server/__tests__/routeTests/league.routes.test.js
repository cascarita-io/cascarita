"use strict";

window.setImmediate = window.setTimeout;
window.setImmediate = window.setTimeout;

const TestDataGenerator = require("../../utilityFunctions/testDataGenerator.js");
const request = require("supertest");
const express = require("express");
const LeagueRoutes = require("../../routes/league.routes");
const Middlewares = require("../../middlewares.js");
const app = express();
app.use(express.json());
const dummyCheckJwt = (req, res, next) => next();
app.use("/leagues", LeagueRoutes(dummyCheckJwt));
app.use(Middlewares.errorHandler);
const testDb = require("../../models");

describe("League Routes", () => {
  beforeEach(async () => {
    await testDb.Group.sync();
    await testDb.League.sync();
    await testDb.Season.sync();
    await testDb.Division.sync();
    await testDb.Session.sync();
    await testDb.Team.sync();
    await testDb.TeamsSession.sync();
  });

  // ------------------- Get League by Group ID Tests ----------------

  it("should handle GET /getLeagueByGroupId", async () => {
    const groupM = await TestDataGenerator.createDummyGroup("Group Uno");

    await testDb.League.create({ group_id: groupM.id, name: "Leeroy League" });
    await testDb.League.create({
      group_id: groupM.id,
      name: "Martin Martians",
    });

    const response = await request(app).get(`/leagues/${groupM.id}`).send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it("should not get any leagues with GET /getLeagueByGroupId", async () => {
    const groupM = await TestDataGenerator.createDummyGroup("Group Uno");

    const response = await request(app).get(`/leagues/${groupM.id}`).send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

it("should get teams by league id", async () => {
  const group = await TestDataGenerator.createDummyGroup("Group Uno");

  const league = await testDb.League.create({
    group_id: group.id,
    name: "My League",
  });

  const season = await testDb.Season.create({
    name: "Winter 2024",
    start_date: "2024-11-01 00:00:00",
    end_date: "2025-03-14 11:59:00",
    is_active: true,
    league_id: league.id,
  });

  const division = await testDb.Division.create({
    group_id: group.id,
    name: "Division 1",
  });

  const session = await testDb.Session.create({
    division_id: division.id,
    season_id: season.id,
  });

  const team = await testDb.Team.create({
    name: "Team A",
    group_id: group.id,
  });

  await testDb.TeamsSession.create({
    session_id: session.id,
    team_id: team.id,
  });

  const response = await request(app)
    .get(`/leagues/${league.id}/seasons`)
    .send();

  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(1);
  expect(Object.keys(response.body[0].Team)).toHaveLength(6);
  expect(response.body[0].Team.name).toBe("Team A");
});

it("should fail if league not found", async () => {
  // Use an invalid league ID
  const invalidLeagueId = 99999;

  const response = await request(app)
    .get(`/leagues/${invalidLeagueId}/seasons`)
    .send();

  expect(response.status).toBe(404);
  expect(response.body).toMatchObject({
    message: `no such season with id ${invalidLeagueId}`, // Adjust the message as per your controller's error message
  });
});

// ------------------- Create Tests ----------------

it("should handle POST /create", async () => {
  const groupM = await TestDataGenerator.createDummyGroup("Salinas");

  const response = await request(app)
    .post("/leagues/")
    .send({ group_id: groupM.id, name: "SOMOS" });

  expect(response.status).toBe(201);
  expect(response.body).toEqual(expect.objectContaining({ name: "SOMOS" }));
});

it("should not create if name is not unique POST /create", async () => {
  const groupM = await TestDataGenerator.createDummyGroup("Saul's Group");

  await testDb.League.create({ group_id: groupM.id, name: "Salinas" });

  const response = await request(app)
    .post("/leagues/")
    .send({ group_id: groupM.id, name: "Salinas" });

  expect(response.status).toBe(400);
  expect(response.body).toMatchObject({
    message: "name is not unique",
  });
});

it("should create a league with the same name from a different group POST /create", async () => {
  const groupUno =
    await TestDataGenerator.createDummyGroup("Watsonville Corp.");
  const groupDos = await TestDataGenerator.createDummyGroup("Salinas Inc.");

  await testDb.League.create({ group_id: groupUno.id, name: "Summer 2024" });

  const response = await request(app)
    .post("/leagues/")
    .send({ group_id: groupDos.id, name: "Summer 2024" });

  expect(response.status).toBe(201);
  expect(response.body).toEqual(
    expect.objectContaining({ name: "Summer 2024" }),
  );
});

// ------------------- Update Tests ----------------

it("should update league with valid ID and input PATCH /patch", async () => {
  const groupM = await TestDataGenerator.createDummyGroup("Salinas");
  const league = await testDb.League.create({
    group_id: groupM.id,
    name: "SOMOS",
  });

  const updatedLeagueName = "Sopa Marucha";
  const response = await request(app)
    .patch(`/leagues/${league.id}`)
    .send({ name: updatedLeagueName });

  expect(response.status).toBe(200);

  const updatedLeague = await testDb.League.findByPk(league.id);
  expect(updatedLeague.name).toBe(updatedLeagueName);
});

it("should return an error if league not found PATCH /patch", async () => {
  const nonExistentLeagueId = "9999";

  const response = await request(app)
    .patch(`/leagues/${nonExistentLeagueId}`)
    .send({ name: "Joe Mo Mah Inc." });

  expect(response.status).toBe(400);
  expect(response.body).toMatchObject({
    message: "league with given id was not found",
  });
});

it("should not update if the new name is already used in the group", async () => {
  const groupM = await TestDataGenerator.createDummyGroup("Salinas");

  const league1 = await testDb.League.create({
    group_id: groupM.id,
    name: "Shrek League",
  });
  const league2 = await testDb.League.create({
    group_id: groupM.id,
    name: "Donkey League",
  });

  const response = await request(app)
    .patch(`/leagues/${league2.id}`)
    .send({ name: "Shrek League" });

  expect(response.status).toBe(500);
  expect(response.body).toMatchObject({
    message: "name is not unique",
  });

  const updatedLeague2 = await testDb.League.findByPk(league2.id);
  expect(updatedLeague2.name).toBe("Donkey League");
});

// ------------------- Delete Tests ----------------

it("should delete a league with a valid league ID DELETE /delete", async () => {
  const groupM = await TestDataGenerator.createDummyGroup("Salinas");
  const league = await testDb.League.create({
    group_id: groupM.id,
    name: "SOMOS",
  });

  const response = await request(app).delete(`/leagues/${league.id}`).send();

  expect(response.status).toBe(204);
  expect(await testDb.League.findByPk(league.id)).toBeNull();
});

it("should return an error when attempting to delete a non-existant league DELETE /delete", async () => {
  const response = await request(app).delete("/leagues/999").send();

  expect(response.status).toBe(404);
});

// ------------------------------------------------

afterEach(async () => {
  await testDb.TeamsSession.destroy({ where: {} });
  await testDb.Team.destroy({ where: {} });
  await testDb.Session.destroy({ where: {} });
  await testDb.Division.destroy({ where: {} });
  await testDb.Season.destroy({ where: {} });
  await testDb.League.destroy({ where: {} });
  await testDb.Group.destroy({ where: {} });
});

afterAll(async () => {
  await testDb.sequelize.close();
});
