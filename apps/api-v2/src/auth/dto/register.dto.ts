import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator'

export class RegisterDto {
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name: string

    @IsOptional()
    @IsString()
    @MaxLength(50)
    firstName?: string

    @IsOptional()
    @IsString()
    @MaxLength(50)
    lastName?: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password: string
}
