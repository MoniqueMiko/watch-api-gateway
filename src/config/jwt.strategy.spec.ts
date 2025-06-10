import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // limpa o cache
    process.env = { ...OLD_ENV, JWT_SECRET: 'test-secret' };
    strategy = new JwtStrategy();
  });

  afterAll(() => {
    process.env = OLD_ENV; // restaura env original
  });

  it('deve ser definido', () => {
    expect(strategy).toBeDefined();
  });

  it('deve extrair token do cabeçalho Authorization', () => {
    const extractor = ExtractJwt.fromAuthHeaderAsBearerToken();
    const token = extractor({ headers: { authorization: 'Bearer token123' } } as any);
    expect(token).toBe('token123');
  });

  it('validate deve retornar o payload corretamente', async () => {
    const mockPayload = { sub: 'user123', email: 'user@test.com' };
    const result = await strategy.validate(mockPayload);
    expect(result).toEqual(mockPayload);
  });
});