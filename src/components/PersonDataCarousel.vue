<template>
  <div class="box box-iconography-collecta" v-if="!ItemsEmpty">
    <h3 style="font-size: 35px; text-align: left">Iconographie sur
      <span class="logo-collecta">COLLECTA</span></h3>
    <Carousel :itemsToShow="ItemsShowed" :wrapAround="true"
              :transition="500">
      <Slide v-for="link in collectaItems" :key="link">
        <a :href="link['url']" alt="{{link['type']}}" target="_blank">
          <img class="carousel__item" :src="formatCollectaUrl(link['url'], '.jpg')"
               @error="$event.target.style.display='none'">
          <img class="carousel__item" :src="formatCollectaUrl(link['url'], '.jpeg')"
               @error="$event.target.style.display='none'">
        </a>
      </Slide>
      <template #addons>
        <Navigation v-if="ItemsGreaterThanOne"/>
        <Pagination v-if="ItemsGreaterThanOne"/>
      </template>
    </Carousel>
  </div>
</template>

<script>
import {Carousel, Slide, Pagination, Navigation} from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

export default {
  name: "PersonDataCarousel",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  props: {
    collectaItems: {
      required: true,
      default: () => []
    }
  },
  computed: {
    totalItems() {
      return this.collectaItems.length;
    },
    ItemsEmpty() {
      return this.totalItems === 0;
    },
    ItemsShowed() {
      return this.totalItems < 3 ? this.totalItems : 3;
    },
    ItemsGreaterThanOne() {
      return this.totalItems > 1;
    }
  },
  methods: {
    /**
     * Format Collecta URL to get the image
     * @param originalUrl
     * @param extension
     * @returns {string}
     */
    formatCollectaUrl(originalUrl, extension) {
      const lastSegment = originalUrl.split('/').pop();
      return `https://www.collecta.fr/_files/uploads/thumbs/900/${lastSegment}-1${extension}`;
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Charm&display=swap');

.box-iconography-collecta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 3px solid #BB062D;
  margin-right: 5rem;
  width: 80%;
  padding: 1rem;
  /* shadow */
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
}


.logo-collecta {
  adding: 0.5em;
  color: #d40000;
  font-size: 1em;
  font-weight: 500;
  text-transform: uppercase;
  flex-grow: 2;
  position: relative;
  font-family: monospace !important;
}


.carousel__item {
  margin-top: 5rem;
  min-height: 300px;
  width: 500px;
  /*font-size: 20px;*/
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}


.carousel__slide {
  padding: 5px;
}

.carousel__viewport {
  perspective: 2000px;
}

.carousel__track {
  transform-style: preserve-3d;
}

.carousel__slide--sliding {
  transition: 0.5s;
}

.carousel__slide {
  opacity: 0.9;
  transform: rotateY(-20deg) scale(0.9);
}

.carousel__slide--active ~ .carousel__slide {
  transform: rotateY(20deg) scale(0.9);
}

.carousel__slide--prev {
  opacity: 1;
  transform: rotateY(-10deg) scale(0.95);
}

.carousel__slide--next {
  opacity: 1;
  transform: rotateY(10deg) scale(0.95);
}

.carousel__slide--active {
  opacity: 1;
  transform: rotateY(0) scale(1.1);
}
</style>