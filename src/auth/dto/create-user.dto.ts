import {
    IsArray,
    IsEmail,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'La contraseña debe tener una Mayúscula, letra minúscula y un numero',
    })
    password: string;

    @IsString()
    @Matches(/^(\d{1,2}\d{3}\d{3})-?([\dkK])$/, {
        message: 'El RUT no es válido',
    })
    rut: string;

    @IsString()
    @MinLength(3)
    nombre: string;

    @IsString()
    @MinLength(3)
    apellidoPaterno: string;

    @IsString()
    @MinLength(3)
    apellidoMaterno: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })  // Valida que cada elemento del array sea un string
    roles?: string[];  // Uso de ? para indicar que es opcional
}
