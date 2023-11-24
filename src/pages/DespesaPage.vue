<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Home" />
      <q-breadcrumbs-el label="Despesas" />
    </q-breadcrumbs>
  </div>
  <q-page padding>
      <div class="q-pa-md">
        <q-table
          title="Despesas"
          :rows="rows"
          :columns="columns"
          row-key="name"
          :visible-columns="visibleColumns"
        >
          <template v-slot:top>
            <span class="text-h5">Despesas</span>
            <q-space />
            <q-btn color="primary" label="Adicionar despesa" size="sm" href="/formDespesa" />
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn color="negative" icon="delete" label="" dense size="sm" @click="handleDeleteDespesa(props.row.id)" />
            </q-td>
          </template>
        </q-table>
      </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import despesaService from 'src/services/despesas'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'DespesaPage',
  setup () {
    const $q = useQuasar()
    const rows = ref([])
    const { list, remove } = despesaService()
    const columns = [
      { name: 'id', label: 'Id', align: 'left', field: 'id', sortable: true },
      { name: 'descricao', required: true, label: 'Descrição', align: 'left', field: row => row.descricao, format: val => `${val}`, sortable: true },
      { name: 'data', required: true, label: 'Data', align: 'left', field: row => row.data, format: val => `${new Date(val).toLocaleString('pt-BR')}`, sortable: true },
      { name: 'valor', required: true, label: 'Valor', align: 'left', field: row => row.valor, format: val => `${val.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`, sortable: true },
      { name: 'usuario_id', required: false, label: 'Usuario Id', align: 'left', field: 'usuario', sortable: true },
      { name: 'usuario', required: true, label: 'Usuario', align: 'left', field: row => row.usuario_name, format: val => `${val}`, sortable: true },
      { name: 'actions', field: 'actions', label: 'Ações', align: 'right' }
    ]

    onMounted(() => {
      getRows()
    })

    const getRows = async () => {
      try {
        const { data } = await list()
        rows.value = data
      } catch (error) {
        console.error(error.message)
      }
    }

    const handleDeleteDespesa = async (id) => {
      try {
        $q.dialog({
          title: 'Confirmação exclusão',
          message: 'Confirma a exclusão da despesa?',
          persistent: true,
          ok: {
            label: 'sim',
            color: 'positive'
          },
          cancel: {
            push: true,
            label: 'não',
            color: 'negative'
          }
        }).onOk(async () => {
          const retorno = await remove(id)
          $q.notify({
            message: retorno.message,
            color: 'positive',
            icon: 'check'
          })
          await getRows()
        })
      } catch (error) {
        $q.notify({
          message: error.message,
          color: 'negative',
          icon: 'error'
        })
      }
    }

    return {
      visibleColumns: ['id', 'descricao', 'data', 'valor', 'usuario', 'actions'],
      columns,
      rows,
      handleDeleteDespesa
    }
  }
})
</script>
