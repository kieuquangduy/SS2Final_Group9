import type { CompositeTypes, Tables } from '~/types/database.types'

type FormPayload = {
  gpa?: CompositeTypes<'academic_info'>['gpa']
  accumulated_credits?: CompositeTypes<'academic_info'>['accumulated_credits']
  extracurricular_info?: CompositeTypes<'extracurricular_info'>[]
  father_occupation: string
  mother_occupation: string
  family_average_income: CompositeTypes<'background_info'>['family_average_income']
}

export const useApplicationProfile = async () => {
  const toast = useToast()
  const supabase = useSupabaseClient()
  const isLoading = ref<boolean>(false)

  const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

  const updateProfile = async (payload: FormPayload) => {
    isLoading.value = true

    const updatePayload = {
      academic_info: {
        gpa: payload.gpa,
        accumulated_credits: payload.accumulated_credits,
      },
      extracurricular_info: payload.extracurricular_info,
      background_info: {
        father_occupation: payload.father_occupation,
        mother_occupation: payload.mother_occupation,
        family_average_income: payload.family_average_income,
      },
    }
    const { error } = await supabase
      .from('students').update(updatePayload).eq('id', curUser.value!.id)

    if (error) {
      toast.add({
        title: 'Update Profile Failed',
        description: error.message,
        color: 'error',
      })
      isLoading.value = false
      return { data: ref(null) }
    }

    await refreshNuxtData(`profile-detail-${curUser.value!.id}`)
    isLoading.value = false

    toast.add({
      title: 'Profile Updated',
      color: 'success',
    })
    return navigateTo(`/dashboard/${curUser.value!.id}`)
  }

  return { isLoading, updateProfile }
}
