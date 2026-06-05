import type { CompositeTypes, Tables } from '~/types/database.types'

type FormPayload = {
  gpa?: CompositeTypes<'academic_info'>['gpa']
  accumulated_credits?: CompositeTypes<'academic_info'>['accumulated_credits']
  extracurricular_info?: CompositeTypes<'extracurricular_info'>[]
  father_occupation: string
  mother_occupation: string
  family_average_income: CompositeTypes<'background_info'>['family_average_income']
}

export const useScholarshipApply = async (sid: string) => {
  const supabase = useSupabaseClient()
  const toast = useToast()
  const isLoading = ref<boolean>(false)
  const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

  const checkUnique = async () => {
    isLoading.value = true
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('student_id', curUser.value!.id)
      .eq('scholarship_id', sid)
      .limit(1)

    if (error) {
      toast.add({
        title: 'Error fetching data',
        description: error.message ?? 'Please try again later!',
        color: 'error',
      })
      isLoading.value = false
      return false
    }
    isLoading.value = false
    if (data.length) return false
    return true
  }

  const applicationKey = computed(() => {
    return `application-${sid}-${curUser.value!.id}`
  })
  const { data: canApply } = await useAsyncData(applicationKey, checkUnique)

  const scholarshipApply = async (payload: FormPayload) => {
    isLoading.value = true

    const updatePayload = {
      academic_info: {
        gpa: payload.gpa,
        accumulated_credits: payload.accumulated_credits,
      },
      extracurricular_info: payload.extracurricular_info?.filter(row => row && row.club_name!.trim() !== '') || [],
      background_info: {
        father_occupation: payload.father_occupation,
        mother_occupation: payload.mother_occupation,
        family_average_income: payload.family_average_income,
      },
    }

    const { error } = await supabase
      .from('applications')
      .insert({
        academic_info: updatePayload.academic_info,
        extracurricular_info: updatePayload.extracurricular_info,
        background_info: updatePayload.background_info,
        scholarship_id: sid,
        student_id: curUser.value!.id,
        status: 'APPLIED',
      })

    if (error) {
      toast.add({
        title: 'Error uploading data',
        description: error.message ?? 'Please try again later!',
        color: 'error',
      })
      isLoading.value = false
      return
    }

    refreshNuxtData(applicationKey.value)

    toast.add({
      title: 'Applied successfully',
      color: 'success',
    })
  }

  return {
    isLoading,
    canApply,
    scholarshipApply,
  }
}
