export const addHeaders = (request: any) =>
  request.set('Content-Type', 'application/json').timeout(20000);

export const USER_EMAIL = 'ttt1@gmail.com';
export const USER_PASSWORD = 'abc123';
export const USER_NAME = 'abc123';