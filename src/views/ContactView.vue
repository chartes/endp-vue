<template>
  <div class="header">
    <h1 class="title-h1">Contact</h1>
  </div>
  <div class="columns">
    <div class="column is-5">
      <p>Le travail sur le site et le corpus est toujours en cours d'évolution. Pour toute remarque, suggestion ou
        demande d'informations complémentaires, vous pouvez contacter l'équipe technique de la Mission projets
        numériques de l'École nationale des chartes.</p>
      <!--<p class="title-h2">mpn [at] chartes [.] psl [.] eu</p>-->
      <p>En contactant l'équipe du site e-NDP, vous consentez au traitement des données que vous transmeterez dans votre
        mail. </p>
      <p>La Règlementation générale sur la protection des données (RGPD) vous permet d'exercer vos droits d'accès, de
        rectification, de modification ou de suppression de vos données personnelles. En savoir plus.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactView"
}
</script>

<style scoped>
.title-h1 {
  font-size: 3rem;
  font-weight: 600;
  padding: 5%;
  position: relative;
  align-items: flex-start;
  text-align: left;
  color: #031531;
}

.title-h2 {
  font-family: 'Lato', sans-serif;
  font-size: 28pt;
  font-weight: 400;
  text-align: center;
  margin: 2rem;
}

</style>