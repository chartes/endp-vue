<template>
  <div class="box box-iconography-collecta" v-if="!ItemsEmpty" :class="{ 'is-opened': isOpened }">
    <div class="box-header">
      <h3>Iconographie sur <span class="logo-collecta">COLLECTA</span></h3>
      <a class="toggle-btn" @click="toggleContent($event)"></a>
    </div>
    <div class="box-content">
      <Carousel :itemsToShow="ItemsShowed"
                :breakpoints="breakpoints"
                :wrapAround="true"
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
      <div class="active-slide-caption">Légende</div>
    </div>
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
  data() {
    return {
      isOpened: true,
      breakpoints: {
        300: {
          itemsToShow: 1.5,
          itemsToScroll: 1
        },
        700: {
          itemsToShow: 2,
          itemsToScroll: 1
        },
        1024: {
          itemsToShow: 3,
          itemsToScroll: 1
        },
      },
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
      return this.totalItems < 5 ? this.totalItems : 5;
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
    },

    toggleContent(event) {
      event.preventDefault();
      this.isOpened = !this.isOpened;
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
  margin-top: 50px;
  padding-bottom: var(--right-column-bottom-padding-desktop);
}

.box-iconography-collecta.is-opened {
  padding-bottom: 0;
}

.box-iconography-collecta.is-opened .box-content {
  background-color: var(--panel-bg-color);
  margin-bottom: var(--right-column-bottom-padding-desktop);
  width: 100%;
}

.box-header {
  width: 100%;
  text-align: left;
  position: relative;
}

.box-header h3 {
  font-size: 24px;
  font-weight: 400;
  font-style: italic;
  color: #272727;
  margin-bottom: 6px;
  padding-right: 25px;
}

.logo-collecta {
}

.toggle-btn {
  position: absolute;
  right: 0;
  top: 0;

  background: transparent url('~@/assets/images/b_Open_liste.svg') center / cover no-repeat;
  cursor: pointer;
  width: 27px;
  height: 27px;
  margin-bottom: 12px;
  margin-right: 10px;
}

.is-opened .toggle-btn {
  background-image: url('~@/assets/images/b_Close_liste.svg');
}

.box-content {
  display: none;
}

.is-opened .box-content {
  display: block;
  position: relative;
  max-height: 65vh;
}

.box-content .active-slide-caption {
  display: none;

  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 2;

  font-family: var(--font-secondary);
  font-size: 18px;
  font-weight: 400;
  color: #FFFFFF;
  padding-bottom: 20px;
  text-align: center;
}

/* Carrousel */

.carousel__item {
  min-height: 300px;
  width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}

li.carousel__slide a:before,
li.carousel__slide img {
  transform:  scale(0.7);
}

li.carousel__slide img {
  position: relative;
  z-index: 5;
}

li.carousel__slide a {
  position: relative;
}

li.carousel__slide a:before {
  content: "";
  display: block;
  width: 50%;
  height: 50%;
  background-color: #3b3b3b;
  position: absolute;
  top: 58%;
  left: 35%;
  transform-origin: bottom right;
  transform: translateY(-50%) skewX(-10deg);
  z-index: 1;
}

li.carousel__slide a::after {
  content: "";
  position: absolute;
  left:0;
  top: -10%;
  display: block;
  width: 110%;
  height: 60%;
  background-color: var(--panel-bg-color);
  z-index: 2;
}

:deep(.carousel__slide--active) {
  position: relative;
}

:deep(.carousel__slide--active::after) {
  content:"";
  position: absolute;
  bottom: 76px;
  display: block;
  border: 7px solid var(--light-brown);
  width: 100%;
  transform:  scale(0.7);
  z-index: 6;
}

:deep(.carousel__prev) {
  transform: translate(-175%, 46px) scaleX(-1);
}

:deep(.carousel__next) {
  transform: translate(-5%, 46px);
}

:deep(.carousel__prev),
:deep(.carousel__next) {
  position: absolute;
  left:50%;
  bottom: 0;
  top: unset;

  display: inline-block;
  width: 30px;
  height: 30px;
  border: none;
  outline: none;
  cursor: pointer;
  background: url("@/assets/images/b_fleche.svg") center / 28px auto no-repeat;
  opacity: 0.8;
}

:deep(.carousel__prev svg),
:deep(.carousel__next svg) {
  display: none;
}

:deep(.carousel__pagination) {
  display: none;
}

:deep(.carousel__viewport) {
  background-color: #555555;
}


@media (max-width: 1380px) {
  .box-iconography-collecta .box-header {
    padding: 0 var(--tablet-side-padding);
  }
}

@media screen and (max-width: 1024px) {

  .box-iconography-collecta .box-header {
    padding: 0 var(--mobile-side-padding) var(--right-column-bottom-padding-mobile) !important;
  }

  .box-iconography-collecta.is-opened  .box-header {
    padding: 0 var(--mobile-side-padding) 0 !important;
  }

  :deep(.carousel__slide--active::after) {
    display: none;
  }

}




/*

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

*/

</style>