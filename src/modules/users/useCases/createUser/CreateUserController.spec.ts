import { Connection } from "typeorm";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import createConnection from "../../../../database";
import { hash } from "bcryptjs";
import { app } from "../../../../app";

let connection: Connection;

describe("CreateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at) VALUES ('${id}', 'admin', 'admin@finapi.com.br', '${password}', 'now()', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "user",
      email: "user@example.com",
      password: "password",
    });

    expect(response.status).toBe(201);

  });
});
