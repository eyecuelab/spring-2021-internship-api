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
  const itemsPathId = "/api/items/2";

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

  const testItem = [
    {
      id: 2,
      itemName: "test 2",
      itemPrice: 20,
      quantity: 2,
      category: "material",
      date: "",
      minutes: 0,
      hours: 0,
    },
  ];

  const testItemPost = [
    {
      itemName: "pose test 1",
      itemPrice: 20,
      quantity: 2,
      category: "material",
      date: "",
      minutes: 0,
      hours: 0,
    },
  ];

  const testItemPut = [
    {
      itemName: "update test 1",
      itemPrice: 1000,
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
  // describe(`"GET:${itemsPathId}"`, () => {
  //   it(`should return a JSON object with the item with and id of 2 and a status code of "${OK}" if the
  //           request was successful.`, () => {
  //     agent.get(itemsPathId).end((err: Error, res: Response) => {
  //       pErr(err);
  //       expect(res.status).toBe(OK);
  //       const retItem = res.body.item;
  //       expect(retItem).toEqual(testItem);
  //       expect(res.body.error).toBeUndefined();
  //     });
  //   });
  // });
  describe(`"POST:${itemsPath}"`, () => {
    it(`should return a JSON object with the item with and id of 2 and a status code of "${OK}" if the
            request was successful.`, () => {
      agent
        .post(itemsPath)
        .send(testItemPost)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);
          const retItem = res.body.item;
          expect(retItem).toEqual(testItemPost);
          expect(res.body.error).toBeUndefined();
        });
    });
  });
  describe(`"PUT:${itemsPathId}"`, () => {
    it(`should return a JSON object with the item with and id of 2 and a status code of "${OK}" if the
            request was successful.`, () => {
      agent
        .put(itemsPathId)
        .send(testItemPut)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);
          const retItem = res.body.item;
          expect(retItem).toEqual(testItemPut);
          expect(res.body.error).toBeUndefined();
        });
    });
  });
  // describe(`"DELETE:${itemsPathId}"`, () => {
  //   it(`should return a JSON object with the item with and id of 2 and a status code of "${OK}" if the
  //           request was successful.`, () => {
  //     agent.put(itemsPathId).end((err: Error, res: Response) => {
  //       pErr(err);
  //       expect(res.status).toBe(OK);
  //       const retItem = res.body.item;
  //       expect(retItem).toEqual();
  //       expect(res.body.error).toBeUndefined();
  //     });
  //   });
  // });
});
