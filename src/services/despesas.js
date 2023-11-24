import useApi from 'src/composables/UseApi'

export default function despesaService () {
  const { list, post, update, remove } = useApi('/despesa')

  return {
    list,
    post,
    update,
    remove
  }
}
