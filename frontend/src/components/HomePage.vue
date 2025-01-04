<template>
  <v-container class="homepage" fluid fill-height @mousemove="handleMouseMove">
    <Navbar />
    
    <!-- Main background content -->
    <v-responsive class="background" :class="{ fadeOut: isFadingOut && isImageOneVisible }"></v-responsive>

    <!-- New background content -->
    <v-responsive class="background-new" :class="{ fadeIn: isFadingIn && !isImageOneVisible }"></v-responsive>

    <!-- Circle button on the right middle to switch images -->
    <div class="circle-button right-button" :class="{ show: showRightButton }" @click="switchImage('next')">
      &#x27A4;
    </div>

    <!-- Circle button on the left middle to switch images -->
    <div class="circle-button left-button" :class="{ show: showLeftButton }" @click="switchImage('prev')">
      <span class="arrow-icon">&#x27A4;</span>
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
      isImageOneVisible: true,
      showRightButton: false,
      showLeftButton: false,
      buttonDistance: 100,
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

      this.showRightButton = (
        clientX >= rightButtonRect.left - this.buttonDistance &&
        clientX <= rightButtonRect.right + this.buttonDistance &&
        clientY >= rightButtonRect.top - this.buttonDistance &&
        clientY <= rightButtonRect.bottom + this.buttonDistance
      );

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
          this.isFadingOut = false;
          setTimeout(() => {
            this.isFadingOut = false;
            this.isFadingIn = true;
            this.isImageOneVisible = false;
          }, 500);
        } else {
          this.isFadingIn = true;
          setTimeout(() => {
            this.isFadingIn = false;
            this.isFadingOut = false;
            this.isImageOneVisible = true;
          }, 500);
        }
      } else if (direction === 'prev') {
        if (this.isImageOneVisible) {
          this.isFadingIn = true;
          this.isFadingOut = false;
          setTimeout(() => {
            this.isImageOneVisible = false;
            this.isFadingIn = true;
          }, 500);
        } else {
          this.isFadingOut = false;
          this.isFadingIn = true;
          setTimeout(() => {
            this.isImageOneVisible = true;
            this.isFadingIn = false;
          }, 500);
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
  height: 92vh;
  width: 100%;
  position: relative;
}

/* Responsive background to cover screen and fit vertically */
.background, .background-new {
  background-size: cover; /* Ensures the background covers the screen */
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.5s ease-in-out;
}

.background {
  background-image: url('@/assets/mainpage.jpg');
  opacity: 1;
}

.background-new {
  background-image: url('@/assets/mainpage2.jpg');
  opacity: 0;
}

.fadeOut {
  opacity: 0;
}

.fadeIn {
  opacity: 1;
}

/* Buttons for image switching */
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
  opacity: 0;
}

.circle-button.show {
  opacity: 1;
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
  box-sizing: border-box;
}

/* Arrow rotation for the left button */
.arrow-icon {
  display: inline-block;
  transform: rotate(180deg); /* Flip the arrow */
}

/* Media Queries for smaller devices */
@media (max-width: 600px) {
  .bottom-text-container {
    font-size: 1em;
    padding: 8px;
  }

  .circle-button {
    width: 40px;
    height: 40px;
  }

  .right-button, .left-button {
    top: 60%;
  }

  /* Ensure the background fits vertically on mobile screens */
  .background, .background-new {
    background-size: contain; /* Ensures the whole image fits within the viewport */
    background-position: center top; /* Align the image to the top center */
  }
}

</style>
