import {
  JsonController,
  Authorized,
  Get,
  Param,
  Post,
  BodyParam,
  BadRequestError,
} from 'routing-controllers';
import { BaseEntity } from 'typeorm';
import User from '../entity/User';
import { Role } from '../types';
import { roleLevels } from '../lib/helpers/roles';

@JsonController()
export default class UserController {
  @Authorized(Role.ADMIN)
  @Post('/users')
  async signup(
    @BodyParam('firstName') firstName: string,
    @BodyParam('lastName') lastName: string,
    @BodyParam('username') username: string,
    @BodyParam('password') password: string,
    @BodyParam('email') email: string,
  ) {
    if (!username || !password) {
      throw new BadRequestError('Provide at least a username and password');
    }
    const userExists = await User.count({
      where: [{ username }, { email }],
    });
    if (userExists > 0) {
      throw new BadRequestError(
        'User with that username or email already exists',
      );
    }

    const entity = User.create({
      firstName,
      lastName,
      username,
      email,
      roles: roleLevels(Role.USER),
    });
    await entity.setPassword(password);

    try {
      const user = await entity.save();

      // io.emit('action', {
      //   type: 'ADD_USER',
      //   payload: entity
      // })

      return user;
    } catch (err) {
      throw new BadRequestError(err);
    }
  }

  @Authorized(Role.ADMIN)
  @Get('/users/:id([0-9]+)')
  getUser(@Param('id') id: number) {
    return User.findOne(id);
  }

  @Authorized(Role.ADMIN)
  @Get('/users')
  allUsers() {
    return User.find();
  }
}
