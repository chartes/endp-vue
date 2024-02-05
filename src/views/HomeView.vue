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
    <div class="logos-container container is-fluid">
      <a href="https://www.chartes.psl.eu/fr" target="_blank"><img src="@/assets/partners_logo/enc.png" alt="Logo École nationale des chartes" class="logo logo-enc"/></a>
      <!--<a href="https://www.pantheonsorbonne.fr/" target="_blank"><img src="@/assets/partners_logo/paris1.png" alt="Logo Paris 1 Panthéon-Sorbonne" class="logo logo-paris1"/></a>
      <a href="https://www.cnrs.fr/fr" target="_blank"><img src="@/assets/partners_logo/cnrs.svg.png" alt="Logo CNRS" class="logo cnrs"/></a>-->
      <a href="https://lamop.pantheonsorbonne.fr/laboratoire-medievistique-occidentale-paris" target="_blank"><img src="@/assets/partners_logo/lamop.png" alt="Logo Lamop" class="logo"/></a>
      <a href="https://www.archives-nationales.culture.gouv.fr/" target="_blank"><img src="@/assets/partners_logo/an.png" alt="Logo Archives nationales" class="logo logo-an"/></a>
      <a href="https://www.bibliotheque-mazarine.fr/fr/" target="_blank"><img src="@/assets/partners_logo/mazarine.png" alt="Logo Bibliothèque Mazarine" class="logo"/></a>
      <a href="https://www.bnf.fr/fr" target="_blank"><img src="@/assets/partners_logo/bnf.png" alt="Logo BnF" class="logo"/></a>
      <a href="https://anr.fr/Projet-ANR-20-CE27-0012" target="_blank"><img src="@/assets/partners_logo/ANR.jpg" alt="Logo ANR" class="logo logo-anr"/></a>
    </div>
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

.logos-container {
  justify-content: center;
  align-items: center;
  gap: 5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  margin-left: -10rem;

}

.logo {
  width: 8rem;
  height: auto;
  filter: grayscale(100%);
  transition: transform 0.3s ease, filter 0.3s ease;
}

.logo-enc {
  width: 15rem;
}

.logo-an {
  width: 13rem;
}

.logo-anr {
  width: 9rem;
}

.logo:hover {
  transform: scale(1.4);
  filter: grayscale(0);
  cursor: pointer;
}
</style>
