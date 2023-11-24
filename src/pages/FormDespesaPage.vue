<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Home" />
      <q-breadcrumbs-el label="Despesas" />
      <q-breadcrumbs-el label="Registro" />
    </q-breadcrumbs>
  </div>
  <q-page padding>
    <q-form
      @submit="onSubmit"
      class="q-gutter-md row"
    >
      <q-input
        v-model="descricao"
        label="Descrição *"
        lazy-rules
        clearable
        max-length=3
        class="col-md-6 col-xs-12"
        :rules="[ val => val && val.length > 0 && val.length <= 191 || 'Campo obrigatório e com máximo de 191 caracteres']"
        dense
      />

      <q-input v-model="data" dense class="col-md-3 col-xs-12" :rules="[ val => val && val.length > 0 || 'Campo obrigatório']">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="data" mask="DD/MM/YYYY HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="data" mask="DD/MM/YYYY HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input
        v-model="valor"
        label="Valor"
        lazy-rules
        clearable
        mask="#,##"
        fill-mask="0"
        reverse-fill-mask
        class="col-md-2 col-xs-12"
        dense
      />

      <div class="col-12 q-gutter-sm">
        <q-btn label="salvar" color="primary" class="float-right q-mr-lg" icon="save" size="sm" type="submit" />
        <q-btn label="cancelar" color="warning" class="float-right" icon="close" size="sm" href="/despesa" />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import despesaService from 'src/services/despesas'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'FormDespesaPage',
  setup () {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()
    const descricao = ref('')
    const data = ref('')
    const valor = ref('0')
    const id = ref('')

    const { post, getById, update } = despesaService()

    onMounted(async () => {
      if (route.params.id) {
        id.value = route.params.id
        const response = await getById(route.params.id)
        descricao.value = response.data.descricao
        let dataBR = new Date(response.data.data)
        dataBR = dataBR.toLocaleString('pt-BR')
        data.value = dataBR.replace(',', '')
        let valorBR = response.data.valor
        valorBR = valorBR.toLocaleString('pt-br', { minimumFractionDigits: 2 })
        valor.value = valorBR
      }
    })

    const onSubmit = async () => {
      try {
        const dataFormatada = computed({
          get: () => {
            let dataBR = data.value
            dataBR = dataBR.split(' ')
            const dataEN = `${dataBR[0].split('/').reverse().join('-')} ${dataBR[1]}`
            return dataEN
          },
          set: (val) => {
            data.value = val
          }
        })

        const valorFormatado = computed({
          get: () => {
            let valorBR = valor.value
            valorBR = valorBR.replaceAll('.', '')
            const valorEN = valorBR.replace(',', '.')
            return valorEN
          },
          set: (val) => {
            valor.value = val
          }
        })

        const bodyRequest = {
          descricao: descricao.value,
          data: dataFormatada.value,
          valor: valorFormatado.value,
          id: id.value
        }

        const retorno = ref({})

        if (id.value !== '') {
          retorno.value = await update(bodyRequest)
        } else {
          retorno.value = await post(bodyRequest)
        }

        $q.notify({
          message: retorno.value.message,
          color: 'positive',
          icon: 'check'
        })
        router.push({ path: '/despesa' })
      } catch (error) {
        $q.notify({
          message: error.message,
          color: 'negative',
          icon: 'error'
        })
      }
    }

    return {
      descricao,
      data,
      valor,
      onSubmit
    }
  }
})
</script>
