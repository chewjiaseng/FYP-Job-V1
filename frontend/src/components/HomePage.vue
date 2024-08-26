<template>
  <v-container class="homepage" fluid fill-height @mousemove="handleMouseMove">
    <Navbar />
    <!-- Main background content -->
    <div class="background" :class="{ fadeOut: isFadingOut && isImageOneVisible }"></div>

    <!-- New background content -->
    <div class="background-new" :class="{ fadeIn: isFadingIn && !isImageOneVisible }"></div>

    <!-- Circle button on the right middle to switch images -->
    <div class="circle-button right-button" :class="{ show: showRightButton }" @click="switchImage('next')">
      &#x27A4; <!-- Arrow symbol -->
    </div>

    <!-- Circle button on the left middle to switch images -->
    <div class="circle-button left-button" :class="{ show: showLeftButton }" @click="switchImage('prev')">
      <span class="arrow-icon">&#x27A4;</span> <!-- Left arrow symbol -->
    </div>

    <!-- Black container at the bottom -->
    <div class="bottom-text-container">
      Easy part is a part-time job application platform open for any level of users
    </div>
  </v-container>
</template>

<script>
import Navbar from './Navbar.vue';
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      isFadingOut: false,
      isFadingIn: false,
      isImageOneVisible: true, // Tracks which image is currently shown
      showRightButton: false,
      showLeftButton: false,
      buttonDistance: 100, // Distance within which the button will appear
    };
  },
  methods: {
    handleMouseMove(event) {
      const { clientX, clientY } = event;
      const container = event.currentTarget;

      const rightButton = container.querySelector('.right-button');
      const leftButton = container.querySelector('.left-button');

      const rightButtonRect = rightButton.getBoundingClientRect();
      const leftButtonRect = leftButton.getBoundingClientRect();

      // Check if mouse is within proximity of right button
      this.showRightButton = (
        clientX >= rightButtonRect.left - this.buttonDistance &&
        clientX <= rightButtonRect.right + this.buttonDistance &&
        clientY >= rightButtonRect.top - this.buttonDistance &&
        clientY <= rightButtonRect.bottom + this.buttonDistance
      );

      // Check if mouse is within proximity of left button
      this.showLeftButton = (
        clientX >= leftButtonRect.left - this.buttonDistance &&
        clientX <= leftButtonRect.right + this.buttonDistance &&
        clientY >= leftButtonRect.top - this.buttonDistance &&
        clientY <= leftButtonRect.bottom + this.buttonDistance
      );
    },
    switchImage(direction) {
      if (direction === 'next') {
        if (this.isImageOneVisible) {
          // Switch to the new image
          this.isFadingOut = false;
          setTimeout(() => {
            this.isFadingOut = false;
            this.isFadingIn = true;
            this.isImageOneVisible = false; // Switch to the new image
          }, 500); // Adjust this timeout to match the transition duration
        } else {
          // Switch back to the original image (cycle)
          this.isFadingIn = true;
          setTimeout(() => {
            this.isFadingIn = false;
            this.isFadingOut = false;
            this.isImageOneVisible = true; // Cycle back to the original image
          }, 500); // Adjust this timeout to match the transition duration
        }
      } else if (direction === 'prev') {
      if (this.isImageOneVisible) {
        // Cycle to the second image (mainpage2.jpg)
        this.isFadingIn = true;
        this.isFadingOut = false;
        setTimeout(() => {
          this.isImageOneVisible = false;
          this.isFadingIn = true;
        }, 500); // Adjust this timeout to match the transition duration
      } else {
        // Cycle back to the original image (mainpage.jpg)
        this.isFadingOut = false;
        this.isFadingIn = true;
        setTimeout(() => {
          this.isImageOneVisible = true;
          this.isFadingIn = false;
        }, 500); // Adjust this timeout to match the transition duration
        }
      }
    },
  },
};
</script>



<style scoped>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.homepage {
  height: 92vh; /* Adjusts height to show the black container below */
  width: 100%; /* Ensures the container takes up full viewport width */
  position: relative;
  margin: 0; /* Ensures no margin around the container */
  padding: 0; /* Ensures no padding around the container */
}

.background {
  background-image: url('@/assets/mainpage.jpg');
  background-size: cover; /* Ensures the image covers the container */
  background-position: center; /* Centers the image */
  background-repeat: no-repeat; /* Prevents the image from repeating */
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0; /* Ensures the background fits the top of the container */
  left: 0; /* Ensures the background fits the left of the container */
  transition: opacity 0.5s ease-in-out; /* Smooth transition for opacity */
  opacity: 1; /* Start with full opacity */
}

.fadeOut {
  opacity: 0; /* Fade out effect */
}

.background-new {
  background-image: url('@/assets/mainpage2.jpg');
  background-size: cover; /* Ensures the image covers the container */
  background-position: center; /* Centers the image */
  background-repeat: no-repeat; /* Prevents the image from repeating */
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0; /* Ensures the background fits the top of the container */
  left: 0; /* Ensures the background fits the left of the container */
  transition: opacity 0.5s ease-in-out; /* Smooth transition for opacity */
  opacity: 0; /* Start hidden */
}

.fadeIn {
  opacity: 1; /* Fade in effect */
}

.arrow-icon {
  display: inline-block;
  transform: rotate(180deg); /* Flip the arrow */
}


.circle-button {
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  opacity: 0; /* Initially hidden */
}

.circle-button.show {
  opacity: 1; /* Visible when the 'show' class is added */
}

.circle-button:hover {
  background-color: #555; /* Darken button on hover */
}

.right-button {
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.left-button {
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}


.bottom-text-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: black;
  color: white;
  padding: 10px;
  text-align: center;
  font-size: 1.2em;
  margin: 0; /* Remove any potential margin */
  box-sizing: border-box; /* Ensures padding does not affect width */
}
</style>
