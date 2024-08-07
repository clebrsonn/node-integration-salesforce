import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric('en-US', {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  //   @Matches(passwordRegEx, {
  //     message: `Password must contain Minimum 8 and maximum 20 characters,
  //       at least one uppercase letter,
  //       one lowercase letter,
  //       one number and
  //       one special character`,
  //   })
  @IsStrongPassword(
    {},
    {
      message: `Password must contain Minimum 8 and maximum 20 characters,
          at least one uppercase letter,
          one lowercase letter,
          one number and
          one special character`,
    },
  )
  @ApiProperty()
  password: string;
}
