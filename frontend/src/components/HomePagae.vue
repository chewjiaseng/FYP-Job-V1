<template>
  <div>
    <h1>Home Page</h1>
    <v-btn @click="navigateAndFetchData">Go to Data Page</v-btn>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();

    const navigateAndFetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data');
        console.log(response.data);
        router.push({ name: 'DataPage', params: { data: response.data } });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    return { navigateAndFetchData };
  }
}
</script>
