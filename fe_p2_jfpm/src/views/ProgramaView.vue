<script setup lang="ts">
import { ref } from 'vue'
import ProgramaList from '@/components/programa/ProgramaList.vue'
import ProgramaSave from '@/components/programa/ProgramaSave.vue'
import type { Programa } from '@/models/programa'

const mostrar = ref(false)
const modoEdicion = ref(false)
const programaSeleccionado = ref<Programa | null>(null)

function nuevo() {
  programaSeleccionado.value = {} as Programa
  modoEdicion.value = false
  mostrar.value = true
}

function editar(programa: Programa) {
  programaSeleccionado.value = programa
  modoEdicion.value = true
  mostrar.value = true
}

function cerrar() {
  mostrar.value = false
}

function recargar() {
  listaRef.value?.obtenerLista()
}

const listaRef = ref<any>(null)
</script>

<template>
  <div class="card p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Gestión de Programas</h2>
      <Button label="Crear Programa" icon="pi pi-plus" @click="nuevo" />
    </div>

    <ProgramaList ref="listaRef" @edit="editar" />

    <ProgramaSave :mostrar="mostrar" :programa="programaSeleccionado" :modoEdicion="modoEdicion" @close="cerrar"
      @guardar="recargar" />
  </div>
</template>

<style scoped></style>
