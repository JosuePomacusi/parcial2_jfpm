<script setup lang="ts">
import ProgramaList from '@/components/programa/ProgramaList.vue'
import ProgramaSave from '@/components/programa/ProgramaSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const programaListRef = ref<typeof ProgramaList | null>(null)
const programaEdit = ref<any>(null)

function handleCreate() {
  programaEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(programa: any) {
  programaEdit.value = programa
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  programaListRef.value?.obtenerLista()
  mostrarDialog.value = false
}
</script>

<template>
  <div class="m-7">
    <h2 class="mb-3">Gestión de Programas de Postgrado</h2>

    <Button label="Crear Nuevo Programa" icon="pi pi-plus" @click="handleCreate" class="mb-3" />

    <ProgramaList ref="programaListRef" @edit="handleEdit" />

    <ProgramaSave :mostrar="mostrarDialog" :programa="programaEdit" :modoEdicion="!!programaEdit"
      @guardar="handleGuardar" @close="handleCloseDialog" />
  </div>
</template>

<style scoped></style>
