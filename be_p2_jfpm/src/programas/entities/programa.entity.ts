import { NivelAcademico } from "src/niveles_academicos/entities/nivel_academico.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('programas')
export class Programa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'id_nivel_academico' })
    idNivelAcademico: number;

    @Column('varchar', { length: 100 })
    nombre: string;

    @Column('varchar', { length: 2000 })
    descripcion: string;

    @Column('integer')
    version: number;

    @Column('integer', { name: 'duracion_meses' })
    duracionMeses: number;

    @Column('decimal', { precision: 12, scale: 2 })
    costo: number;

    @Column('date')
    fechaInicio: Date;

    @Column('varchar', { length: 20 })
    estado: string;

    @Column('varchar', { length: 20, name: 'area_conocimiento' })
    areaConocimiento: string;

    @CreateDateColumn({ name: 'fecha_creacion' })
    fechaCreacion: Date;

    @UpdateDateColumn({ name: 'fecha_modificacion' })
    fechaModificacion: Date;

    @DeleteDateColumn({ name: 'fecha_eliminacion' })
    fechaEliminacion: Date;

    @ManyToOne(() => NivelAcademico, nivelAcademico => nivelAcademico.programas)
    @JoinColumn({ name: 'id_nivel_academico', referencedColumnName: 'id' })
    nivelAcademico: NivelAcademico;
}
