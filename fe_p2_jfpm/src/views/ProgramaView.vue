<script setup lang="ts">
import ProgramaList from '@/components/programa/ProgramaList.vue'
import ProgramaSave from '@/components/programa/ProgramaSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'

// Estados reactivos
const mostrarDialog = ref(false)
const programaListRef = ref<typeof ProgramaList | null>(null)
const programaEdit = ref<any>(null)

// Crear nuevo programa
function handleCreate() {
  programaEdit.value = null
  mostrarDialog.value = true
}

// Editar programa existente
function handleEdit(programa: any) {
  programaEdit.value = programa
  mostrarDialog.value = true
}

// Cerrar el diálogo
function handleCloseDialog() {
  mostrarDialog.value = false
}

// Refrescar lista luego de guardar
function handleGuardar() {
  programaListRef.value?.obtenerLista()
  mostrarDialog.value = false
}
</script>

<template>
  <div class="m-7">
    <h2 class="mb-3">Gestión de Programas de Postgrado</h2>

    <Button label="Crear Nuevo Programa" icon="pi pi-plus" @click="handleCreate" class="mb-3" />

    <!-- Lista de programas -->
    <ProgramaList ref="programaListRef" @edit="handleEdit" />

    <!-- Diálogo de creación/edición -->
    <ProgramaSave :mostrar="mostrarDialog" :programa="programaEdit" :modoEdicion="!!programaEdit"
      @guardar="handleGuardar" @close="handleCloseDialog" />
  </div>
</template>

<style scoped></style>
