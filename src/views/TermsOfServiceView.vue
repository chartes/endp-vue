<template>
  <!-- Banner -->
  <div id="banner-image" class="container is-fluid"></div>
  <!-- end banner -->

  <div class="page-title">
    <h1>Mentions légales</h1>
  </div>

  <div class="columns container-text">
    <div class="column">
      <h2>Éditeur</h2>

      <p>
        École nationale des chartes, établissement public administratif<br>
        65, rue de Richelieu<br>
        12, rue des Petits-Champs<br>
        75002 Paris<br>
        Tél. + 33 (0)1 55 42 75 00<br>
        Siret : 19753478700043</p>

      <h2>Hébergement</h2>

      <p>
        IR* Huma-Num<br>
        Bâtiment de recherche Nord<br>
        14, cours des humanités<br>
        93322 Aubervilliers cedex
      </p>

      <h2>Responsable de publication</h2>
      <p>
        Michelle Bubenicek, directrice de l'École<br>
        secretariat@chartes.psl.eu
      </p>

      <h3>Données personnelles</h3>

      <p>Consulter la page <a href="https://www.chartes.psl.eu/politique-de-confidentialite" target="_blank">« Politique de confidentialité »</a> de l'École nationale des chartes - PSL.</p>

      <h3>Propriété intellectuelle du site et de ses contenus</h3>

      <p>Sauf mention contraire, les contenus du site eNDP (endp.chartes.psl.eu) et les données accessibles via ses API
         sont partagés sous licence ouverte (<a href="https://creativecommons.org/licenses/by/4.0/legalcode.fr" target="_blank">CC-BY 4.0</a>).</p>

      <h3>Crédits photographiques</h3>

      <p>Les sources des bannières des pages du site eNDP (endp.chartes.psl.eu) sont les
        suivantes :</p>
      <ul>
        <li>
          page d'accueil&nbsp;: «&nbsp;Olivier Truschet, Germain Hoyau&nbsp;; Plan de Paris vers 1550&nbsp;», Domaine public, <a href="https://commons.wikimedia.org/wiki/File:Plan_de_Paris_vers_1550_color.jpg">Wikimedia Commons</a>&nbsp;;
        </li>
        <li>
          page personnes&nbsp;: «&nbsp;Unité de décor - f. 108r, Liturgie&nbsp;: service funèbre&nbsp;», <a href="https://mandragore.bnf.fr/ark:/12148/cgfbt209696b" target="_blank">BnF-Mandragore</a>, <a href="https://gallica.bnf.fr/edit/und/conditions-dutilisation-des-contenus-de-gallica" target="_blank">conditions de réutilisation</a>&nbsp;;
        </li>
        <li>
          page registres&nbsp;: «&nbsp;Détail du <a href="https://nakala.fr/10.34847/nkl.8bdfe89g" target="_blank">registre capitulaire LL105</a>&nbsp;», <a href="https://creativecommons.org/licenses/by/4.0/legalcode.fr" target="_blank">CC-BY 4.0</a>&nbsp;;</li>
        <li>
          page ressources, mentions légales  et contacts&nbsp;: «&nbsp;Détail de la rosace ouest de la Cathédrale Notre-Dame de Paris&nbsp;», Cyril Preiss, <a href="https://www.culture.gouv.fr/Mentions-legales" target="_blank">conditions de réutilisation</a>.
        </li>
      </ul>

      <p>L'icône <a href="https://icon-icons.com/pack/Business-Solid---The-Capitalism-icon-set/2534" target="_blank">«&nbsp;Processing&nbsp;»</a> présente dans le schéma de la page ressources du site est partagé sous licence <a href="https://creativecommons.org/licenses/by/4.0/legalcode.fr" target="_blank">CC-BY 4.0</a>.</p>

      <p>Les crédits photographiques et autres mentions relatives aux droits d'auteur, tels que spécifiés sur ce site, doivent être respectés.</p>

      <hr>
      <p class="tos-last-maj-date">Cette notice d’information est susceptible d’être modifiée. Dernière date de mise à jour de la page : 15 avril 2024.</p>
     </div>
  </div>
</template>


<script>
export default {
  name: "TermsOfServiceView"
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
  margin-top: 20px;
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
  margin: 40px 0 10px;
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
  text-align: justify;
}


.tos-last-maj-date {
  font-size: 16px;
  font-style: italic;
  color: var(--dark-grey);
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