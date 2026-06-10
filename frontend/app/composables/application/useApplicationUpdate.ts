import type { Enums } from '~/types/database.types'

export const useApplicationUpdate = async () => {
  const toast = useToast()
  const supabase = useSupabaseClient()

  const isUpdating = ref<boolean>(false)

  const updateApplication = async (id: string, status: Enums<'application_status'>) => {
    isUpdating.value = true
    const { error: updateError } = await supabase
      .from('applications')
      .update({ status: status })
      .eq('id', id)

    isUpdating.value = false
    if (updateError) {
      toast.add({
        title: 'Error Updating Scholarship!',
        description: updateError?.message,
        color: 'error',
      })
      return false
    }

    toast.add({
      title: 'Application Status Updated!',
      color: 'success',
    })
    return true
  }

  return { updateApplication, isUpdating }
}
