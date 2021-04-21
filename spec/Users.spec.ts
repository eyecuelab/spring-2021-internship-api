import supertest from 'supertest';
import { getConnection } from 'typeorm';
import { User } from '../src/entities/User';
import { initializeDB } from '../src/db';

import { OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';

import app from '../src/Server';
import { pErr } from '../src/shared/functions';

describe('Users Routes', () => {
  const usersPath = '/api/users';

  let agent: SuperTest<Test>;
  const testUsers = [
    { firstName: 'Jack', lastName: 'Ripper', age: 14, email: 'test@example.com' },
    { firstName: 'Elon', lastName: 'Carman', age: 63, email: 'test2@example.com' },
  ];

  async function createTestData() {
    await getConnection().createQueryBuilder().insert().into(User).values(testUsers).execute();
  }

  async function destroyTestData() {
    await getConnection().createQueryBuilder().delete().from(User).execute();
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

  describe(`"GET:${usersPath}"`, () => {
    it(`should return a JSON object with all the users and a status code of "${OK}" if the
            request was successful.`, () => {
      agent.get(usersPath).end((err: Error, res: Response) => {
        pErr(err);
        expect(res.status).toBe(OK);
        const retUsers = res.body.users;
        expect(retUsers).toEqual(testUsers);
        expect(res.body.error).toBeUndefined();
      });
    });
  });
});
