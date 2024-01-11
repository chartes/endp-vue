<template>
  <div id="banner-image" class="container is-fluid" :style="{ backgroundImage: 'url(' + image + ')' }">
    <h1 class="banner__title" v-html="title"></h1>
  </div>
</template>

<script>
export default {
  name: "BannerPage",
  props: {
    title: String,
    image: String
  },
}
</script>

<style scoped>
@import '@/assets/css/endp_utils.css';

#banner-image {
  position: relative; /* Pour le positionnement absolu du titre */
  height: 100%; /* Ajustez selon vos besoins */
  width: 100%;
  max-width: 100%;
  display: flex;
  animation: fadeImageIn 1s ease-out 0s;
  margin-bottom: 50px;
}

#banner-image::before {
  border-radius: 0px 0px 0px 10px;
  content: "";
  background-size: cover;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 0.5;
}

.banner__title {
  font-family: MedievalSharp, sans-serif;
  font-size: 3rem;
  position: relative;
  align-items: flex-start;
  text-align: left;
  color: #031531;
  animation: fadeTitleIn 2s ease-out 0s;
}
</style>