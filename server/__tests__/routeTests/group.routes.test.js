"use strict";

const TestDataGenerator = require("../../utilityFunctions/testDataGenerator.js");
const request = require("supertest");
const express = require("express");
const GroupRoutes = require("../../routes/group.routes");
const Middlewares = require("../../middlewares");
const TestDb = require("../../models");
const app = express();
app.use(express.json());
const dummyCheckJwt = (req, res, next) => next();
app.use("/groups", GroupRoutes(dummyCheckJwt));
app.use(Middlewares.errorHandler);

const sampleGroup = {
  name: "Sample Group",
  street_address: "123 Main Street",
  city: "Sample City",
  state: "CA",
  zip_code: "12345",
  logo_url: "https://example.com/logo",
};

const sampleErrorGroup = {
  name: "Sample Group",
  street_address: "123 Main Street",
  city: "Sample City",
  state: "01",
  zip_code: "12345",
  logo_url: "https://example.com/logo",
};

describe("Integration Tests for Group", () => {
  beforeEach(async function () {
    // await TestDb.League.sync();
    await TestDb.Division.sync();
    await TestDb.Fields.sync();
    await TestDb.Season.sync();
    await TestDb.Group.sync();
  });

  afterEach(async function () {
    // await TestDb.League.destroy({ where: {} });
    await TestDb.Division.destroy({ where: {} });
    await TestDb.Fields.destroy({ where: {} });
    await TestDb.Season.destroy({ where: {} });
    await TestDb.Group.destroy({ where: {} });
  });

  // ---------------- GET ----------------

  describe("GET/ Group routes", () => {
    it("successful GET of group information", async () => {
      const coolGroup =
        await TestDataGenerator.createDummyGroup("Sample Group");

      const response = await request(app).get(`/groups/${coolGroup.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: "Sample Group",
        }),
      );
    });

    it("returns an error when attempting to retrieve non-existent group", async () => {
      const missingGroup = { id: 12345 };
      const response = await request(app).get(`/groups/${missingGroup.id}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "group with given id was not found",
        }),
      );
    });
  });

  describe("GET /group/:id/divisions", () => {
    it("Should get a division by its group id", async () => {
      const group = await TestDataGenerator.createDummyGroup("Group Uno");
      await TestDb.Division.create({ group_id: group.id, name: "Division 1" });
      await TestDb.Division.create({ group_id: group.id, name: "Division 2" });

      const response = await request(app)
        .get(`/groups/${group.id}/divisions`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it("Should fail if group not found", async () => {
      const invalidId = 18321;
      const response = await request(app)
        .get(`/groups/${invalidId}/divisions`)
        .send();

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        message: `no such Group found for id ${invalidId}`,
      });
    });
  });

  describe("GET /group/:id/fields", () => {
    it("should handle GET /getFieldByGroupId", async () => {
      const group = await TestDataGenerator.createDummyGroup("Group Uno");

      await TestDb.Fields.create({
        group_id: group.id,
        name: "SOMOS Park",
        address: "123 SOMOS Lane",
        length: 500,
        width: 200,
      });
      await TestDb.Fields.create({
        group_id: group.id,
        name: "Cascarita University",
        address: "456 Soccer St.",
        length: 400,
        width: 150,
      });

      const response = await request(app)
        .get(`/groups/${group.id}/fields`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it("should not get any fields with GET /getFieldByGroupId", async () => {
      const group = await TestDataGenerator.createDummyGroup("Group Uno");

      const response = await request(app)
        .get(`/groups/${group.id}/fields`)
        .send();

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        message: "group with given id has no fields",
      });
    });
  });

  describe("GET /group/:id/leagues", () => {
    it("should handle GET /getLeagueByGroupId", async () => {
      const group = await TestDataGenerator.createDummyGroup("Group Uno");

      await TestDb.League.create({ group_id: group.id, name: "Leeroy League" });
      await TestDb.League.create({
        group_id: group.id,
        name: "Martin Martians",
      });

      const response = await request(app)
        .get(`/groups/${group.id}/leagues`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it("should not get any leagues with GET /getLeagueByGroupId", async () => {
      const group = await TestDataGenerator.createDummyGroup("Group Uno");

      const response = await request(app)
        .get(`/groups/${group.id}/leagues`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  // ---------------- UPDATE ----------------

  it("should PATCH group with valid ID and input", async () => {
    const coolGroup = await TestDataGenerator.createDummyGroup("Sample Group");

    const updatedGroupName = "Updated Sample Group";
    const response = await request(app)
      .patch(`/groups/${coolGroup.id}`)
      .send({ name: updatedGroupName });

    expect(response.status).toBe(200);

    const updatedGroup = await TestDb.Group.findByPk(coolGroup.id);
    expect(updatedGroup.name).toBe(updatedGroupName);
  });

  it("should PATCH group with valid ID and input for state", async () => {
    const coolGroup = await TestDataGenerator.createDummyGroup("Sample Group");

    const updatedGroupName = "Updated New York Sample Group";
    const updatedState = "NY";
    const response = await request(app)
      .patch(`/groups/${coolGroup.id}`)
      .send({ name: updatedGroupName, state: updatedState });

    expect(response.status).toBe(200);

    const updatedGroup = await TestDb.Group.findByPk(coolGroup.id);
    expect(updatedGroup.name).toBe(updatedGroupName);
    expect(updatedGroup.state).toBe(updatedState);
  });
});

afterAll(async () => {
  await TestDb.sequelize.close();
});
