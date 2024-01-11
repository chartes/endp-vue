<template>
  <!-- banner (TODO: convert to component) -->
  <div id="banner-image" class="container is-fluid">
    <h1 class="title">e-NDP Notre-Dame de Paris et son cloître : <br> les lieux, les gens, la vie (1326-1504)</h1>
  </div>
  <!-- end banner -->
  <div class="container is-fluid">
    <p class="block bleft lettrine">Le projet e-NDP est consacré à la publication numérique et à l'exploitation des 27
      premiers registres du chapitre de l'Église de Paris, rédigés par ses notaires entre 1326 et 1504. Ces registres
      contiennent les décisions prises collectivement par les chanoines pour l’administration du culte, des biens, des
      droits, des personnes et collectivités dont le doyen et le chapitre de l'Église de Paris sont seigneurs,
      employeurs ou propriétaires.</p>
    <p class="block bright lettrine">Ces propriétés et biens concernent le territoire du cloître, ses bâtiments et ses
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
  <!--
  <div class="container is-flex is-centered institution__brand__logos__container">
    <div class="columns is-multiline is-centered">
        <div class="column is-2">
            <a href="https://www.chartes.psl.eu/fr" target="_blank">
                <img class="image__partner" :src="require(`@/assets/partners_logo/enc.png`)" alt="Ecole-nationale-chartes-logo">
            </a>
        </div>
        <div class="column is-2">
            <a href="https://lamop.pantheonsorbonne.fr/laboratoire-medievistique-occidentale-paris" target="_blank">
                <img :src="require(`@/assets/partners_logo/lamop.png`)" alt="Lamop-logo">
            </a>
        </div>
        <div class="column is-2">
            <a href="https://www.archives-nationales.culture.gouv.fr/" target="_blank">
                <img src="{{ url_for('static', filename='images/partners-logo/an.png') }}" alt="Archives-nationales-logo">
            </a>
        </div>
        <div class="column is-2">
            <a href="https://www.bnf.fr/fr" target="_blank">
                <img src="{{ url_for('static', filename='images/partners-logo/bnf.png') }}" alt="BNF-logo">
            </a>
        </div>
        <div class="column is-2">
            <a href="https://www.bibliotheque-mazarine.fr/fr/" target="_blank">
                <img src="{{ url_for('static', filename='images/partners-logo/mazarine.png') }}" alt="Mazarine-logo">
            </a>
        </div>
        <div class="column is-2">
            <a href="https://anr.fr/Projet-ANR-20-CE27-0012" target="_blank">
                <img src="{{ url_for('static', filename='images/ANR-logo-C.jpg') }}" alt="ANR-logo">
            </a>
        </div>

    </div>
</div>-->

</template>
<script>
export default {
  name: 'HomeView',
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');

#banner-image {
  position: relative; /* Pour le positionnement absolu du titre */
  height: 400px; /* Ajustez selon vos besoins */
  width: 100%;
  max-width: 100%;
  display: flex;
  animation: fadeImageIn 1s ease-out 0s;
  margin-bottom: 50px;
}


#banner-image::before {
  border-radius: 0px 0px 0px 10px;
  content: "";
  background-image: url("@/assets/home-ndp-map-banner.jpg");
  background-size: cover;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 0.5;
}

.title {
  font-family: MedievalSharp, sans-serif;
  font-size: 3rem;
  position: relative;
  align-items: flex-start;
  text-align: left;
  color: #031531;
  animation: fadeTitleIn 2s ease-out 0s;
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

.institution__brand__logos__container {
  margin-top: 50px;
}

.image__partner {
  width: 400px;
  height: auto;
}

@media (max-width: 768px) {
  .image__partner {
    width: 100%; /* Taille maximale de l'écran */
  }
}

@keyframes fadeTitleIn {
  0% {
    opacity: 0;
    transform: translateY(100px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeImageIn {
  0% {
    opacity: 0;
    transform: translateX(100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeTextIn {
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

</style>
