<template>
  <div class="flex flex-col lg:flex-row-reverse gap-10 h-full">
    <ProfileEditFloaterBox class="w-full lg:w-80 lg:sticky shrink-0 top-16 self-start" />

    <UForm
      :state="formState"
      :schema="schema"
      class="w-full flex flex-col gap-10"
      @submit="onSubmit"
    >
      <CommonPageSection
        title="Personal Information"
        title-icon="i-heroicons-user-solid"
        inner-class="grid grid-cols-3 gap-4"
      >
        <UFormField
          label="Full Name"
          name="full_name"
          required
          class="w-full"
        >
          <UInput
            v-model="formState.full_name"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Gender"
          name="gender"
          required
          class="w-full"
        >
          <USelect
            v-model="formState.gender"
            class="w-full"
            :items="genderOptions"
            color="info"
          />
        </UFormField>
        <UFormField
          label="Date of Birth"
          name="dob"
          class="w-full"
          required
        >
          <UPopover class="w-full h-full">
            <UButton
              :label="formatDate(formState.dob)"
              color="neutral"
              class="bg-white hover:bg-neutral-100 text-black ring ring-inset ring-accented justify-between"
              trailing-icon="i-heroicons-calendar-solid"
            />
            <template #content>
              <UCalendar
                v-model="computedDob"
                color="neutral"
              />
            </template>
          </UPopover>
        </UFormField>
        <UFormField
          label="Bio"
          name="bio"
          class="col-span-3"
        >
          <UTextarea
            v-model="formState.bio"
            class="w-full"
            autoresize
          />
        </UFormField>
      </CommonPageSection>

      <CommonPageSection
        title="Student Information"
        title-icon="i-heroicons-book-open-solid"
        inner-class="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <UFormField
          label="Field of Study"
          name="field_of_study"
          class="w-full"
        >
          <UInput
            v-model="formState.field_of_study"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="University"
          name="university"
          class="w-full"
        >
          <UInput
            v-model="formState.university"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Class"
          name="class"
          class="w-full"
        >
          <UInput
            v-model="formState.class"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Student Code"
          name="student_code"
          class="w-full"
        >
          <UInput
            v-model="formState.student_code"
            class="w-full"
          />
        </UFormField>
      </CommonPageSection>

      <CommonPageSection
        title="Residence Information"
        title-icon="i-heroicons-map-pin-solid"
        inner-class="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <UFormField
          label="Province / City"
          name="province"
          required
          class="w-full"
        >
          <USelect
            v-model="formState.province"
            :items="provinces"
            value-key="label"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="District / Ward"
          name="district"
          required
          class="w-full"
        >
          <UInput
            v-model="formState.district"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Specific Address"
          name="detail"
          required
          class="w-full col-span-2"
        >
          <UTextarea
            v-model="formState.detail"
            class="w-full"
            autoresize
          />
        </UFormField>
      </CommonPageSection>

      <CommonPageSection
        title="Contact Information"
        title-icon="i-heroicons-phone-solid"
        inner-class="flex flex-col gap-4 w-full"
      >
        <div
          v-for="(info, idx) in formState?.contact_info"
          :key="idx"
          class="flex gap-4 w-full"
        >
          <USelect
            v-model="info.type!"
            :items="contactTypeOptions"
            class="w-30"
          />
          <UInput
            v-model="info.value!"
            class="w-full"
          />
          <UButton
            color="error"
            leading-icon="i-heroicons-x-mark"
            class="cursor-pointer"
            @click="removeContactInfo(idx)"
          />
        </div>
        <div
          class="flex w-full justify-center items-center border-2 border-dashed text-dimmed col-span-full cursor-pointer py-2 bg-gray-100 rounded-lg"
          @click="addContactInfo"
        >
          <UIcon name="i-heroicons-plus" />
          <p class="pointer-events-none ml-2">
            Add Contact Info
          </p>
        </div>
      </CommonPageSection>

      <div class="flex justify-end gap-4">
        <UButton
          color="neutral"
          :to="`/dashboard/${curUser!.id}`"
          size="lg"
          label="Cancel"
        />
        <UButton
          type="submit"
          color="info"
          class="cursor-pointer"
          icon="i-heroicons-check"
          size="lg"
          label="Save"
          :loading="isLoading"
          :ui="{ label: ['mx-auto text-lg', isLoading && 'hidden'], leadingIcon: 'mx-auto' }"
        />
      </div>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import type { CalendarDate } from '@internationalized/date'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { useProfileDetail } from '~/composables/profile/useProfileDetail'
import type { Enums, Tables } from '~/types/database.types'
import { useProfileUpdate } from '~/composables/profile/useProfileUpdate'

const route = useRoute()
const id = route.params.id as string

const { provinces } = await useLocation()
const { data: profile } = await useProfileDetail(id)
const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

const { isLoading, updateProfile } = await useProfileUpdate()

const genderOptions = [
  {
    label: 'Male',
    value: 'MALE',
  },
  {
    label: 'Female',
    value: 'FEMALE',
  },
  {
    label: 'Other',
    value: 'OTHER',
  },
]

const currentDay = today(getLocalTimeZone())

const computedDob = computed({
  get: (): CalendarDate => {
    if (!formState.dob) return currentDay
    return parseDate(formState.dob)
  },
  set: (newDate: CalendarDate | undefined) => {
    if (!newDate) {
      formState.dob = ''
      return
    }
    formState.dob = newDate.toString()
  },
})

const formState = reactive({
  full_name: profile.value?.full_name ?? '',
  dob: profile.value?.dob ?? currentDay.toString(),
  gender: profile.value?.gender ?? 'MALE',
  bio: curUser.value?.bio ?? '',

  student_code: profile.value?.student_code ?? '',
  field_of_study: profile.value?.field_of_study ?? '',
  university: profile.value?.university ?? '',
  class: profile.value?.class ?? '',

  province: profile.value?.residence?.province ?? '',
  district: profile.value?.residence?.district ?? '',
  detail: profile.value?.residence?.detail ?? '',

  contact_info: curUser.value?.contact_info ?? [],
})

const schema
  = z.object({
    full_name: z.string().min(1, 'This field is required!'),
    bio: z.string().max(50, 'Max 50 characters!').optional(),
    dob: z.string().min(1, 'This field is required!')
      .refine((dateString) => {
        try {
          const selectedDate = parseDate(dateString)
          if (selectedDate.compare(currentDay) <= 0) {
            return true
          }
          else {
            return false
          }
        }
        catch {
          return false
        }
      }, {
        message: 'Invalid Date of Birth!',
      }),
    gender: z.string().min(1, 'This field is required!'),
    province: z.string().min(1, 'This field is required!'),
    district: z.string().min(1, 'This field is required!'),
    detail: z.string().min(1, 'This field is required!'),
  })

const contactTypeOptions: { label: string, value: Enums<'profile_contact_enum'> }[] = [
  {
    label: 'Phone',
    value: 'PHONE' as Enums<'profile_contact_enum'>,
  },
  {
    label: 'Email',
    value: 'EMAIL' as Enums<'profile_contact_enum'>,
  },
]
const addContactInfo = () => {
  formState.contact_info.push({
    type: 'EMAIL' as Enums<'profile_contact_enum'>,
    value: '',
  })
}
const removeContactInfo = (idx: number) => {
  formState.contact_info.splice(idx, 1)
}

const onSubmit = async () => {
  updateProfile(formState)
}
</script>
