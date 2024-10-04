<template>
  <div class="job-search-page">
    <Navbar />
    <v-container fluid class="no-padding">
      <v-row>
        <!-- Left Yellow Container (Extended Vertically) -->
        <v-col cols="12" md="5" class="yellow-container">
          <!-- Wrap Image 1 in a separate div for positioning -->
          <div class="image1-container">
            <v-img src="@/assets/findjob1.png" alt="Find Job 1" class="image-container"></v-img>
          </div>

          <div class="image3-container">
            <v-img src="@/assets/findjob3.png" alt="Find Job 1" class="image-container"></v-img>
          </div>
        </v-col>

        <!-- Right Content: Text and other images -->
        <v-col cols="12" md="7" class="right-content">
          <h1 class="header-text">Welcome to EasyPart!</h1>
          <p class="intro-text">
            Here, individuals can easily find part-time job opportunities tailored to their skills and interests. Our AI features allow you to upload your resume, helping you discover the most suitable job categories and recommendations based on your qualifications. Join us in making your job search more efficient and effective!
          </p>

          <v-row>
            <!-- Wrap each image in separate divs for independent positioning -->
            <v-col cols="6" class="image2-container">
              <v-img src="@/assets/findjob2.png" alt="Find Job 2" class="image-container"></v-img>
            </v-col>
            
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Navbar from './Navbar.vue';

export default {
  name: 'JobSearch',
  components: {
    Navbar,
  },
};
</script>

<style scoped>
.job-search-page {
  padding: 0; /* Remove padding from the page */
}

/* Remove default container padding */
.no-padding {
  padding: 0 !important;
}

.yellow-container {
  background-color: #f4d03f;
  min-height: 100vh;
  position: relative;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
}

.image1-container {
  position: absolute;
  top: 10%;
  left: 5%;
  width: 15vw;
  max-width: 200px;
  height: auto;
  background-color: #ffa500;
  border: 3px solid #ffa500;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.image3-container {
  position: absolute;
  bottom: 10%;
  right: 10%;
  width: 15vw;
  max-width: 200px;
  height: 15vw; /* Set height equal to width to maintain square shape */
  max-height: 200px; /* Ensure the maximum height matches the max-width */
  background-color: #ffa500;
  border: 3px solid #ffa500;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Ensure the image fits within the container */
.image-container {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* Right Content Section */
.right-content {
  min-height: 100vh; /* Ensure it also covers the full height */
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Center content */
  overflow: hidden; /* Prevent overflow */
}


/* Ensure the v-container stretches fully */
.v-container {
  height: 100%;
}

.header-text {
  font-size: 4em;
  color: #2c3e50;
  font-family: 'Pacifico', cursive;
  margin-bottom: 10px;
  text-align: center; /* Center header */
}

.intro-text {
  font-size: 20px;
  color: #34495e;
  line-height: 1.6;
  text-align: center; /* Center intro text */
  max-width: 100%; /* Prevent overflow */
}

/* Specific Styles for Image 2 and Image 3 Containers */
.image2-container {
  margin-top: 10px;
}



/* Responsive Behavior */
@media (min-width: 1200px) {
  .right-content {
    max-width: 90%; /* Increase right container width for larger screens */
  }
}

/* Order the right content first on small screens */
@media (max-width: 768px) {
  .yellow-container {
    order: 2; /* Move left container to the second position */
  }

  .right-content {
    order: 1; /* Move right content to the first position */
  }

  .header-text {
    font-size: 2em; /* Adjust font size for small screens */
  }

  .intro-text {
    font-size: 16px;
    line-height: 1.4;
  }

  .image-container {
    max-width: 100px;
    max-height: 100px; /* Adjust image sizes for small screens */
  }
  .image1-container {
    top: 5%;
    left: 2%;
    width: 25vw;
    max-width: 150px;
  }

  .image3-container {
    bottom: 5%;
    right: 2%;
    width: 25vw;
    max-width: 150px;
  }
}


</style>
