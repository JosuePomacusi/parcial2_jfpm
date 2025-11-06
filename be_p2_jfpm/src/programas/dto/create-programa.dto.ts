import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateProgramaDto {
    @ApiProperty()
    @IsInt({ message: 'El campo id del nivel académico debe ser numérico' })
    idNivelAcademico: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'El campo nombre no debe estar vacío' })
    @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
    @MaxLength(100, { message: 'El campo nombre no debe exceder los 100 caracteres' })
    nombre: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'El campo descripción no debe estar vacío' })
    @IsString({ message: 'El campo descripción debe ser de tipo cadena' })
    @MaxLength(2000, { message: 'El campo descripción no debe exceder los 2000 caracteres' })
    descripcion: string;

    @ApiProperty()
    @IsInt({ message: 'El campo versión debe ser numérico' })
    version: number;

    @ApiProperty()
    @IsInt({ message: 'El campo duración en meses debe ser numérico' })
    duracionMeses: number;

    @ApiProperty()
    @IsNumber({}, { message: 'El campo costo debe ser numérico decimal' })
    costo: number;

    @ApiProperty()
    @IsDateString({}, { message: 'El campo fecha de inicio debe ser una fecha válida' })
    fechaInicio: Date;

    @ApiProperty()
    @IsString({ message: 'El campo estado debe ser de tipo cadena' })
    @MaxLength(20)
    estado: string;
}
