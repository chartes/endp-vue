<template>
  <div class="card">
    <header class="card-header" @click="toggleContent">
      <p class="card-header-title">
        <!-- add book icon -->
        <span class="card-header-subtitle">{{ period }}</span>
        <span class="card-header-main-title">{{ title }}</span>
        <span class="container-icons-services">
        <span class="icon book-icon-card" v-if="isEdited">
        <i class="fas fa-book-open"></i>
      </span>
        <span class="icon book-icon-card" v-if="facSimile">
        <i class="fas fa-book"></i>
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
            <td><span class="icon book-icon-card"><i class="fas fa-book"></i></span></td>
            <td><router-link :to="`/facsimile/${volume}/${firstCanvasID}`" @click="navigateToFacSimile(firstCanvasID, volume, yearFirstPage)">{{ firstPage }}</router-link></td>
            <td><router-link :to="`/facsimile/${volume}/${lastCanvasID}`" @click="navigateToFacSimile(lastCanvasID, volume, yearLastPage)">{{ lastPage }}</router-link></td>
          </tr>
          <tr v-if="isEdited">
            <td><span class="icon book-icon-card"><i class="fas fa-book-open"></i></span></td>
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

.card {
  padding-bottom: 10px;
  border-bottom: solid 6px #D74A52;
}

.card-header {
  position: relative;
}

.card-header,
.card-content.is-open .content {
  padding: 0 4px;
}

.card-header-title {
  display: inline;
  align-items: center;
  padding: 0;
  font-family: "Barlow", sans-serif !important;
  font-weight: bold;
}

.card-header-title > * {
  display: block;
}

.card-header-main-title {
  margin-bottom: 20px;
  max-width: 75%;

  font-family: var(--font-primary);
  font-size: 20px;
  font-weight: 400;
  color: #000000;
}

.card-header-subtitle {
  margin-bottom: 3px;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
}

.card-header-subtitle,
.ressource-title {
  font-family: var(--font-secondary);
  color: var(--light-brown-alt);
}

.book-icon-card {
  font-size: 24px;
  color: #000000;
  margin-right: 10px;
}

.container-icons-services {
  padding-top: 5px;
}

.ressource-title {
  font-size: 20px;
  vertical-align: top;
  font-weight: 400;
}

button.toggle-btn-wrapper {
  position: absolute;
  bottom: 0;
  right: 0;

  border: none;
  padding: 0;
  width: 30px;
  height: 30px;
  background: transparent
}

.toggle-btn-wrapper .icon {
  display: inline-block;
  width: 100%;
  height: 100%;
}

.toggle-btn {
  display: inline-block;
  width: 100%;
  height: 100%;
  background: transparent url('~@/assets/images/b_Open_liste.svg') center / cover no-repeat;
  cursor: pointer;
}

.toggle-btn.is-opened {
  background-image: url('~@/assets/images/b_Close_liste.svg');
}


.table-available-ressources {
  width: 80%; /* Assurez-vous que le tableau utilise toute la largeur disponible */
  border-collapse: separate; /* Sépare les bordures des cellules */
  border-spacing: 4px 0; /* Espacement entre les colonnes et les lignes */
}

.table-available-ressources th {
  padding-bottom: 5px;
}

.table-available-ressources > td, th {
  text-align: left;
  font-family: var(--font-secondary);
  font-weight: 600;
  color: #6E6E6E;
}

.table-available-ressources td {
  padding-bottom: 5px;
}


.table-available-ressources td,
.table-available-ressources td a {
  font-family: var(--font-secondary);
  color: #6E6E6E;
}

.table-available-ressources td a {
  text-decoration: underline;
}

.card-content .content a:hover,
.table-available-ressources td a:hover {
  color: var(--light-brown-alt);
}

.table-available-ressources td:first-child {
  width: 30px;
}

hr,
.main-label {
  display: none;
}

.card-content {
  max-height: 0;
  padding: 0;
  overflow: hidden;
  transition: max-height 0.5s ease-out; /* La transition se fera sur la hauteur max */
}

.card-content.is-open {
  max-height: 500px; /* Mettez une hauteur max suffisamment grande pour afficher tout le contenu */
  margin-top: 10px;
  padding-top: 15px;
  border-top: solid 1px #A5A5A5;
}

.card-content .content {
  font-family: var(--font-secondary);
  font-size: 20px;
  font-weight: 400;
  color: #6E6E6E;
}

.card-content .content p {
  margin-bottom: 0;
}

.card-content .content a {
  margin-bottom: 0;
  color: #6E6E6E;
  text-decoration: underline;
}


</style>