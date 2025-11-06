<script setup lang="ts">
import type { Programa } from '@/models/programa'
import type { NivelAcademico } from '@/models/nivel_academico'
import http from '@/plugins/axios'
import { Button, Dialog, InputText, Textarea, Dropdown } from 'primevue'
import { computed, ref, watch, onMounted } from 'vue'

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

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const programa = ref<Programa>({ ...props.programa })

watch(
  () => props.programa,
  (newVal) => {
    programa.value = { ...newVal }
  }
)

const listaNiveles = ref<NivelAcademico[]>([])

async function cargarNiveles() {
  const res = await http.get('niveles_academicos')
  listaNiveles.value = res.data
}

onMounted(() => {
  cargarNiveles()
})

async function handleSave() {
  try {
    const body = {
      idNivelAcademico: programa.value.idNivelAcademico,
      nombre: programa.value.nombre,
      descripcion: programa.value.descripcion,
      version: programa.value.version,
      duracionMeses: programa.value.duracionMeses,
      costo: programa.value.costo,
      fechaInicio: programa.value.fechaInicio,
      estado: programa.value.estado,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${programa.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    programa.value = {} as Programa
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="dialogVisible" :header="props.modoEdicion ? 'Editar Programa' : 'Crear Programa'"
      style="width: 35rem">
      <div class="flex items-center gap-4 mb-4">
        <label class="font-semibold w-4">Nivel</label>
        <Dropdown v-model="programa.idNivelAcademico" :options="listaNiveles" optionLabel="nombre" optionValue="id"
          placeholder="Seleccione" class="flex-auto" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label class="font-semibold w-4">Nombre</label>
        <InputText v-model="programa.nombre" class="flex-auto" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label class="font-semibold w-4">Descripción</label>
        <Textarea v-model="programa.descripcion" rows="4" class="flex-auto" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label class="font-semibold w-4">Versión</label>
        <InputText type="number" v-model="programa.version" class="flex-auto" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label class="font-semibold w-4">Duración</label>
        <InputText type="number" v-model="programa.duracionMeses" class="flex-auto" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label class="font-semibold w-4">Costo</label>
        <InputText type="number" v-model="programa.costo" class="flex-auto" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label class="font-semibold w-4">Fecha Inicio</label>
        <InputText type="date" v-model="programa.fechaInicio" class="flex-auto" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label class="font-semibold w-4">Estado</label>
        <Dropdown v-model="programa.estado" :options="['En Planificación', 'En curso', 'Finalizado']"
          placeholder="Seleccione" class="flex-auto" />
      </div>

      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" @click="dialogVisible = false" />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
