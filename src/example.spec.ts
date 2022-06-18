import { FREE_POST_LIMIT } from './config';

describe('example unit test', () => {
  it('ensure FREE_POST_LIMIT is a number', async () => {
    expect(typeof FREE_POST_LIMIT === 'number').toBeTruthy();
  });
});
