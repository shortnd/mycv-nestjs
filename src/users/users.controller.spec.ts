import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakerUsersService: Partial<UsersService>;
  let fakerAuthService: Partial<AuthService>;

  beforeEach(async () => {
    // const users: User[] = [];
    fakerUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakerAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakerUsersService,
        },
        {
          provide: AuthService,
          useValue: fakerAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdf@asdf.com');
    expect(users.length).toBe(1);
    expect(users[0].email).toBe('asdf@asdf.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws if id is not found', async (done) => {
    fakerUsersService.findOne = () => null;
    try {
      await controller.findUser('1');
    } catch (err) {
      done();
    }
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn(
      {
        email: 'asdf@asdf.com',
        password: 'asdf',
      },
      session,
    );
    expect(user.id).toBe(1);
    expect(session.userId).toBeDefined();
  });

  it('whoAmI should return with users information', async () => {
    const user = { id: 1, email: 'asdf@asdf.com' } as User;
    const result = await controller.whoAmI(user);
    expect(result).toBeDefined();
  });
});
