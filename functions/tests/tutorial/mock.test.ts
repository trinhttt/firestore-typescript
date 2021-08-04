import axios from 'axios';

jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: { foo: 'bar' }})
}))

test('mock axios.get', async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
  expect(response.data).toEqual({ foo: 'bar' });
});