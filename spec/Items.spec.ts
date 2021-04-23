import supertest from "supertest";
import { getConnection } from "typeorm";
import { Item } from "../src/entities/Item";
import { initializeDB } from "../src/db";

import { OK } from "http-status-codes";
import { Response, SuperTest, Test } from "supertest";

import app from "../src/Server";
import { pErr } from "../src/shared/functions";

describe("Items Routes", () => {
  const itemsPath = "/api/items";

  let agent: SuperTest<Test>;
  const testItems = [
    {
      itemName: "test 1",
      itemPrice: 10,
      quantity: 2,
      category: "material",
      date: "",
      minutes: 0,
      hours: 0,
    },
    {
      itemName: "test 2",
      itemPrice: 20,
      quantity: 2,
      category: "material",
      date: "",
      minutes: 0,
      hours: 0,
    },
  ];

  async function createTestData() {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Item)
      .values(testItems)
      .execute();
  }

  async function destroyTestData() {
    await getConnection().createQueryBuilder().delete().from(Item).execute();
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

  describe(`"GET:${itemsPath}"`, () => {
    it(`should return a JSON object with all the items and a status code of "${OK}" if the
            request was successful.`, () => {
      agent.get(itemsPath).end((err: Error, res: Response) => {
        pErr(err);
        expect(res.status).toBe(OK);
        const retItems = res.body.items;
        expect(retItems).toEqual(testItems);
        expect(res.body.error).toBeUndefined();
      });
    });
  });
});
