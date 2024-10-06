<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script>
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { defineComponent, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

export default defineComponent({
  name: 'BarChart',
  props: { chartData: Object },
  setup(props) {
    const chartRef = ref(null);
    let chartInstance = null;

    Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const renderBarChart = () => {
      nextTick(() => {
        if (!chartRef.value) return;

        const ctx = chartRef.value.getContext('2d');
        if (!ctx) return;

        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(ctx, {
          type: 'bar',
          data: props.chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: {
              legend: { display: true, position: 'top' },
              title: { display: true, text: 'Admin Data Overview' },
            },
          },
        });
      });
    };

    watch(
      () => props.chartData,
      (newData) => {
        if (newData?.datasets[0]?.data.some(d => d > 0)) renderBarChart();
      },
      { immediate: true }
    );

    onMounted(renderBarChart);

    onBeforeUnmount(() => {
      if (chartInstance) chartInstance.destroy();
    });

    return { chartRef };
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 500px;
}
canvas {
  width: 100%;
  height: 100%;
}
</style>
