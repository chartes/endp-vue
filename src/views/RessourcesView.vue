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
      <p>Les 26 registres médiévaux (1326-1504) du chapitre de Notre-Dame représentent une masse documentaire d’environ
        15&nbsp;000 pages manuscrites. Les variations graphiques et linguistiques, ainsi que la singularité de ces
        documents
        de la pratique sont autant de défis pour l’édition d’un corpus largement inédit.</p>
      <p>Le projet e-NDP a mobilisé les méthodes et outils de l’apprentissage automatique (<i>machine learning</i>) pour
        relever ces défis : lecture automatique des écritures manuscrites (HTR) pour la transcription, recours aux
        modèles de langue pour les annotations linguistiques (lemmatisation et liage des entités nommées).</p>
      <p>À chaque étape de la chaîne de traitements (HTR, annotation, indexation), des données sont produites et
        réutilisées. Nous avons veillé à documenter non seulement chacun de ces jeux de données, mais également les
        traitements conçus pour leur production. Dans une perspective <a href="https://www.ccsd.cnrs.fr/principes-fair/"
                                                                         target="_blank">FAIR</a>, chaque dépôt est fait
        sur un entrepôt ouvert
        et pérenne. Ce sont les données ainsi exposées qui sont directement valorisées sur l’application eNDP en
        s’appuyant sur les API (<i>Application Programming Interface</i>) disponibles.</p>
      <p>L’ouverture de ce corpus inédit, disponible pour les analyses computationnelles, participe au renouvellement de
        la connaissance sur l’administration de la cathédrale par les chanoines.</p>
      <br>
      <MetaWorkflowSchema/>
      <br>
      <br>
      <h2 class="subtitle">Les images</h2>

      <h3>L’inventaire</h3>

      <p>Le chantier de numérisation des images a été suivi par les Archives nationales.</p>

      <p>Toutes les images, ainsi qu’une description détaillée de la série LL, sont accessibles dans l’inventaire des
        Registres capitulaires médiévaux de Notre-Dame de Paris, disponible dans la Salle de lecture virtuelle des
        Archives nationales.</p>

      <p>
        <a href="https://www.siv.archives-nationales.culture.gouv.fr/siv/IR/FRAN_IR_059635" target="_blank">https://www.siv.archives-nationales.culture.gouv.fr/siv/IR/FRAN_IR_059635</a>
      </p>
      <h3>La collection des images</h3>

      <p>Le jeu complet des images est décrit et partagé sur Nakala, l’entrepôt de données scientifiques de la TGIR
        <a href="https://www.huma-num.fr/" target="_blank">Huma-Num</a> :
        <a href="https://www.nakala.fr/collection/10.34847/nkl.03cbi521" target="_blank">https://www.nakala.fr/collection/10.34847/nkl.03cbi521</a>
      </p>

      <p>L’<a href="https://api.nakala.fr/doc" target="_blank">API IIIF Image</a> disponible sur Nakala permet de
        republier chaque image. Ce dépôt
        est un dispositif essentiel de l’ouverture, selon les principes FAIR, des données produites dans le cadre du
        projet.</p>

      <br>
      <h2 class="subtitle">Le corpus textuel</h2>

      <p>L’acquisition automatique du texte a représenté un important chantier impliquant de nombreux partenaires. La
        méthode est connue : transcription manuelle d’une vérité de terrain alignée à l’image, adaptation d’un modèle de
        lecture, prédiction, postcorrections puis exports.</p>

      <p>Chaque étape de la chaîne est documentée et reproductible.</p>

      <h3>La vérité terrain</h3>

      <p>512 pages représentatives des 26 registres ont été transcrites manuellement. Pour ce travail collaboratif,
        l’équipe a utilisé l’instance <a href="https://www.pamir.fr/projets-soutenus/cremma/" target="_blank">CREMMA</a>
        de l’application
        <a href="https://gitlab.com/scripta/escriptorium" target="_blank">eScriptorium</a>, hébergée par <a
            href="https://inria.fr/fr" target="_blank">Inria</a> (Institut national de recherche en sciences et
        technologies du numérique).</p>

      <p>La langue (latin), l’écriture (cursive) ainsi que les conventions de transcription sont documentées de manière
        à favoriser les réutilisations. La mise en page de 364 pages est également disponible et peut resservir à
        entraîner des modèles d’analyse de mise en page (<i>layout analysis</i>) et de segmentation.</p>

      <p>Le corpus, distribué sous licence CC-BY, est disponible sur Zenodo :
        <a href="https://zenodo.org/records/7575693" target="_blank">https://zenodo.org/records/7575693</a></p>

      <h3>Les modèles HTR</h3>

      <p>Différents modèles HTR ont été produits et testés selon une <a href="https://github.com/chartes/e-NDP_HTR"
                                                                        target="_blank">méthodologie
        documentée</a>. Chaque modèle produit a fait l’objet d’un <a
          href="https://github.com/chartes/e-NDP_HTR/releases" target="_blank">versionnage</a> (<i>release</i>) sur
        GitHub.</p>

      <p>Deux modèles finalisés ont été publiés. Ils sont disponibles via l’API <a href="https://kraken.re/main/index.html" target="_blank">Kraken</a> et sont partagés sur Zenodo sous
        licence CC-&nbsp;BY :</p>

      <ul>
        <li class="has-text-left">2023 : <a href="https://zenodo.org/records/7401833" target="_blank">https://zenodo.org/records/7401833</a>
        </li>
        <li class="has-text-left">2024 : <a href="https://zenodo.org/records/10800223" target="_blank">https://zenodo.org/records/10800223</a>
          (TRIDIS)
        </li>
      </ul>

      <div class="citation-block">
        <p>Sergio Torres Aguilar; Vincent Jolivet, La reconnaissance de l'écriture pour les manuscrits
          documentaires du Moyen Âge, jdmdh:10484 - <i>Journal of Data Mining & Digital Humanities</i>, 22 décembre
          2023,
          Documents historiques et reconnaissance automatique de texte -
          <a href="https://doi.org/10.46298/jdmdh.10484" target="_blank">https://doi.org/10.46298/jdmdh.10484</a>.</p>
      </div>
      <h3>La prédiction</h3>

      <p>La prédiction du texte intégral de l’ensemble des registres est partagée, au format <a href="https://github.com/PRImA-Research-Lab/PAGE-XML" target="_blank">XML
        PAGE</a>&nbsp;: <a href="https://github.com/chartes/e-NDP_TAL/releases/download/v0.0.1/endp_pages_all_V7.zip" target="_blank">https://github.com/chartes/e-NDP_TAL/releases/download/v0.0.1/endp_pages_all_V7.zip</a></p>

      <br>
      <h2 class="subtitle">La recherche lemmatisée</h2>

      <p>La mise à disposition du corpus entend participer au renouvellement des connaissances sur l’administration de
        la cathédrale par les chanoines. Les chercheurs peuvent fouiller le corpus grâce au service de recherche
        lemmatisée NoSKetch Engine ouvert et hébergé par le
        <a href="https://lamop.pantheonsorbonne.fr/laboratoire-medievistique-occidentale-paris" target="_blank">Lamop</a> (CNRS - Laboratoire de médiévistique occidentale de Paris) :
        <a href="https://nosketch-engine.lamop.fr/#dashboard?corpname=endp" target="_blank">https://nosketch-engine.lamop.fr/#dashboard?corpname=endp</a></p>

      <p>Pour améliorer autant que possible la qualité des index, une chaîne de postcorrection et de traitement du
        corpus textuel issu de l’HTR a été conçue. Tous les scripts utilisés sont dispoonibles en ligne :
        <a href="https://github.com/chartes/e-ndp_TAL" target="_blank">https://github.com/chartes/e-ndp_TAL</a>.</p>

      <p>Les scripts d’export <a href="https://www.sketchengine.eu/my_keywords/vertical/" target="_blank"><i>vertical file</i> (NoSketch)</a> ainsi que le
        fichier vertical produit du <a href="https://github.com/chartes/e-NDP_TAL/archive/refs/tags/v0.0.1.zip" target="_blank">corpus intégral
        e-NDP</a> sont également partagés.</p>

      <br>
      <h2 class="subtitle">Les fac-similés IIIF</h2>

      <p>Les <a href="https://endp.chartes.psl.eu/facsimile/collection/top" target="_blank">fac-similés</a> sont la mise en relation des ressources
        exposées sur Nakala : collections des images, et de la couche texte (XML/ALTO) issue de l’HTR.</p>
      <p>Cette mise en relation prend la forme de <a href="https://iiif.io/api/presentation/3.0/#52-manifest" target="_blank">manifestes IIIF</a>
        disponibles en ligne, de manière à rendre possible les republications :
        <a href="https://iiif.chartes.psl.eu/endp/collection/top" target="_blank">https://iiif.chartes.psl.eu/endp/collection/top</a></p>

      <br>
      <h2 class="subtitle">La base des personnes</h2>

      <p>☞ <a href="https://endp.chartes.psl.eu/persons" target="_blank">https://endp.chartes.psl.eu/persons</a></p>

      <p>Les registres constituent une source incomparable sur la société du cloître : les très nombreuses mentions de
        personnes, chanoines mais pas uniquement, sont consignées progressivement dans une base de données qui permet de
        retracer leur parcours. Chaque mention d’un événement est autant que possible liée à son attestation dans le
        fac-similé.</p>

      <p>Ce travail collaboratif au long cours, initié par Darwin Smith est partagé. Toutes les informations sont accessibles par le biais d'une <a href="https://endp.chartes.psl.eu/endp-person/api/docs" target="_blank">API ouverte</a> documentée.</p>

      <br>
      <h2 class="subtitle">Autres ressources</h2>

      <p>Un <a href="https://endp.hypotheses.org/" target="_blank"><img src="@/assets/others/hypothese-logo.png" alt="logo blog Hypothèses" class="logo-hypothese"> blog Hypothèses</a> permet de suivre les actualités du projet.</p>

      <!--
      <h3>Un titre de niveau 2</h3>
      <p>Un paragraphe</p>

      <h4>Un titre de niveau 3</h4>
      <p>Un paragraphe</p>
      -->
    </div>
  </div>
</template>


<script>
import MetaWorkflowSchema from "@/components/MetaWorkflowSchema.vue";

export default {
  name: "RessourcesView",
  components: {
    MetaWorkflowSchema
  }
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
  margin: 50px 0 10px;
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
  /* padding-left: 50px;*/
}

ul li {
  margin-left: 20px;
  padding-left: 10px;
}

.citation-block {
  background-color: #e3e3e3;
  padding: 20px;
  margin: 20px 0;
  border-left: 5px solid var(--brown);
}

.citation-block p {
  font-style: italic;
  color: var(--dark-grey);
  font-family: var(--font-primary);
  font-size: 16px;
  text-align: justify;
}

.citation-block p a {
  color: var(--light-brown-alt);
  font-size: 16px;
}

.citation-block::before {
  content: "Référence";
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}

/* mettre le logo hypothèse inline dans le contenu */
.logo-hypothese {
  display: inline;
  width: 20px;
  height: 20px;
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