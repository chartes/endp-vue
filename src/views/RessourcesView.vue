<template>
  <!-- Banner -->
  <div id="banner-image" class="container is-fluid"></div>
  <!-- end banner -->

  <div class="page-title">
    <h1>Ressources</h1>
  </div>

  <!-- Main grid  -->
  <div class="columns">
    <div class="column">

      <h2 class="subtitle">Chaîne de traitement</h2>
      <br>


      <img src="@/assets/others/endp_workflow_V1.drawio.svg" alt="Chaîne de traitement" style="width: 100%; max-width: 800px; display: block; margin: 0 auto;" >

      <br>
      <h2 class="subtitle">Liens utiles</h2>

      <!--
      <h3>Un titre de niveau 2</h3>
      <p>Un paragraphe</p>

      <h4>Un titre de niveau 3</h4>
      <p>Un paragraphe</p>
      -->

      <ul>
        <li class="has-text-left">Lien vers le blog Hypothèses du projet e-NDP : <a href="https://endp.hypotheses.org/" target="_blank">Lien</a></li>
        <li class="has-text-left">Lien SIV des Archives nationales Registres capitulaires médiévaux de Notre-Dame de Paris : <a href="https://www.siv.archives-nationales.culture.gouv.fr/siv/rechercheconsultation/consultation/ir/consultationIR.action?irId=FRAN_IR_059635&details=false&gotoArchivesNums=false&udId=root&auSeinIR=true" target="_blank">Lien</a></li>
        <li class="has-text-left">Vérité terrain pour le projet e-NDP (dépôt Zenodo) : <a href="https://zenodo.org/record/7401833#.Y-jqOxOZORo" target="_blank">Lien</a></li> <!-- quand dispo lien HTR United à ajouter -->
        <li class="has-text-left">Modèle HTR pour le projet e-NDP (dépôt Zenodo) : <a href="#" target="_blank">Lien</a></li> <!-- quand dispo lien HTR United à ajouter -->
        <li class="has-text-left">Dépôt GitHub regroupant les ressources HTR : <a href="https://github.com/chartes/e-NDP_HTR" target="_blank">Lien</a></li>
        <li class="has-text-left">Dépôt GitHub regroupant les expérimentations TAL : <a href="https://github.com/chartes/e-NDP_TAL/releases/tag/v0.0.1" target="_blank">Lien</a></li>
        <li class="has-text-left">Lien vers le manifeste IIIF e-NDP : <a href="https://iiif.chartes.psl.eu/collections/endp/endp.json" target="_blank">Lien</a></li>
        <li class="has-text-left">Dépôt Nakala des images des registres de conclusions capitulaires médiévaux de Notre-Dame de Paris (1326-1504): <a href="https://nakala.fr/collection/10.34847/nkl.03cbi521" target="_blank">Lien</a></li>
        <li class="has-text-left">Dépôt Nakala des fac-similés ALTO des registres de conclusions capitulaires médiévaux de Notre-Dame de Paris (1326-1504): <a href="https://nakala.fr/collection/10.34847/nkl.2ddb3ki2" target="_blank">Lien</a></li>
      </ul>
    </div>
  </div>
</template>


<script>
export default {
  name: "RessourcesView"
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