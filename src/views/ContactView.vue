<template>
  <!-- Banner -->
  <div id="banner-image" class="container is-fluid">
    <h1 class="title">Contact</h1>
  </div>
  <!-- end banner -->
  <div class="columns">
    <div class="column">
      <p>Le travail sur le site et le corpus est toujours en cours d'évolution. Pour toute remarque, suggestion ou
        demande d'informations complémentaires, vous pouvez contacter l'équipe technique de la Mission projets
        numériques de l'École nationale des chartes.
      </p>
      <!--<p class="title-h2">mpn [at] chartes [.] psl [.] eu</p>-->
      <p>En contactant l'équipe du site e-NDP, vous consentez au traitement des données que vous transmeterez dans votre
        mail.
      </p>
      <p>La Règlementation générale sur la protection des données (RGPD) vous permet d'exercer vos droits d'accès, de
        rectification, de modification ou de suppression de vos données personnelles. En savoir plus.
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
#banner-image::before {
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

p {
  margin-bottom: 20px;
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

h2, h3 {
  font-style: italic;
}

h3, h4 {
  color: var(--light-brown-alt)
}

</style>