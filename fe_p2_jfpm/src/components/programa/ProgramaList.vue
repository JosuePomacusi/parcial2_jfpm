<script setup lang="ts">
import type { Programa } from '@/models/programa'
import http from '@/plugins/axios'
import { ref, onMounted, computed } from 'vue'
import { Button, Dialog, DataTable, Column, InputText } from 'primevue'

const ENDPOINT = 'programas'

const programas = ref<Programa[]>([])
const busqueda = ref('')
const programaEliminar = ref<Programa | null>(null)
const mostrarDialogEliminar = ref(false)

const emit = defineEmits<{
  (e: 'edit', programa: Programa): void
}>()

async function obtenerLista() {
  programas.value = await http.get(ENDPOINT).then((res) => res.data)
}

const programasFiltrados = computed(() => {
  return programas.value.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function editar(programa: Programa) {
  emit('edit', programa)
}

function confirmarEliminar(programa: Programa) {
  programaEliminar.value = programa
  mostrarDialogEliminar.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${programaEliminar.value?.id}`)
  mostrarDialogEliminar.value = false
  obtenerLista()
}

onMounted(() => obtenerLista())

defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-6 mt-3">
      <input class="input-search" type="text" v-model="busqueda" placeholder="Buscar programa..." />
    </div>

    <table class="table-auto border-collapse w-full mt-4">
      <thead>
        <tr>
          <th class="border p-2">#</th>
          <th class="border p-2">Nombre</th>
          <th class="border p-2">Nivel</th>
          <th class="border p-2">Versión</th>
          <th class="border p-2">Duración</th>
          <th class="border p-2">Costo</th>
          <th class="border p-2">Estado</th>
          <th class="border p-2">Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(p, index) in programasFiltrados" :key="p.id" class="hover:bg-gray-100">
          <td class="border p-2">{{ index + 1 }}</td>
          <td class="border p-2">{{ p.nombre }}</td>
          <td class="border p-2">{{ p.nivelAcademico?.nombre }}</td>
          <td class="border p-2">{{ p.version }}</td>
          <td class="border p-2">{{ p.duracionMeses }} meses</td>
          <td class="border p-2">Bs. {{ p.costo }}</td>
          <td class="border p-2">{{ p.estado }}</td>

          <td class="border p-2">
            <Button icon="pi pi-pencil" text @click="editar(p)" />
            <Button icon="pi pi-trash" text severity="danger" @click="confirmarEliminar(p)" />
          </td>
        </tr>
      </tbody>
    </table>

    <Dialog v-model:visible="mostrarDialogEliminar" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>
        ¿Eliminar el programa <b>{{ programaEliminar?.nombre }}</b>?
      </p>
      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancelar" severity="secondary" @click="mostrarDialogEliminar = false" />
        <Button label="Eliminar" severity="danger" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>
