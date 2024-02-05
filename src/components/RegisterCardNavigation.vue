<template>
  <div class="card">
    <header class="card-header" @click="toggleContent">
      <p class="card-header-title">
        <!-- add book icon -->
        <span class="card-header-main-title">{{ title }}</span>
        <span class="card-header-subtitle">{{ period }}</span>
        <span class="container-icons-services">
        <span class="icon book-icon-card" v-if="isEdited">
        <i class="fas fa-book"></i>
      </span>
        <span class="icon book-icon-card" v-if="facSimile">
        <i class="fas fa-book-open"></i>
      </span>
    </span>
      </p>
      <button class="toggle-btn-wrapper">
      <span class="icon">
        <span class="toggle-btn" :class="{ 'is-opened': isOpened }"></span>
      </span>
      </button>
    </header>
    <div class="card-content" v-if="isOpened" :class="{ 'is-open': isOpened }">
      <div class="content">
        <p class="main-label">{{ mainLabel }}</p>
        <hr>
        <p class="ressource-title">Accéder aux ressources</p>
        <p>Lien vers la salle de lecture virtuelle des AN : <a :href="AnSivLink" target="_blank">ici</a>
        </p>
        <p>Lien vers facsimile : <router-link :to="`/facsimile/${volume}/0`" @click="navigateToFacSimile">ici</router-link></p>
      </div>
      <div>
        <table class="table-available-ressources">
          <thead>
          <tr>
            <th></th>
            <th>Première page</th>
            <th>Dernière page</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="facSimile">
            <td><span class="icon book-icon-card"><i class="fas fa-book-open"></i></span></td>
            <td><router-link :to="`/facsimile/${volume}/${firstCanvasID}`" @click="navigateToFacSimile(firstCanvasID, volume, yearFirstPage)">{{ firstPage }}</router-link></td>
            <td><router-link :to="`/facsimile/${volume}/${lastCanvasID}`" @click="navigateToFacSimile(lastCanvasID, volume, yearLastPage)">{{ lastPage }}</router-link></td>
          </tr>
          <tr v-if="isEdited">
            <td><span class="icon book-icon-card"><i class="fas fa-book"></i></span></td>
            <td>{{ firstPage }}</td>
            <td>{{ lastPage }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardNavigation",
  props: {
    volume: String,
    title: String,
    period: String,
    mainLabel: String,
    AnSivLink: String,
    firstPage: String,
    lastPage: String,
    firstCanvasID: Number,
    lastCanvasID: Number,
    isEdited: Boolean,
    facSimile: Boolean,
    defaultCanvasID: Number,
    yearFirstPage:String,
    yearLastPage:String,
  },
  data() {
    return {
      isOpened: false,
    };
  },
  methods: {
    /**
     * Navigate to facsimile page
     * @return {void}
     */
    navigateToFacSimile(canvas, volume, year) {
    this.$store.commit('setCanvasId', canvas);
    this.$store.commit('setEndpVolume', volume);
    this.$store.commit('setYear', year);
  },
    /**
     * Toggle content of card
     * @return {void}
     */
    toggleContent() {
      this.isOpened = !this.isOpened;
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Barlow&family=Barlow+Semi+Condensed&display=swap');

.card-header {
  background-color: #ffffff;
}

.card-header-title {
  display: inline;
  align-items: center;
  padding: 20px;
  font-family: "Barlow", sans-serif !important;
  font-weight: bold;
}

.card-header-main-title {
  margin-right: 20px;
  margin-left: 15px;
  color: #000000;
  font-size: 20px;
}

.card-header-subtitle {
  color: #929292;
  font-size: 20px;
}

.book-icon-card {
  font-size: 19px;
  color: #8d1919;
  margin-left: 10px;
}

.container-icons-services {
  display: inline;
  float: right;
  padding-top: 5px;
}

.ressource-title {
  font-family: "Barlow", sans-serif !important;
  font-weight: bold;
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.toggle-btn-wrapper {
  border: none;
  background-color: #ffffff;
  margin-right: 10px;
}

.toggle-btn {
  width: 27px;
  height: 27px;
  background: url('~@/assets/icons/chevron_rouge.svg') center / cover no-repeat;
  transition: transform 0.6s;
}

.toggle-btn.is-opened {
  width: 27px;
  height: 27px;
  background: url('~@/assets/icons/croix.svg') center / cover no-repeat;
}


.table-available-ressources {
  width: 100%; /* Assurez-vous que le tableau utilise toute la largeur disponible */
  border-collapse: separate; /* Sépare les bordures des cellules */
  border-spacing: 15px 0; /* Espacement entre les colonnes et les lignes */
  margin: 0 auto; /* Centre le tableau dans le conteneur */
}

.table-available-ressources > td, th {
  padding: 10px;
  text-align: left;
  font-family: "Barlow", sans-serif !important;
  font-weight: bold;
}

.card-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease-out; /* La transition se fera sur la hauteur max */
}

.card-content.is-open {
  max-height: 500px; /* Mettez une hauteur max suffisamment grande pour afficher tout le contenu */
}
</style>