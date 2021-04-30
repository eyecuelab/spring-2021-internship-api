import supertest from "supertest";
import { getConnection } from "typeorm";
import { Project } from "../src/entities/Project";
import { initializeDB } from "../src/db";

import { OK } from "http-status-codes";
import { Response, SuperTest, Test } from "supertest";

import app from "../src/Server";
import { pErr } from "../src/shared/functions";

describe("Project Routes", () => {
  const projectsPath = "/api/projects";
  const projectsIDPath = "/api/projects/1";

  let agent: SuperTest<Test>;
  const testProjects = [
    {
      id: 1,
      projectName: "Project Name One",
      startDate: "2019-04-28",
      endDate: "2019-04-28",
    },
    {
      id: 2,
      projectName: "Project Name Two",
      startDate: "2019-04-28",
      endDate: "2019-04-28",
    },
  ];

  const testPostProject = [
    {
      projectName: "Project Name Three",
      startDate: "2020-04-28",
      endDate: "2020-04-28",
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

  // describe(`"GET:${projectsPath}"`, () => {
  //   it(`should return a JSON object with all the projects and a status code of "${OK}" if the
  //           request was successful.`, () => {
  //     agent.get(projectsPath).end((err: Error, res: Response) => {
  //       pErr(err);
  //       expect(res.status).toBe(OK);
  //       const retProjects = res.body.projects;
  //       expect(retProjects).toEqual(testProjects);
  //       expect(res.body.error).toBeUndefined();
  //     });
  //   });
  // });

  // describe(`"GET:${projectsIDPath}"`, () => {
  //   it(`should return a JSON object with one project matching the request URL param and a status code of "${OK}" if the
  //           request was successful.`, () => {
  //     agent.get(`${projectsIDPath}`).end((err: Error, res: Response) => {
  //       pErr(err);
  //       expect(res.status).toBe(OK);
  //       const retProjects = res.body.projects;
  //       expect(retProjects).toEqual(testProjects[0]);
  //       expect(res.body.error).toBeUndefined();
  //     });
  //   });
  // });

  // describe(`"POST:${projectsPath}/"`, () => {
  //   it(`should add a project to DB and return a status code of "${OK}" if the
  //           request was successful.`, () => {
  //     agent.post(projectsPath).send(testPostProject);
  //     agent.get(projectsPath).end((err: Error, res: Response) => {
  //       pErr(err);
  //       expect(res.status).toBe(OK);
  //       const retProject = res.body.project;
  //       expect(retProject).toEqual(testPostProject);
  //       expect(res.body.error).toBeUndefined();
  //     });
  //   });
  // });
});
