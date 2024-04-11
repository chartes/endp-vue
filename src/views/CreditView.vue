<template>
  <!-- Banner -->
  <div id="banner-image" class="container is-fluid"></div>
  <!-- end banner -->

  <div class="page-title">
    <h1>Crédits</h1>
  </div>

  <div class="columns container-text">
    <div class="column">
      <ul>
        <li>Direction technique : Vincent Jolivet, chef de la mission projets numériques (École nationale des chartes),
          Lucas&nbsp;Terriel, ingénieur en développement logiciel (École nationale des chartes)</li>
        <li>Développement et maintenance de l'application : Lucas Terriel, xxx</li>
        <li>Maquette graphique : xxx</li>
        <li>Financements : <a href="https://anr.fr/Projet-ANR-20-CE27-0012" target="_blank">Agence nationale de la recherche (ANR) - ANR-20-CE27-0012</a></li>
        <li>Hébergement : IR* Huma-Num</li>
      </ul>
    </div>
  </div>
</template>


<script>
export default {
  name: "CreditView"
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
  padding-left: 50px;

}

ul li {
  margin-left: 1px;
  padding-left: 10px;
}

.container-text {
  text-align: justify;
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
  }

}

</style>