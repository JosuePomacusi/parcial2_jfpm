<script setup lang="ts">
import NivelesList from '@/components/nivel_academico/NivelAcademicoList.vue'
import NivelSave from '@/components/nivel_academico/NivelAcademicoSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const nivelesListRef = ref<typeof NivelesList | null>(null)
const nivelEdit = ref<any>(null)

function handleCreate() {
  nivelEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(nivel: any) {
  nivelEdit.value = nivel
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  nivelesListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="m-7">
    <h2>Niveles Académicos</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <NivelesList ref="nivelesListRef" @edit="handleEdit" />
    <NivelSave
      :mostrar="mostrarDialog"
      :nivel="nivelEdit"
      :modoEdicion="!!nivelEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
