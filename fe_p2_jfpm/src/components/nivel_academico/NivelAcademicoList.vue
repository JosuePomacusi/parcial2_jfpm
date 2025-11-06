<script setup lang="ts">
import type { NivelAcademico } from '@/models/nivel_academico'
import http from '@/plugins/axios'
import { ref, onMounted, computed } from 'vue'
import { Button, Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'

const ENDPOINT = 'niveles_academicos'

const niveles = ref<NivelAcademico[]>([])
const nivelDelete = ref<NivelAcademico | null>(null)
const mostrarConfirmDialog = ref(false)
const busqueda = ref('')
const emit = defineEmits(['edit'])

const nivelesFiltrados = computed(() =>
  niveles.value.filter(n =>
    n.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    (n.descripcion?.toLowerCase() ?? '').includes(busqueda.value.toLowerCase())
  )
)

async function obtenerLista() {
  niveles.value = await http.get(ENDPOINT).then(res => res.data)
}

function emitirEdicion(nivel: NivelAcademico) {
  emit('edit', nivel)
}

function mostrarEliminarConfirm(nivel: NivelAcademico) {
  nivelDelete.value = nivel
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${nivelDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o descripción" />
      </InputGroup>
    </div>

    <DataTable :value="nivelesFiltrados" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20]"
      tableStyle="min-width: 50rem">
      <template #paginatorstart>
        <Button icon="pi pi-refresh" text @click="obtenerLista" />
      </template>

      <Column field="nombre" header="Nombre" sortable style="min-width: 150px" />
      <Column field="descripcion" header="Descripción" style="min-width: 300px" />
      <Column header="Acciones" style="min-width: 120px" align-frozen="right">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" text @click="emitirEdicion(data)" />
          <Button icon="pi pi-trash" text @click="mostrarEliminarConfirm(data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar eliminación" :style="{ width: '25rem' }">
      <p>¿Seguro que deseas eliminar el nivel académico <strong>{{ nivelDelete?.nombre }}</strong>?</p>
      <div class="flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="mostrarConfirmDialog = false" />
        <Button label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>
