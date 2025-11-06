import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateNivelAcademicoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre no debe estar vacío' })
  @IsString({ message: 'El campo nombre debe ser de tip cadena' })
  @MaxLength(20, { message: 'El campo nombre no debe exceder los 20 caracteres' })
  nombre: string;

  @ApiProperty()
  @IsOptional({ message: 'El campo descripcion es opcional' })
  @IsString({ message: 'El campo nombre debe ser de tip cadena' })
  @MaxLength(500, { message: 'El campo descripcion no debe exceder los 500 caracteres' })
  descripcion?: string;
}
