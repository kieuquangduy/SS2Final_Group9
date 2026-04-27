import type { CompositeTypes, Enums, Tables } from '~/types/database.types'

type FormPayload = {
  username?: string
  avatar_url?: string
  contact_info?: CompositeTypes<'profile_contact_type'>[]
  bio?: string
  full_name?: string
  gender?: Enums<'student_gender'>
  dob?: string
  province: string
  district: string
  detail: string
  student_code?: string
  field_of_study?: string
  university?: string
  class?: string
}

export const useProfileUpdate = async () => {
  const toast = useToast()
  const supabase = useSupabaseClient()
  const isLoading = ref<boolean>(false)

  const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

  const updateProfile = async (payload: FormPayload) => {
    isLoading.value = true

    const ProfileUpdatePayload = {
      username: payload.username,
      avatar_url: payload.avatar_url,
      contact_info: payload.contact_info?.filter(row => row.value && row.value.trim() !== '') || [],
      bio: payload.bio,
    }
    const StudentUpdatePayload = {
      full_name: payload.full_name,
      gender: payload.gender,
      dob: payload.dob,
      residence: { province: payload.province, district: payload.district, detail: payload.detail },
      student_code: payload.student_code,
      field_of_study: payload.field_of_study,
      university: payload.university,
      class: payload.class,
    }

    try {
      const [profileRes, studentRes] = await Promise.all([
        supabase.from('profiles').update(ProfileUpdatePayload).eq('id', curUser.value!.id),
        supabase.from('students').update(StudentUpdatePayload).eq('id', curUser.value!.id),
      ])

      if (profileRes.error) throw profileRes.error.message
      if (studentRes.error) throw studentRes.error.message

      const { error } = await supabase
        .from('profiles')
        .update({ is_complete: true })
        .eq('id', curUser.value!.id)

      if (error) throw error.message

      toast.add({
        title: 'Profile Updated',
        color: 'success',
      })

      return navigateTo(`/dashboard/${curUser.value!.id}`)
    }
    catch (error: unknown) {
      toast.add({
        title: 'Update Profile Failed',
        description: error as string,
        color: 'error',
      })
    }
    finally {
      isLoading.value = false
    }
  }

  return { isLoading, updateProfile }
}
