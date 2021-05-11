import supertest from "supertest";
import { getConnection } from "typeorm";
import { Project } from "../src/entities/Project";
import { initializeDB } from "../src/db";

import { FORBIDDEN, OK } from "http-status-codes";
import { Response, SuperTest, Test } from "supertest";

import app from "../src/Server";
import { pErr } from "../src/shared/functions";

describe("Project Routes", () => {
  const projectsPath = "/api/projects";

  let agent: SuperTest<Test>;

  const testProjects = [
    {
      projectName: "Project Name 1",
      startDate: "10/12/1992",
      endDate: "5/11/2021",
      uuid: "ThisisaUUID",
    },
    {
      projectName: "Project Name 2",
      startDate: "10/12/1999",
      endDate: "5/21/2021",
      uuid: "ThisisanotherUUID",
    },
  ];

  async function createTestData() {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Project)
      .values(testProjects)
      .execute();
  }

  async function destroyTestData() {
    await getConnection().createQueryBuilder().delete().from(Project).execute();
  }

  beforeAll(async () => {
    agent = supertest.agent(app);
    await initializeDB();
    await destroyTestData();
    await createTestData();
  });

  afterAll(async () => {
    await destroyTestData();
  });

  describe(`"GET:${projectsPath}"`, () => {
    it(`should return a forbidden response if request's user is unable to be validated`, () => {
      agent.get(projectsPath).end((err: Error, res: Response) => {
        pErr(err);
        expect(res.status).toBe(FORBIDDEN);
      });
    });
  });
});
