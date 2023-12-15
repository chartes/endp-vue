<template>
  <div>
     <section class="hero">
      <div class="hero-body">
        <div class="container">
          <img class="banner-image" src="@/assets/home-ndp-map-banner.jpg" alt="">
          <h1 class="title">e-NDP Notre-Dame de Paris et son cloître : les lieux, les gens, la vie (1326-1504)</h1>
        </div>
      </div>
    </section>

    <section class="section"  style="margin-top: -3rem; margin-bottom: -3rem;">
      <div class="container">
        <div class="columns is-flex">
          <div class="column text-center has-text-justified">
            <p class="block lettrine justified-text">Le projet e-NDP est consacré à la publication numérique et à l'exploitation des 27 premiers registres du chapitre de l'Église de Paris, rédigés par ses notaires entre 1326 et 1504. Ces registres contiennent les décisions prises collectivement par les chanoines pour l’administration du culte, des biens, des droits, des personnes et collectivités dont le doyen et le chapitre de l'Église de Paris sont seigneurs, employeurs ou propriétaires. Ces propriétés et biens concernent le territoire du cloître, ses bâtiments et ses églises ― Notre-Dame et ses tours, Saint-Denis-du-Pas, Saint-Jean-le-Rond, Saint-Aignan ―, le parvis et l'Hôtel-Dieu, les très nombreuses maisons, terres, bois, vignes, étangs et autres possessions hors du cloître, hors de la Cité et hors de Paris.</p>
            <p class="block">Le menu <router-link to="/registres">registres</router-link> donne accès aux 14605 pages numérisées des registres et à une transcription obtenue par processus de reconnaissance de l'écriture manuscrite (« HTR » Handwritten Text Recognition). L’exploitation du contenu des registres et de la transcription par « HTR » vise à la connaissance du cloître, de sa topographie et de son bâti, de sa population, de son économie et de sa vie, des usages que l’on y fait du livre et de l’écrit.</p>
          </div>
          <div class="column">
            <img class="partner-image" src="@/assets/banner-partners-home.png" alt="map">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
.hero {
  background-color: transparent; /* Supprimer la couleur de fond de la bannière */
}

.banner-image {
  height: 400px !important; /* Ajuster la hauteur de l'image selon vos besoins */
  width: 100% !important;
  opacity: 0.40 !important; /* Régler l'opacité de l'image (0.0 à 1.0) */
}

.title {
  font-family : 'MedievalSharp', Times New Roman, Times, serif;
  position: absolute; /* Position absolue pour superposer le titre */
  top: 25%; /* Aligner le titre verticalement au centre */
  left: 35%; /* Aligner le titre horizontalement au centre */
  transform: translate(-50%, -50%); /* Centrer le titre précisément */
  color: black; /* Couleur du texte du titre */
  font-size: 50px; /* Taille de police du titre */
  text-align: left; /* Alignement du texte du titre */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Ombre du texte du titre */
  font-style: normal !important;
  /* add contour white on font */
  -webkit-text-stroke: 1px #833e0e;
}
.columns.is-flex {
  align-items: flex-start !important; /* Alignement vertical en haut */
}
.partner-image {
  width: 70%
}

.lettrine:first-child::first-letter {
  float: left; /* Alignez la lettrine à gauche du texte */
  font-size: 100px; /* Taille de police de la lettrine */
  color: black; /* Couleur de la lettrine */
  padding: 10px 10px 10px 0; /* Ajustez les marges pour aligner correctement la lettrine */
  margin-right: 5px; /* Marge à droite de la lettrine */
  font-family: 'MedievalSharp', Times New Roman, Times, serif; /* Police de la lettrine */
  -webkit-text-stroke: 1px #833e0e; /* Ajoutez un contour blanc à la lettrine */
}

.justified-text {
  text-align: justify;
}
</style>

<script>

export default {
  name: 'HomeView',
}
</script>

