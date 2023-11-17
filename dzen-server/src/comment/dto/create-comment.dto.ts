import {
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUrl,
  IsAlphanumeric,
  IsPositive,
} from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  captcha: string;

  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsUrl()
  homepage?: string;

  @IsOptional()
  @IsPositive()
  parent_id?: number;

  @IsOptional()
  image?: number;
}
