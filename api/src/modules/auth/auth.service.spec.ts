import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/shared/database/repositories/users.repositories';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/database/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: { create: jest.Mock };
  let jwtService: { signAsync: jest.Mock };
  let prismaService: { user: { findFirst: jest.Mock } };

  beforeEach(async () => {
    userRepo = {
      create: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-token'),
    };
    prismaService = {
      user: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: userRepo },
        { provide: JwtService, useValue: jwtService },
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('deve cadastrar com e-mail normalizado (minúsculo e sem espaços nas bordas)', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      userRepo.create.mockResolvedValue({ id: 'user-123' });

      const result = await service.signup({
        name: 'John Doe',
        email: '  JoHn.DoE@ExAmPlE.cOm  ',
        password: 'password123',
      });

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: {
            equals: 'john.doe@example.com',
            mode: 'insensitive',
          },
        },
        select: { id: true },
      });

      expect(userRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'hashed_password',
          }),
        }),
      );

      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 'user-123' });
      expect(result).toEqual({ accessToken: 'mock-token' });
    });

    it('deve lançar ConflictException quando o e-mail já estiver em uso', async () => {
      prismaService.user.findFirst.mockResolvedValue({ id: 'existing-user' });

      await expect(
        service.signup({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);

      expect(userRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('signin', () => {
    it('deve lançar UnauthorizedException quando a senha estiver errada', async () => {
      prismaService.user.findFirst.mockResolvedValue({
        id: 'user-123',
        password: 'hashed_password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.signin({
          email: 'john@example.com',
          password: 'wrong_password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException quando o usuário não existir', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        service.signin({
          email: 'unknown@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve autenticar com sucesso quando as credenciais estiverem corretas', async () => {
      prismaService.user.findFirst.mockResolvedValue({
        id: 'user-123',
        password: 'hashed_password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.signin({
        email: 'john@example.com',
        password: 'correct_password',
      });

      expect(result).toEqual({ accessToken: 'mock-token' });
    });
  });
});
