<template>
  <!-- Banner -->
  <div id="banner-image" class="container is-fluid"></div>
  <!-- end banner -->

  <div class="page-title">
    <h1>À propos</h1>
  </div>

  <div class="columns container-text">
    <div class="column">
      <h2>Crédits de l'application</h2>
      <p>L'application eNDP (endp.chartes.psl.eu) est une réalisation de la mission projet numériques de l'École nationale des chartes - PSL, développée
      dans le cadre du projet ANR e-NDP, «&nbsp;Notre-Dame de Paris et son cloître : les lieux, les gens, la vie&nbsp;»  (coordination Julie Claustre et Darwin Smith).</p>
      <ul>
        <li>Conception et développement de l'application : Vincent Jolivet, Lucas Terriel.</li>
        <li>Financements : <a href="https://anr.fr/Projet-ANR-20-CE27-0012" target="_blank">Agence nationale de la recherche (ANR) - ANR-20-CE27-0012</a>.</li>
        <li>Hébergement : <a href="ttps://www.huma-num.fr/" target="_blank">IR* Huma-Num</a>.</li>
      </ul>
      <br>
      <h2>Ont participé au projet e-NDP</h2>
      <p>Isabelle Bretthauer, Pierre Brochard, Olivier Canteaut, Julie Claustre, Émilie Cottereau-Gabillet, Fabrice Delivré, Mathilde Denglos, Vincent Jolivet, Véronique Julerot, Thierry Kouamé, Élisabeth Lusset, Anne Massoni, Sébastien Nadiras, Nicolas Perreaux, Hugo Regazzi, Darwin Smith, Lucas Terriel, Sergio Torres Aguilar, Mathilde Treglia</p>
    </div>

  </div>
</template>


<script>
export default {
  name: "AboutView"
}
</script>

<style scoped>

/* Set image banner */
.page-title, #banner-image::before {
  background-image: url("@/assets/banners/band_Ressources.png");
}

.column {
  background-color: var(--panel-bg-color);
  padding: 80px 120px;
  min-height: 100vh;

  font-family: var(--font-secondary);
}

p, ul, li, a {
  font-size: 22px;
}

a {
  color: var(--light-brown-alt);
}

a:hover {
  text-decoration: underline;
}


h2, h3 {
  font-family: var(--font-primary);
}

.column h2 {
  display: inline-block;
  font-size: 26px;
  color: var(--dark-grey);
  font-weight: 400;
  font-style: italic;
  box-shadow: 0 3px 0 0 currentColor;
  margin-bottom: 40px;
}

.column h2 b {
  font-weight: 400;
}

h2, h3 {
  font-style: italic;
}

h3, h4 {
  color: var(--brown);
  font-size: 22px;
  line-height: 1.3;
}

h3 {
  margin: 15px 0 10px;
}

h2 + h4,
h3 + h4,
h2 + h3 {
  margin-top: 0;
}

h4 {
  margin: 20px 0 10px;
}

p, li {
  margin-bottom: 10px;
}

ul {
  list-style-type: "•";
  padding-left: 20px;
}

ul li {
  margin-left: 1px;
  padding-left: 10px;
}

.container-text {
  text-align: left;
}

@media screen and (max-width: 1024px) {

  #banner-image::before {
    background-color: #000000CC;
    background-image: none !important;
  }

  .columns {
    padding: 0;
  }

  .column {
    padding: 40px 20px;
    line-height: 1.35;
  }

  ul {
    padding-left: 0;
  }

  ul li[data-v-3485ec17] {
    margin-left: 0;
  }

  p {
    margin-bottom: 15px;
  }

  a {
    word-break: break-word;
  }

}

</style>