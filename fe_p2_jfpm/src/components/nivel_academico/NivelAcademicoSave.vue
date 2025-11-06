<script setup lang="ts">
import type { NivelAcademico } from '@/models/nivel_academico'
import http from '@/plugins/axios'
import { ref, watch, computed } from 'vue'
import { Button, Dialog, InputText, Textarea } from 'primevue'

const ENDPOINT = 'niveles_academicos'

const props = defineProps({
  mostrar: Boolean,
  nivel: {
    type: Object as () => NivelAcademico,
    default: () => ({}) as NivelAcademico,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (val) => { if (!val) emit('close') },
})

const nivel = ref<NivelAcademico>({ ...props.nivel })

watch(() => props.nivel, (nuevo) => {
  nivel.value = { ...nuevo }
})

async function handleSave() {
  try {
    const body = {
      nombre: nivel.value.nombre,
      descripcion: nivel.value.descripcion,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${nivel.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar')
  }
}
</script>

<template>
  <Dialog v-model:visible="dialogVisible"
    :header="props.modoEdicion ? 'Editar Nivel Académico' : 'Nuevo Nivel Académico'" style="width: 30rem">
    <div class="flex flex-column gap-4">
      <div>
        <label for="nombre" class="font-semibold">Nombre</label>
        <InputText id="nombre" v-model="nivel.nombre" class="w-full" maxlength="20" />
      </div>

      <div>
        <label for="descripcion" class="font-semibold">Descripción</label>
        <Textarea id="descripcion" v-model="nivel.descripcion" class="w-full" rows="4" maxlength="500" />
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-4">
      <Button label="Cancelar" severity="secondary" @click="dialogVisible = false" />
      <Button label="Guardar" icon="pi pi-save" @click="handleSave" />
    </div>
  </Dialog>
</template>
