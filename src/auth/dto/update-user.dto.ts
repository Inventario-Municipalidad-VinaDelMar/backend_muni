import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'La contraseña debe tener una Mayúscula, letra minúscula y un numero',
    })
    @IsOptional()
    password?: string;

    @IsString()
    @Matches(/^(\d{1,2}\d{3}\d{3})-?([\dkK])$/, {
        message: 'El RUT no es válido',
    })
    @IsOptional()
    rut?: string;

    @IsString()
    @MinLength(3)
    @IsOptional()
    nombre?: string;

    @IsString()
    @MinLength(3)
    @IsOptional()
    apellidoPaterno?: string;

    @IsString()
    @MinLength(3)
    @IsOptional()
    apellidoMaterno?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })  // Valida que cada elemento del array sea un string
    roles?: string[];
}

