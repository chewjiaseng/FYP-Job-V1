<template>
  <div class="job-search-page">
    <Navbar />
    <v-container fluid class="no-padding">
      <v-row>
        <!-- Left Yellow Container (Extended Vertically) -->
        <v-col cols="12" md="5" class="yellow-container">
          <div class="flex-container animated-container">
            <div class="image1-container">
              <v-img src="@/assets/findjob1.png" alt="Find Job 1" class="image-container"></v-img>
            </div>
            <p class="image1-text">Discover your next part-time role with tailored recommendations just for you!</p>
          </div>
          <div class="flex-container animated-container image3-flex-container">
            <p class="image3-text">Empowering job seekers to find the perfect fit with ease and precision.</p>
            <div class="image3-container">
              <v-img src="@/assets/findjob4.png" alt="Find Job 4" class="image-container"></v-img>
            </div>
          </div>
        </v-col>

        <!-- Right Content: Text and other images -->
        <v-col cols="12" md="7" class="right-content">
          <h1 class="header-text fade-in">Welcome to EasyPart!</h1> <!-- Add fade-in class -->
          <p class="intro-text fade-in">
            Here, individuals can easily find part-time job opportunities tailored to their skills and interests. Our AI features allow you to upload your resume, helping you discover the most suitable job categories and recommendations based on your qualifications. Join us in making your job search more efficient and effective!
          </p>

          <v-row>
            <v-col cols="6" class="image2-container fade-in"> <!-- Add fade-in class -->
              <v-img src="@/assets/findjob2.png" alt="Find Job 2" class="image-container"></v-img>
            </v-col>
            <v-col cols="6" class="image4-container fade-in"> <!-- Add fade-in class -->
              <v-img src="@/assets/findjob3.png" alt="Find Job 3" class="image-container"></v-img>
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
  background-color: #ffb835;
  min-height: 100vh;
  position: relative;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
  padding: 20px; /* Add some padding for better spacing */
  width: 100%;
}

.image1-container {
  width: 15vw;
  max-width: 200px;
  height: auto;
  background-color: #9cedff;
  border: 3px solid #9cedff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-right: 20px; /* Space between the image container and text */
  margin-top: 10px; /* Lower image1 */
}

.image1-text {
  max-width: calc(100% - 220px); /* Adjust based on the container's width */
  font-size: 1.2vw; /* Use vw for flexible font size */
  color: #34495e;
  text-align: center;
  white-space: normal;
  margin-top: 50px;
  font-family: 'Dancing Script',cursive; /* Change font family */
}

/* Add a flex container for the image and text */
.flex-container {
  display: flex;
  align-items: flex-start; /* Align items to the top */
  margin-bottom: auto;
}

/* Updated styles for image3-flex-container */
.image3-flex-container {
  display: flex;
  align-items: flex-start; /* Align items to the top */
  margin-top: 10px; /* Add space above the image3 container */
  justify-content: flex-start; /* Align items to the start of the container */
  width: 100%; /* Ensure it takes the full width */
}

/* Adjusted styles for image3-container */
.image3-container {
  width: 15vw;
  height: 15vw;
  max-width: 200px;
  background-color: #9cedff;
  border: 3px solid #9cedff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto; /* Pushes this container to the right */
}

/* Adjust the text for image 3 */
.image3-text {
  max-width: calc(100% - 220px); /* Adjust based on the container's width */
  font-size: 1.2vw; /* Use vw for flexible font size */
  color: #34495e;
  text-align: center;
  white-space: normal;
  margin-top: 50px;
  font-family: 'Dancing Script',cursive; /* Change font family */

}

/* Other adjustments to ensure text doesn't wrap too soon */
.intro-text {
  max-width: 100%;
  width: 80%; /* Make sure the intro-text can stretch */
  margin: auto;
}



/* Styles for image2-container */
.image2-container, .image4-container {
  margin-top: 10px;
  width: 100%;
  max-width: 350px;
  height: auto;
  padding: 0;
  display: flex;
  justify-content: center; /* Center image horizontally */
  align-items: center; /* Center image vertically */
  align-self: center; /* Ensure container aligns with the other one */
}

/* Ensure the images fit within their containers */
.image2-container .image-container,
.image4-container .image-container {
  width: 100%; /* Full width of the container */
  height: auto; /* Maintain aspect ratio */
  object-fit: contain;
}

/* Right Content Section */
.right-content {
  min-height: 100vh; /* Ensure it also covers the full height */
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: rgb(253, 248, 215);
}

.header-text {
  font-size: 4em;
  color: #2c3e50;
  font-family: 'Pacifico', cursive;
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: center;
}

.intro-text {
  font-size: 20px;
  color: #34495e;
  line-height: 1.6;
  text-align: center;
  max-width: 100%;
  margin-top: 20px;
  font-family: 'Poppins', cursive
}

/* Responsive Behavior */
@media (min-width: 1200px) {
  .right-content {
    max-width: 90%; /* Increase right container width for larger screens */
  }
}

/* Adjustments for smaller screens */
@media (max-width: 768px) {
  .yellow-container {
    order: 2;
  }

  .right-content {
    order: 1;
  }

  .header-text {
    font-size: 2em;
  }

  .intro-text {
    font-size: 16px;
    line-height: 1.4;
  }

  .image-container {
    max-width: 100px;
    max-height: 100px;
  }

  .image1-container {
    width: 25vw;
    max-width: 150px;
  }

  .image1-text {
    font-size: 3vw; /* Make the font larger on smaller screens */
    max-width: 100%; /* Full width on smaller screens */
  }
  .image3-text {
    font-size: 3vw; /* Make the font larger on smaller screens */
    max-width: 100%; /* Full width on smaller screens */
  }

  .image3-container {
    bottom: 5%;
    right: 2%;
    width: 25vw;
    max-width: 150px;
  } 
}

/* Add this to your existing <style scoped> section */

.animated-container {
  opacity: 0; /* Start invisible */
  animation: slideInFromLeft 0.3s ease forwards; /* Adjust duration and easing as needed */
  animation-delay: 0.1s; /* Optional: delay before starting the animation */
}

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0; /* Invisible */
  }
  100% {
    transform: translateX(0);
    opacity: 1; /* Fully visible */
  }
}

.fade-in {
  opacity: 0; /* Start invisible */
  animation: fadeIn 0.5s ease forwards; /* Animation details */
  animation-delay: 0.2s; /* Optional delay before starting the animation */
}

@keyframes fadeIn {
  0% {
    opacity: 0; /* Invisible */
  }
  100% {
    opacity: 1; /* Fully visible */
  }
}

</style>
