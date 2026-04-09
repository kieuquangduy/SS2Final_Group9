<template>
    <div class="flex flex-col gap-10">
        <ProfileBanner :name="profile?.full_name" :student-id="profile?.student_id" :uid="profile?.uid" />
        <ProfileOverview :sections="OVERVIEWSECTIONS" />
        <div class="flex flex-col lg:grid grid-cols-3 gap-10 lg:gap-4">
            <div class="flex flex-col gap-10 col-span-2">
                <CommonPageSection title="Thông tin Sinh viên" title-icon="i-heroicons-user-solid">
                    <div class="flex flex-wrap gap-y-2">
                        <div v-for="info in OVERVIEWINFO" :key="info.label" class="w-1/2 grid grid-cols-1 md:grid-cols-[30%_auto]">
                            <h3 class="font-bold text-info">{{ info.label }}:</h3>
                            <p class="">{{ info.desc }}</p>
                        </div>
                    </div>
                </CommonPageSection>
                <CommonPageSection inner-class="flex-wrap gap-6">
                    <h2 class="text-2xl font-bold w-full text-center">Truy Cập Nhanh</h2>
                    <div class="grid grid-cols-2 lg:grid-cols-3 w-full gap-6">
                        <UButton 
                        v-for="action in QUICKACCESS" :key="action.label" variant="ghost" color="info"
                        class="w-full cursor-pointer">
                            <template #default>
                                <div class="mx-auto">
                                    <UIcon :name="action.icon" class="size-6"/>
                                    <h3 class="font-bold text-lg">{{ action.label }}</h3>
                                    <p class="text-dimmed">{{ action.desc }}</p>
                                </div>
                            </template>
                        </UButton>
                    </div>
                </CommonPageSection>
            </div>
            <div class="flex flex-col gap-10">
                <CommonPageSection inner-class="bg-info-300 rounded-lg p-10 flex-col text-white gap-2">
                    <h3 class="text-2xl font-bold">Tổng Điểm Xếp Hạng</h3>
                    <h2 class="text-5xl font-bold">465 / 500</h2>
                    <p class="text-lg">Số điểm xuất sắc! Hãy tiếp tục duy trì tiến độ!</p>
                </CommonPageSection>
                <CommonPageSection title="Tiến Độ Học Tập" container-class="h-full" inner-class="h-full" title-icon="i-heroicons-bolt-solid">
                    <div class="flex flex-col w-full h-full gap-4">
                        <div v-for="progress in PROGRESSES" :key="progress.label" class="h-full">
                            <div class="flex justify-between font-bold w-full">
                                <p>{{ progress.label }}</p>
                                <p>{{ progress.score }}<span class="font-normal text-dimmed"> / 100</span></p>
                            </div>
                            <UProgress v-model="progress.score" color="info" />
                        </div>
                    </div>
                </CommonPageSection>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useFetchProfileDetail } from '~/composables/profile/useFetchProfileDetail'


const route = useRoute()
const { id } = route.params

const { data: profile } = await useFetchProfileDetail(id?.toString())

const OVERVIEWSECTIONS = [
    {
        label: 'GPA',
        desc: '3.8',
        icon: 'i-heroicons-academic-cap-solid'
    },
    {
        label: 'TRẠNG THÁI RÈN LUYỆN',
        desc: 'TỐT',
        icon: 'i-heroicons-check-circle-solid'
    },
    {
        label: 'SỐ TÍN CHỈ HOÀN THÀNH',
        desc: '36',
        icon: 'i-heroicons-clock-solid'
    },
    {
        label: 'HỒ SƠ BỊ LOẠI/THIẾU',
        desc: '12',
        icon: 'i-heroicons-exclamation-circle-solid'
    },
]

const OVERVIEWINFO = [
    {
        label: 'Mã Sinh viên',
        desc: profile.value?.student_id,
    },
    {
        label: 'Số Điện thoại',
        desc: profile.value?.phone_number,
    },
    {
        label: 'Họ và tên',
        desc: profile.value?.full_name,
    },
    {
        label: 'Dân tộc',
        desc: profile.value?.ethnicity,
    },
    {
        label: 'Ngày sinh',
        desc: profile.value?.dob,
    },
    {
        label: 'Email',
        desc: 'NguyenVanA@Mail.com',
    },
    {
        label: 'Giới tính',
        desc: profile.value?.gender,
    },
    {
        label: 'Lớp',
        desc: profile.value?.class,
    },
    {
        label: 'Khoa',
        desc: profile.value?.major,
    },
    {
        label: 'Địa chỉ',
        desc: profile.value?.residence,
    },
    {
        label: 'Chức vụ',
        desc: 'Sinh Viên',
    },
]

const QUICKACCESS = [
    {
        label: 'Lịch Hoạt động',
        desc: 'Lịch các sự kiện sắp diễn ra',
        icon: 'i-heroicons-calendar-solid',
    },
    {
        label: 'Xem Điểm Bộ Môn ',
        desc: 'Theo dõi 5 tiêu chí đánh giá',
        icon: 'i-heroicons-chart-bar-solid',
    },
    {
        label: 'Đăng ký Hoạt động',
        desc: 'Đăng ký hoạt động theo cá nhân',
        icon: 'i-heroicons-trophy-solid',
    },
    {
        label: 'Nộp minh chứng',
        desc: 'Tải lên tài liệu minh chứng',
        icon: 'i-heroicons-document-solid',
    },
    {
        label: 'Nhắn tin',
        desc: 'Liên hệ trực tiếp',
        icon: 'i-heroicons-chat-bubble-left-solid',
    },
    {
        label: 'Hỗ trợ',
        desc: 'Yêu cầu tư vấn và giải pháp',
        icon: 'i-heroicons-lifebuoy-solid',
    },
]

const PROGRESSES = [
    {
        label: 'Chuyên Ngành',
        score: 22
    },
    {
        label: 'Đại Cương',
        score: 36
    },
    {
        label: 'Thể Chất',
        score: 47
    }
]
</script>