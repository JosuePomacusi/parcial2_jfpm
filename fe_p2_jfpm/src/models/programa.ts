import type { NivelAcademico } from './nivel_academico'

export interface Programa {
  id: number
  nombre: string
  descripcion: string
  version: number
  duracion_meses: number
  costo: number
  fecha_inicio: string
  estado: 'En Planificación' | 'En curso' | 'Finalizado'
  nivelAcademico: NivelAcademico
  fecha_creacion?: string
  fecha_modificacion?: string
  fecha_eliminacion?: string
}
