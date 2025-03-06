"use strict";

window.setImmediate = window.setTimeout;

const request = require("supertest");
const express = require("express");

const TestDataGenerator = require("../../utilityFunctions/testDataGenerator.js");
const { Division, Group, sequelize } = require("../../models");
const DivisionRoutes = require("../../routes/division.routes");
const { errorHandler } = require("../../middlewares.js");

const app = express();
app.use(express.json());
const dummyCheckJwt = (req, res, next) => next();
app.use("/divisions", DivisionRoutes(dummyCheckJwt));
app.use(errorHandler);

describe("Division routes", () => {
  beforeEach(async () => {
    await Group.sync();
    await Division.sync();
  });

  afterEach(async () => {
    await Division.destroy({ where: {} });
    await Group.destroy({ where: {} });
  });

  describe("POST /divisions", () => {
    it("Should create a division", async () => {
      const group = await TestDataGenerator.createDummyGroup("Group Tres");
      const form = { group_id: group.id, name: "New Division" };

      const response = await request(app).post("/divisions").send(form);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({ name: form.name }),
      );
    });

    it("Should fail if division name validation fails", async () => {
      const group = await TestDataGenerator.createDummyGroup("Foo");
      // Validation will fail because the name is too short
      const form = { group_id: group.id, name: "" };

      const response = await request(app).post("/divisions").send(form);

      expect(response.status).toBe(400);
    });

    it("Should fail if division name is not unique", async () => {
      const group = await TestDataGenerator.createDummyGroup("Group Cinco");

      // Create a division with the same name
      await Division.create({
        group_id: group.id,
        name: "Division name",
      });

      const form = { group_id: group.id, name: "Division name" };

      const response = await request(app).post("/divisions").send(form);
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "division name must be unique",
      });
    });

    it("Should fail if group not found", async () => {
      const invalidGroupId = 29;
      const form = { group_id: invalidGroupId, name: "New Division" };

      const response = await request(app).post("/divisions").send(form);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: `failed to find a group with id ${invalidGroupId}`,
      });
    });
  });

  describe("PATCH /divisions/:id", () => {
    it("Should update a division", async () => {
      const group = await TestDataGenerator.createDummyGroup("Group Tres");
      const division = await Division.create({
        group_id: group.id,
        name: "Division name",
      });
      const form = { name: "new name" };

      const response = await request(app)
        .patch(`/divisions/${division.id}`)
        .send(form);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ name: form.name });
    });

    it("Should fail if division not found", async () => {
      const invalidDivisionId = 29;
      const form = { name: "new name" };

      const response = await request(app)
        .patch(`/divisions/${invalidDivisionId}`)
        .send(form);

      expect(response.status).toBe(404);
    });

    it("Should fail if validation fails", async () => {
      const group = await TestDataGenerator.createDummyGroup("Group");
      const division = await Division.create({
        group_id: group.id,
        name: "Division name",
      });
      const form = { name: "s" };

      const response = await request(app)
        .patch(`/divisions/${division.id}`)
        .send(form);

      expect(response.status).toBe(500);
    });
  });

  describe("DELETE /divisions/:id", () => {
    it("Should delete a division", async () => {
      const group = await TestDataGenerator.createDummyGroup("Group");
      const division = await Division.create({
        group_id: group.id,
        name: "Division name",
      });

      const response = await request(app).delete(`/divisions/${division.id}`);

      expect(response.status).toBe(204);
    });

    it("Should fail if division not found", async () => {
      const invalidDivisionId = 29;

      const response = await request(app).delete(
        `/divisions/${invalidDivisionId}`,
      );

      expect(response.status).toBe(404);
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
