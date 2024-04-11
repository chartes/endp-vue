<template>
  <!-- Banner -->
  <div id="banner-image" class="container is-fluid"></div>
  <!-- end banner -->

  <div class="page-title">
    <h1>Contact</h1>
  </div>

  <div class="columns container-text">
    <div class="column">
      <p>Le travail sur le site et le corpus est toujours en cours d'évolution. Pour toute remarque, suggestion ou
        demande d'informations complémentaires, vous pouvez contacter l'équipe technique de la Mission projets
        numériques de l'École nationale des chartes.
      </p>
      <p class="title-h2">xxx [at] chartes [.] psl [.] eu</p>
      <p class="rgpd-info">En contactant l'équipe du site eNDP, vous consentez au traitement des données que vous transmeterez dans votre
        mail. La Règlementation générale sur la protection des données (RGPD) vous permet d'exercer vos droits d'accès, de
        rectification, de modification ou de suppression de vos données personnelles à l'École nationale des chartes. <router-link to="/termsofservice">En savoir plus</router-link>.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactView"
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

p, ul, li {
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


.container-text {
  text-align: justify;
}

.rgpd-info {
  font-size:12pt;
  font-style: italic;
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