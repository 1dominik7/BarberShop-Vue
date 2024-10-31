<template>
  <div class="flex flex-col gap-6">
    <div
      v-if="isLoading"
      class="flex justify-center items-center w-full h-full absolute top-0 left-0 z-50 bg-black opacity-60"
    >
      <LoadingAnimation />
    </div>
    <AdminDashboardNav />
    <div class="flex flex-col gap-6 bg-bgSecond rounded-xl min-h-[50vh] p-4">
      <div class="h-[300px] flex justify-around items-center max-lg:h-[240px] max-md:flex-col max-md:h-full">
        <Pie v-if="!isLoadingStats" :data="pieChartData" :options="pieChartOptions" />
        <Pie
          v-if="!isLoadingStatus"
          :data="pieChartDataAppointment"
          :options="pieChartAppointmentsOptions"
        />
      </div>

      <div class="flex flex-col gap-2 h-[300px]">
        <Line v-if="!isLoadingStats" :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BarberData {
  barber: string
  servicesPerMonth: number[]
}

interface PieChartData {
  labels: string[]
  datasets: {
    label: string
    backgroundColor: string[]
    data: number[]
  }[]
}

interface AppointmentByStatus {
  Pending: number
  Confirmed: number
  Cancelled: number
  Completed: number
}

import { library } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { onMounted, ref, watch } from 'vue'
import LoadingAnimation from './LoadingAnimation.vue'
import client from '../../api/client'
import AdminDashboardNav from './AdminDashboardNav.vue'
import { Pie, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend
} from 'chart.js'
import type { TooltipItem, ChartOptions } from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)
library.add(faXmark)

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const isLoading = ref<boolean>(false)
const isLoadingStats = ref<boolean>(false)
const isLoadingStatus = ref<boolean>(false)
const barbers = ref<BarberData[]>([])
const appointmentByStatus = ref<AppointmentByStatus>({
  Pending: 0,
  Confirmed: 0,
  Cancelled: 0,
  Completed: 0
})

const chartData = ref({
  labels: [] as string[],
  datasets: [] as { label: string; backgroundColor: string; data: number[] }[]
})

const getTitleFontSize = () => {
  if (window.innerWidth < 640) {
    return 13
  } else if (window.innerWidth < 768) {
    return 14
  } else if (window.innerWidth < 1024) {
    return 16
  } else {
    return 20
  }
}

const chartOptions = ref<ChartOptions<'line'>>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Last 3 Months Services by Barber',
      font: {
        size: getTitleFontSize(),
        weight: 'bold'
      }
    },
    legend: {
      display: true,
      position: 'bottom' as const
    },
    tooltip: {
      callbacks: {
        label: function (context: TooltipItem<'line'>) {
          return `${context.dataset.label}: ${context.raw}`
        }
      }
    }
  }
})

const pieChartData = ref<PieChartData>({
  labels: [],
  datasets: [
    {
      label: 'Services This Month',
      backgroundColor: [],
      data: []
    }
  ]
})

const pieChartOptions = ref<ChartOptions<'pie'>>({
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Monthly Services by Barber',
      font: {
        size: getTitleFontSize(),
        weight: 'bold'
      }
    },
    legend: {
      display: true,
      position: 'top' as const
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const total = context.dataset.data.reduce((sum, value) => sum + value, 0)
          const currentValue = context.raw
          const label = context.label
          return `${label}: ${currentValue} (Total: ${total})`
        }
      }
    }
  }
})

const pieChartDataAppointment = ref<PieChartData>({
  labels: [],
  datasets: [
    {
      label: 'Appointments by Status',
      backgroundColor: [],
      data: []
    }
  ]
})

const pieChartAppointmentsOptions = ref<ChartOptions<'pie'>>({
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Monthly Services by Status',
      font: {
        size: getTitleFontSize(),
        weight: 'bold'
      }
    },
    legend: {
      display: true,
      position: 'top' as const
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const total = context.dataset.data.reduce((sum, value) => sum + value, 0)
          const currentValue = context.raw
          const label = context.label
          return `${label}: ${currentValue} (Total: ${total})`
        }
      }
    }
  }
})

const barberColorMap = new Map<string, string>()

const getBarberColor = (barberName: string): string => {
  if (!barberColorMap.has(barberName)) {
    const newColor = getRandomColor()
    barberColorMap.set(barberName, newColor)
  }
  return barberColorMap.get(barberName)!
}

const updatePieChartData = (barbersData: BarberData[]) => {
  const currentMonth = new Date().getMonth()

  pieChartData.value.labels = barbersData.map((barberData) => barberData.barber)

  pieChartData.value.datasets[0].data = barbersData.map((barberData) => {
    return barberData.servicesPerMonth[currentMonth] || 0
  })

  pieChartData.value.datasets[0].backgroundColor = barbersData.map((barberData) => {
    return getBarberColor(barberData.barber)
  })
}

const updatePieChartDataAppointment = (appointmentByStatus: AppointmentByStatus) => {
  const labels = Object.keys(appointmentByStatus)
  const data = Object.values(appointmentByStatus)

  pieChartDataAppointment.value.labels = labels
  pieChartDataAppointment.value.datasets[0].data = data

  pieChartDataAppointment.value.datasets[0].backgroundColor = labels.map((label) => {
    switch (label) {
      case 'Pending':
        return '#f39c12'
      case 'Confirmed':
        return '#27ae60'
      case 'Cancelled':
        return '#e74c3c'
      case 'Completed':
        return '#3498db'
      default:
        return '#95a5a6'
    }
  })
}

const updateChartData = (barbersData: BarberData[]) => {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()
  const last3Months = getLast3Months(currentMonth, currentYear)

  chartData.value.labels = last3Months.map((item) => `${months[item.month - 1]} ${item.year}`)
  chartData.value.datasets = barbersData.map((barberData) => {
    const servicesLast3Months = last3Months.map((item) => {
      const monthIndex = item.month - 1
      return barberData.servicesPerMonth[monthIndex] || 0
    })

    const color = getBarberColor(barberData.barber)

    return {
      label: barberData.barber,
      backgroundColor: color,
      data: servicesLast3Months,
      borderColor: color,
      fill: false,
      pointBackgroundColor: color,
      pointBorderColor: color
    }
  })
}

const getBarbersStats = async (): Promise<void> => {
  isLoadingStats.value = true
  try {
    const res = await client.get('barber/barberStats/all')
    barbers.value = res.data
    updateChartData(barbers.value)
    updatePieChartData(barbers.value)
  } catch (error) {
    console.error('Unexpected error during getting getBarbersStats:', error)
  } finally {
    isLoadingStats.value = false
  }
}

const getCurrMonthAppByStatus = async (): Promise<void> => {
  isLoadingStatus.value = true
  try {
    const res = await client.get(`appointment/currentMonthByStatus`)
    appointmentByStatus.value = res.data
    updatePieChartDataAppointment(appointmentByStatus.value)
    console.log('Appointments by Status:', appointmentByStatus.value)
  } catch (error) {
    console.error('Unexpected error during getting barbers:', error)
  } finally {
    isLoadingStatus.value = false
  }
}

const getLast3Months = (currentMonth: number, currentYear: number) => {
  const last3Months = []
  for (let i = 2; i >= 0; i--) {
    let month = currentMonth - i
    let year = currentYear

    if (month <= 0) {
      month += 12
      year -= 1
    }

    last3Months.push({ month, year })
  }
  return last3Months
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

onMounted(() => {
  getBarbersStats()
  getCurrMonthAppByStatus()
})

</script>

<style>
.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>
