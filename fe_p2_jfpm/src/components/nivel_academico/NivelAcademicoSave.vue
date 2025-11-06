<script setup lang="ts">
import type { NivelAcademico } from '@/models/nivel_academico'
import http from '@/plugins/axios'
import { ref, computed, watch } from 'vue'
import { Button, Dialog, InputText, Textarea } from 'primevue'

const ENDPOINT = 'niveles_academicos'

const props = defineProps<{
  mostrar: boolean
  nivel: NivelAcademico | null
  modoEdicion: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'guardar'): void
}>()

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (v) => {
    if (!v) emit('close')
  },
})

const form = ref<NivelAcademico>({
  id: 0,
  nombre: '',
  descripcion: '',
})

watch(
  () => props.nivel,
  (n) => {
    if (n) form.value = { ...n }
    else form.value = { id: 0, nombre: '', descripcion: '' }
  },
  { immediate: true },
)

async function guardar() {
  const body = {
    nombre: form.value.nombre,
    descripcion: form.value.descripcion,
  }

  if (props.modoEdicion) {
    await http.patch(`${ENDPOINT}/${form.value.id}`, body)
  } else {
    await http.post(ENDPOINT, body)
  }

  emit('guardar')
  dialogVisible.value = false
}
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    :header="props.modoEdicion ? 'Editar Nivel Académico' : 'Nuevo Nivel Académico'"
    style="width: 30rem"
  >
    <div class="mb-3">
      <label>Nombre</label>
      <InputText v-model="form.nombre" class="w-full" />
    </div>

    <div class="mb-3">
      <label>Descripción</label>
      <Textarea v-model="form.descripcion" rows="3" class="w-full" />
    </div>

    <div class="flex justify-end gap-2 mt-3">
      <Button label="Cancelar" severity="secondary" @click="dialogVisible = false" />
      <Button label="Guardar" @click="guardar" />
    </div>
  </Dialog>
</template>
