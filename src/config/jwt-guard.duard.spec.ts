import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtGuard } from './jwt-guard.guard';
import { AuthGuard } from '@nestjs/passport';

describe('JwtGuard', () => {
  let guard: JwtGuard;

  beforeEach(() => {
    guard = new JwtGuard();
  });

  describe('canActivate', () => {
    it('deve chamar super.canActivate', () => {
      const context = {} as ExecutionContext;
      const superSpy = jest.spyOn(AuthGuard('jwt').prototype, 'canActivate').mockReturnValue(true as any);

      const result = guard.canActivate(context);
      expect(result).toBe(true);
      superSpy.mockRestore();
    });
  });

  describe('handleRequest', () => {
    it('deve retornar o usuário se não houver erro', () => {
      const user = { id: '123', email: 'user@test.com' };
      const result = guard.handleRequest(null, user, null);
      expect(result).toEqual(user);
    });

    it('deve lançar UnauthorizedException se user for null', () => {
      expect(() => guard.handleRequest(null, null, 'Token inválido')).toThrow(UnauthorizedException);
    });

    it('deve lançar erro original se err existir', () => {
      const customError = new Error('Algo deu errado');
      expect(() => guard.handleRequest(customError, null, null)).toThrow(customError);
    });
  });
});