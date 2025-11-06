<script setup lang="ts">
import type { Programa } from '@/models/programa'
import type { NivelAcademico } from '@/models/nivel_academico'
import http from '@/plugins/axios'
import { Button, Dialog, InputNumber, InputText, Select, Textarea, Calendar } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'programas'

const props = defineProps({
  mostrar: Boolean,
  programa: {
    type: Object as () => Programa,
    default: () => ({}) as Programa,
  },
  modoEdicion: Boolean,
})

const emit = defineEmits(['guardar', 'close'])

const niveles = ref<NivelAcademico[]>([])
const programa = ref<Programa>({ ...props.programa })
const idNivelAcademico = ref<number | null>(null)

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

async function obtenerNiveles() {
  try {
    const response = await http.get('niveles_academicos')
    niveles.value = response.data
  } catch (error) {
    console.error('Error cargando niveles académicos', error)
  }
}

async function handleSave() {
  try {
    const body = {
      idNivelAcademico: idNivelAcademico.value,
      nombre: programa.value.nombre,
      descripcion: programa.value.descripcion,
      version: programa.value.version,
      duracionMeses: programa.value.duracionMeses,
      costo: programa.value.costo,
      fechaInicio: programa.value.fechaInicio,
      estado: programa.value.estado,
    }

    if (props.modoEdicion && programa.value.id) {
      await http.patch(`${ENDPOINT}/${programa.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar el programa')
  }
}

watch(
  () => props.mostrar,
  async (nuevoValor) => {
    if (nuevoValor) {
      await obtenerNiveles()

      if (props.programa?.id) {
        programa.value = { ...props.programa }
        programa.value.fechaInicio = new Date(props.programa.fechaInicio)
        idNivelAcademico.value = props.programa.nivelAcademico?.id ?? null
      } else {

        programa.value = {
          nombre: '',
          descripcion: '',
          version: 1,
          duracionMeses: 0,
          costo: 0,
          fechaInicio: new Date(),
          estado: 'En Planificación',
        } as Programa
        idNivelAcademico.value = null
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="dialogVisible" :header="props.modoEdicion ? 'Editar Programa' : 'Crear Programa'"
      style="width: 35rem" modal>
      <!-- Nivel académico -->
      <div class="flex items-center gap-4 mb-4">
        <label for="nivel" class="font-semibold w-4">Nivel académico</label>
        <Select id="nivel" v-model="idNivelAcademico" :options="niveles" optionLabel="nombre" optionValue="id"
          class="flex-auto" placeholder="Seleccione un nivel" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-4">Nombre</label>
        <InputText id="nombre" v-model="programa.nombre" class="flex-auto" autocomplete="off" maxlength="100"
          placeholder="Ej. Maestría en Desarrollo Web" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="descripcion" class="font-semibold w-4">Descripción</label>
        <Textarea id="descripcion" v-model="programa.descripcion" class="flex-auto" rows="3" maxlength="2000"
          placeholder="Breve descripción del programa" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="version" class="font-semibold w-4">Versión</label>
        <InputNumber id="version" v-model="programa.version" class="flex-auto" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="duracion" class="font-semibold w-4">Duración (meses)</label>
        <InputNumber id="duracion" v-model="programa.duracionMeses" class="flex-auto" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="costo" class="font-semibold w-4">Costo (Bs.)</label>
        <InputNumber id="costo" v-model="programa.costo" mode="currency" currency="BOB" locale="es-BO"
          class="flex-auto" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="fecha" class="font-semibold w-4">Fecha de inicio</label>
        <Calendar id="fecha" v-model="programa.fechaInicio" class="flex-auto" dateFormat="dd/mm/yy" showIcon />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="estado" class="font-semibold w-4">Estado</label>
        <Select id="estado" v-model="programa.estado" :options="['En Planificación', 'En curso', 'Finalizado']"
          class="flex-auto" placeholder="Seleccione estado" />
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" @click="dialogVisible = false" />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
