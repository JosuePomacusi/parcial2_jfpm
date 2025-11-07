<script setup lang="ts">
import type { Programa } from '@/models/programa'
import http from '@/plugins/axios'
import { ref, onMounted, computed } from 'vue'
import { Button, Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'

const ENDPOINT = 'programas'

const programas = ref<Programa[]>([])
const programaDelete = ref<Programa | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref('')
const emit = defineEmits(['edit'])

const programasFiltradas = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return programas.value
  return programas.value.filter((programa) =>
    (programa.nombre || '').toLowerCase().includes(q) ||
    (programa.nivelAcademico?.nombre || '').toLowerCase().includes(q)
  )
})

async function obtenerLista() {
  try {
    const resp = await http.get(ENDPOINT)
    programas.value = resp.data
  } catch (error) {
    console.error('Error al obtener programas', error)
  }
}

function emitirEdicion(programa: Programa) {
  emit('edit', programa)
}

function mostrarEliminarConfirm(programa: Programa) {
  programaDelete.value = programa
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  try {
    if (!programaDelete.value?.id) return
    await http.delete(`${ENDPOINT}/${programaDelete.value.id}`)
    await obtenerLista()
  } catch (error) {
    console.error('Error eliminando programa', error)
  } finally {
    mostrarConfirmDialog.value = false
    programaDelete.value = null
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString()
  } catch {
    return dateStr
  }
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3 mb-4">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o nivel académico" />
      </InputGroup>
    </div>

    <DataTable :value="programasFiltradas" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} a {last} de {totalRecords}">
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text @click="obtenerLista" />
      </template>

      <Column field="nombre" header="Nombre" sortable style="min-width: 180px" />

      <Column header="Nivel Académico" sortable style="min-width: 160px">
        <template #body="{ data }">
          <span>{{ data.nivelAcademico?.nombre ?? 'Sin nivel' }}</span>
        </template>
      </Column>

      <Column field="version" header="Versión" sortable style="min-width: 100px" />
      <Column field="duracionMeses" header="Duración (meses)" sortable style="min-width: 120px" />
      <Column field="costo" header="Costo (Bs.)" sortable style="min-width: 120px">
        <template #body="{ data }">
          <span>{{ data.costo != null ? Number(data.costo).toFixed(2) : '' }}</span>
        </template>
      </Column>
      <Column header="Fecha Inicio" sortable style="min-width: 140px">
        <template #body="{ data }">
          <span>{{ formatDate(data.fechaInicio) }}</span>
        </template>
      </Column>
      <Column field="estado" header="Estado" sortable style="min-width: 140px" />
      <Column field="areaConocimiento" header="AreaConocimiento" sortable style="min-width: 140px" />

      <Column header="Acciones" frozen align-frozen="right" style="min-width: 160px;">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
          <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>¿Estás seguro de que deseas eliminar el programa <b>{{ programaDelete?.nombre }}</b>?</p>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="mostrarConfirmDialog = false" />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
