<!-- src/components/BarChart.vue -->
<template>
    <div>
      <Bar :chart-data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  export default {
    name: 'BarChart',
    components: {
      Bar,
    },
    props: {
      usersCount: {
        type: Number,
        required: true,
      },
      jobsCount: {
        type: Number,
        required: true,
      },
      applicationsCount: {
        type: Number,
        required: true,
      },
    },
    computed: {
      chartData() {
        return {
          labels: ['Users', 'Jobs', 'Applications'],
          datasets: [
            {
              label: 'Count',
              backgroundColor: '#42A5F5',
              data: [this.usersCount, this.jobsCount, this.applicationsCount],
            },
          ],
        };
      },
      chartOptions() {
        return {
          responsive: true,
          maintainAspectRatio: false,
        };
      },
    },
  };
  </script>
  
  <style scoped>
  .chart-container {
    height: 400px; /* Set a specific height for the chart */
  }
  </style>
  