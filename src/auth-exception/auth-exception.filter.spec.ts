import { AuthExceptionFilter } from './auth-exception.filter';

describe('AuthExceptionFilter', () => {
  it('should be defined', () => {
    expect(new AuthExceptionFilter()).toBeDefined();
  });
});
