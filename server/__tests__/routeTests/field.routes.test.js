"use strict";

window.setImmediate = window.setTimeout;

const TestDataGenerator = require("../../utilityFunctions/testDataGenerator.js");
const request = require("supertest");
const express = require("express");
const FieldRoutes = require("../../routes/field.routes");
const Middlewares = require("../../middlewares.js");
const app = express();
app.use(express.json());
const dummyCheckJwt = (req, res, next) => next();
app.use("/fields", FieldRoutes(dummyCheckJwt));
app.use(Middlewares.errorHandler);
const testDb = require("../../models");

describe("Field Routes", () => {
  beforeEach(async () => {
    await testDb.Group.sync();
    await testDb.Fields.sync();
  });

  // ------------------- Create Tests ----------------

  it("should handle POST /create", async () => {
    const groupM = await TestDataGenerator.createDummyGroup("Salinas");

    const response = await request(app).post("/fields/").send({
      group_id: groupM.id,
      name: "SOMOS Park",
      address: "123 SOMOS Lane",
      length: 500,
      width: 200,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({ name: "SOMOS Park" }),
    );
  });

  it("should not create if name is not unique POST /create", async () => {
    const groupM = await TestDataGenerator.createDummyGroup("Saul's Group");

    await testDb.Fields.create({
      group_id: groupM.id,
      name: "SOMOS Park",
      address: "123 SOMOS Lane",
      length: 500,
      width: 200,
    });

    const response = await request(app).post("/fields/").send({
      group_id: groupM.id,
      name: "SOMOS Park",
      address: "528 Average Ave",
      length: 200,
      width: 50,
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: "name is not unique",
    });
  });

  it("should create a field with the same name from a different group POST /create", async () => {
    const groupUno =
      await TestDataGenerator.createDummyGroup("Watsonville Corp.");
    const groupDos = await TestDataGenerator.createDummyGroup("Salinas Inc.");

    await testDb.Fields.create({
      group_id: groupUno.id,
      name: "SOMOS Park",
      address: "123 SOMOS Lane",
      length: 200,
      width: 50,
    });

    const response = await request(app).post("/fields/").send({
      group_id: groupDos.id,
      name: "SOMOS Park",
      address: "528 Average Ave",
      length: 200,
      width: 50,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({ name: "SOMOS Park" }),
    );
  });

  // ------------------- Update Tests ----------------

  it("should update field with valid ID and input PATCH /patch", async () => {
    const groupM = await TestDataGenerator.createDummyGroup("Salinas");
    const field = await testDb.Fields.create({
      group_id: groupM.id,
      name: "SOMOS Park",
      address: "123 SOMOS Lane",
      length: 200,
      width: 50,
    });

    const updatedFieldName = "Cascarita Park";
    const response = await request(app)
      .patch(`/fields/${field.id}`)
      .send({ name: updatedFieldName });

    expect(response.status).toBe(200);

    const updatedField = await testDb.Fields.findByPk(field.id);
    expect(updatedField.name).toBe(updatedFieldName);
  });

  it("should return an error if field not found PATCH /patch", async () => {
    const nonExistentFieldId = "9999";

    const response = await request(app)
      .patch(`/fields/${nonExistentFieldId}`)
      .send({ name: "Joe Mo Mah Lawn" });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: "field with given id was not found",
    });
  });

  it("should not update if the new name is already used in the group", async () => {
    const groupM = await TestDataGenerator.createDummyGroup("Salinas");

    const field1 = await testDb.Fields.create({
      group_id: groupM.id,
      name: "SOMOS Park",
      address: "123 SOMOS Lane",
      length: 200,
      width: 50,
    });
    const field2 = await testDb.Fields.create({
      group_id: groupM.id,
      name: "Cascarita University",
      address: "123 SOMOS Lane",
      length: 200,
      width: 50,
    });

    const response = await request(app)
      .patch(`/fields/${field2.id}`)
      .send({ name: "SOMOS Park" });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: "name is not unique",
    });

    const updatedField2 = await testDb.Fields.findByPk(field2.id);
    expect(updatedField2.name).toBe("Cascarita University");
  });

  // ------------------- Delete Tests ----------------

  it("should delete a field with a valid field ID DELETE /delete", async () => {
    const groupM = await TestDataGenerator.createDummyGroup("Salinas");
    const field = await testDb.Fields.create({
      group_id: groupM.id,
      name: "SOMOS Park",
      address: "123 SOMOS Lane",
      length: 200,
      width: 200,
    });

    const response = await request(app).delete(`/fields/${field.id}`).send();

    expect(response.status).toBe(204);
    expect(await testDb.Fields.findByPk(field.id)).toBeNull();
  });

  it("should return an error when attempting to delete a non-existant field DELETE /delete", async () => {
    const response = await request(app).delete("/fields/999").send();

    expect(response.status).toBe(404);
  });

  // ------------------------------------------------

  afterEach(async () => {
    await testDb.Fields.destroy({ where: {} });
    await testDb.Group.destroy({ where: {} });
  });

  afterAll(async () => {
    await testDb.sequelize.close();
  });
});
