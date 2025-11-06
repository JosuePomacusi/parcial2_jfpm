<script setup lang="ts">
import type { NivelAcademico } from '@/models/nivel_academico'
import http from '@/plugins/axios'
import { Button } from 'primevue'
import { ref, computed, onMounted } from 'vue'

const ENDPOINT = 'niveles_academicos'

const niveles = ref<NivelAcademico[]>([])
const busqueda = ref('')
const nivelEliminar = ref<NivelAcademico | null>(null)
const mostrarDialogEliminar = ref(false)

const emit = defineEmits<{
  (e: 'edit', nivel: NivelAcademico): void
}>()

const nivelesFiltrados = computed(() => {
  return niveles.value.filter((n) => n.nombre.toLowerCase().includes(busqueda.value.toLowerCase()))
})

async function obtenerLista() {
  niveles.value = await http.get(ENDPOINT).then((res) => res.data)
}

function editar(nivel: NivelAcademico) {
  emit('edit', nivel)
}

function confirmarEliminar(nivel: NivelAcademico) {
  nivelEliminar.value = nivel
  mostrarDialogEliminar.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${nivelEliminar.value?.id}`)
  mostrarDialogEliminar.value = false
  obtenerLista()
}

onMounted(() => obtenerLista())

defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-6 mt-3">
      <input class="input-search" type="text" v-model="busqueda" placeholder="Buscar nivel académico..." />
    </div>

    <table class="table-auto border-collapse w-full mt-4">
      <thead>
        <tr>
          <th class="border p-2">#</th>
          <th class="border p-2">Nombre</th>
          <th class="border p-2">Descripción</th>
          <th class="border p-2">Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(nivel, index) in nivelesFiltrados" :key="nivel.id" class="hover:bg-gray-100">
          <td class="border p-2">{{ index + 1 }}</td>
          <td class="border p-2">{{ nivel.nombre }}</td>
          <td class="border p-2">{{ nivel.descripcion }}</td>
          <td class="border p-2">
            <Button icon="pi pi-pencil" text @click="editar(nivel)" />
            <Button icon="pi pi-trash" text @click="confirmarEliminar(nivel)" />
          </td>
        </tr>
      </tbody>
    </table>

    <Dialog v-model:visible="mostrarDialogEliminar" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>
        ¿Eliminar el nivel académico <b>{{ nivelEliminar?.nombre }}</b>?
      </p>

      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancelar" severity="secondary" @click="mostrarDialogEliminar = false" />
        <Button label="Eliminar" severity="danger" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>
