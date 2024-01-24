<template>
  <!-- banner -->
  <div id="banner-image" class="container is-fluid">
    <h1 class="title">e-NDP Notre-Dame de Paris et son cloître : <br> les lieux, les gens, la vie (1326-1504)</h1>
  </div>
  <!-- end banner -->
  <div class="container is-fluid">
    <p class="block lettrine">Le projet e-NDP est consacré à la publication numérique et à l'exploitation des 27
      premiers registres du chapitre de l'Église de Paris, rédigés par ses notaires entre 1326 et 1504. Ces registres
      contiennent les décisions prises collectivement par les chanoines pour l’administration du culte, des biens, des
      droits, des personnes et collectivités dont le doyen et le chapitre de l'Église de Paris sont seigneurs,
      employeurs ou propriétaires.</p>
    <p class="block lettrine">Ces propriétés et biens concernent le territoire du cloître, ses bâtiments et ses
      églises ― Notre-Dame et ses tours, Saint-Denis-du-Pas, Saint-Jean-le-Rond, Saint-Aignan ―, le parvis et
      l'Hôtel-Dieu, les très nombreuses maisons, terres, bois, vignes, étangs et autres possessions hors du cloître,
      hors de la Cité et hors de Paris. Le menu
      <router-link to="/registres">registres</router-link>
      donne accès aux 14605 pages numérisées des registres et à une transcription obtenue par processus de
      reconnaissance de l'écriture manuscrite (« HTR » Handwritten Text Recognition). L’exploitation du contenu des
      registres et de la transcription par « HTR » vise à la connaissance du cloître, de sa topographie et de son bâti,
      de sa population, de son économie et de sa vie, des usages que l’on y fait du livre et de l’écrit.
    </p>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
}
</script>
<style src="@/assets/css/endp_utils.css"></style>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');

/* Set image banner */
#banner-image::before {
  background-image: url("@/assets/banners/banner-ndp-map_home_page.jpg");
}

.block {
  text-align: justify;
  width: 80%;
  text-indent: 0;
  -webkit-hyphens: none;
  animation: fadeTextIn 2s ease-out 0s;
}

.lettrine::first-letter {
  font-family: MedievalSharp, Times New Roman, Times, serif;
  font-size: 3.5em;
  margin-top: 20px;
  padding-right: 0.2em;
  float: left;
  color: #031531;
}
</style>
