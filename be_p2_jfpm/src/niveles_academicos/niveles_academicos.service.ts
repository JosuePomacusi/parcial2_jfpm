import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNivelAcademicoDto } from './dto/create-nivel_academico.dto';
import { UpdateNivelAcademicoDto } from './dto/update-nivel_academico.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NivelAcademico } from './entities/nivel_academico.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NivelesAcademicosService {
  constructor(
    @InjectRepository(NivelAcademico)
    private nivelesAcademicosRepository: Repository<NivelAcademico>,
  ) {}

  async create(createNivelAcademicoDto: CreateNivelAcademicoDto): Promise<NivelAcademico> {
    const existe = await this.nivelesAcademicosRepository.findOneBy({
      nombre: createNivelAcademicoDto.nombre.trim(),
    });

    if (existe) throw new ConflictException('El nivel académico ya existe');

    const nivel = new NivelAcademico();
    Object.assign(nivel, createNivelAcademicoDto);
    return this.nivelesAcademicosRepository.save(nivel);
  }

  async findAll(): Promise<NivelAcademico[]> {
    return this.nivelesAcademicosRepository.find({
      order: { id: 'ASC' },
      select: ['id', 'nombre', 'descripcion'],
    });
  }

  async findOne(id: number): Promise<NivelAcademico> {
    const nivel = await this.nivelesAcademicosRepository.findOneBy({ id });
    if (!nivel) throw new NotFoundException('El nivel académico no existe');
    return nivel;
  }

  async update(
    id: number,
    updateNivelAcademicoDto: UpdateNivelAcademicoDto,
  ): Promise<NivelAcademico> {
    const nivel = await this.findOne(id);
    Object.assign(nivel, updateNivelAcademicoDto);
    return this.nivelesAcademicosRepository.save(nivel);
  }

  async remove(id: number): Promise<NivelAcademico> {
    const nivel = await this.findOne(id);
    return this.nivelesAcademicosRepository.softRemove(nivel);
  }
}
