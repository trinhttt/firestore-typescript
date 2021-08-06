import { addHeaders, USER_EMAIL, USER_NAME, USER_PASSWORD } from './mock';
import supertest from 'supertest';
import app from '../../../../src/index'

describe('Signup basic route', () => {
  const endpoint = '/users'
  const request = supertest(app.api)
  beforeEach(() => {
    // init
  });

  afterEach(() => {
    // clear 
  });

  it('Should send error when empty body is sent', async () => {
    const response = await addHeaders(request.post(endpoint))
    // expect(response.type).toMatch('application/json')
    expect(response.status).toBe(400)
  });

  it('Should send error when email is not sent', async () => {
    const response = await addHeaders(request.post(endpoint)).send({
      password: USER_PASSWORD,
    })

    expect(response.status).toBe(400)
    expect(response.body.isSuccess).toBeFalsy()
    expect(response.body.message).toMatch('email/password is empty')
  });

  it('Should send error when password is not sent', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: USER_EMAIL,
      }),
    );
    expect(response.status).toBe(400)
    expect(response.body.isSuccess).toBeFalsy()
    expect(response.body.message).toMatch('email/password is empty')
  });

  it('Should send error when email is not valid format', async () => {
    // expect.assertions(1);
    try {
      const response = await addHeaders(
        request.post(endpoint).send({
          email: USER_NAME,
          password: USER_PASSWORD
        })
      )
      expect(response.status).toBe(500)
      expect(response.body.isSuccess).toBeFalsy()
      expect(response.body.message).toEqual("The email address is badly formatted.");
    } catch (e) {
      expect(e).toEqual({
        error: 'The email address is already in use by another account.',
      });
    }
  });

  it('Should send error when user is registered for email', async (done) => {
    // expect.assertions(1);
    try {
      const response = await addHeaders(
        request.post(endpoint).send({
          email: USER_EMAIL,
          password: USER_PASSWORD
        })
      )
      expect(response.status).toBe(500)
      expect(response.body.isSuccess).toBeFalsy()
      expect(response.body.message).toEqual("The email address is already in use by another account.");
    } catch (e) {
      expect(e).toEqual({
        error: 'The email address is badly formatted.',
      });
    }
  });

  it('Should send success response for correct data', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      }),
    );
    expect(response.status).toBe(200);
    // expect(response.body.message).toMatch(/Success/i);
    // expect(response.body.data).toBeDefined();
    // expect(response.body.data).toHaveProperty('_id');
  });
});
