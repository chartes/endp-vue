<template>
  <footer class="footer is-flex-align-items-flex-end mt-auto">
    <div class="columns">
      <div class="column">
        <h1 class="footer-title">
          <span class="e-endp-logo">e</span><span class="endp-logo">NDP</span>
          <br/>
          Notre-Dame de Paris
          <br>
          et son cloître
          <br>
          <span class="subtitle">les lieux, les gens, la vie (1326-1504)</span>
        </h1>
      </div>
      <div class="column">
        <div class="footer-description">
          Développée par la Mission projets numériques de l'École nationale des chartes dans le cadre du projet ANR e-NDP,
          mené par le laboratoire ICT-Les Europes dans le monde (UR 337 / université Paris Cité), le Laboratoire de
          médiévistique occidentale de Paris (UMR 8589 / CNRS-Paris 1), le centre Jean-Mabillon (École nationale des chartes - PSL),
          les Archives nationales, la Bibliothèque nationale de France et la bibliothèque Mazarine.
        </div>
        <ul class="footer-links">
          <li>
            <a href="https://www.chartes.psl.eu/contact" target="_blank">Contact</a>
          </li>
          <li>
            <router-link to="/credits">Crédits</router-link>
          </li>
          <li>
            <router-link to="/termsofservice">Mentions légales</router-link>
          </li>
          <li>
            <a href="https://www.huma-num.fr/" target="_blank">Huma-Num</a> <!-- /termsofservice -->
          </li>
          <!--<li>
            <a href="https://creativecommons.org/licenses/by/4.0/legalcode.fr" target="_blank">Licence CC-BY 4.0</a>
          </li>-->
        </ul>
      </div>
      <div class="column">
        <div class="logos-container is-flex">

          <a href="https://www.chartes.psl.eu/fr/rubrique-centre-jean-mabillon/centre-jean-mabillon" target="_blank">
            <img src="@/assets/partners_logo/Logo-CMJ.png" alt="Logo Centre Jean Mabillon" class="logo logo-cmj"/>
          </a>

          <a href="https://www.chartes.psl.eu/fr" target="_blank">
            <img src="@/assets/partners_logo/Logo_ENC_PSL.svg" alt="Logo École nationale des chartes" class="logo logo-enc"/>
          </a>

          <a href="https://anr.fr/Projet-ANR-20-CE27-0012" target="_blank">
            <img src="@/assets/partners_logo/logo_ANR.svg" alt="Logo ANR" class="logo logo-anr"/>
          </a>

          <a href="https://lamop.pantheonsorbonne.fr/laboratoire-medievistique-occidentale-paris" target="_blank">
            <img src="@/assets/partners_logo/logo_LAMOP_gris.svg" alt="Logo Laboratoire médievistique occidentale" class="logo logo-lamop" />
          </a>

          <a href="https://www.pantheonsorbonne.fr/" target="_blank">
            <img src="@/assets/partners_logo/logo_Paris_Sorbonne.svg" alt="Logo Paris 1 Panthéon-Sorbonne" class="logo logo-paris1"/>
          </a>

          <a href="https://www.cnrs.fr/fr" target="_blank">
            <img src="@/assets/partners_logo/logo_CNRS.svg" alt="Logo CNRS" class="logo logo-cnrs"/>
          </a>

          <a href="https://u-paris.fr/" target="_blank">
            <img src="@/assets/partners_logo/logo_Paris_Cite.svg" alt="Logo Paris Cité" class="logo logo-pariscite"/>
          </a>

          <a href="https://www.archives-nationales.culture.gouv.fr/" target="_blank">
            <img src="@/assets/partners_logo/logo_Archives_Nationales.svg" alt="Logo École nationale des chartes" class="logo logo-an"/>
          </a>

          <a href="https://www.bnf.fr/fr" target="_blank">
            <img src="@/assets/partners_logo/logo_BNF.svg" alt="Logo École nationale des chartes" class="logo logo-bnf"/>
          </a>

          <a href="https://www.bibliotheque-mazarine.fr/fr/" target="_blank">
            <img src="@/assets/partners_logo/Logo_mazarine_sansfond 6B6B6B.svg" alt="Logo Bibliothèque Mazarine" class="logo logo-mazarine"/>
          </a>

        </div>
      </div>
    </div>

  </footer>
</template>

<script>
export default {
  name: "AppFooter"
}
</script>

<style scoped>

footer {
  width: 100%;
  background-color: #4C4949;
  border-top: solid 6px var(--brown);
}

footer,
footer .columns {
  margin: 0;
  padding: 0;
}

footer .columns {
  max-width: 1920px;
  margin: 0 auto;
}

footer .columns .column {
  padding: 55px 40px 30px;
  background-color: #4C4949;
}

footer .columns .column:first-child {
  max-width: 490px;
  padding-left: 47px;
  background-color: #302C2C;
}

footer .columns .column:nth-child(2) {
  max-width: 575px;
  padding-left: 35px;
}

footer .columns .column:last-child {
  padding-left: 0;
  padding-top: 45px;
}


.footer-title {
  margin-bottom: 15px;

  font-family: var(--font-primary);
  font-size: 32px;
  font-weight: 400;
  line-height: 40px;
  color: #FFFFFF;
}

.footer-title .endp-logo,
.footer-title .e-endp-logo {
  display: inline-block;
  margin-bottom: 30px;
  font-size: 60px;
}

.footer-title .subtitle {
  display: block;
  margin: 15px 0 50px;
  font-size: 20px;
  font-weight: 400;
  font-style: italic;
  line-height: 30px;
  color: #FFFFFF;
}

.footer-description {
  margin-bottom: 40px;
  font-family: var(--font-secondary);
  font-size: 22px;
  font-weight: 400;
  line-height: 30px;
  color: #FFFFFF;
  text-align: justify;
}

.footer-links {
  display: inline-block;
}

.footer-links li {
  position: relative;
  display: inline;
}

.footer-links li,
.footer-links li a {
  font-size: 16px;
  line-height: 1;
}

.footer-links li:not(:last-child) {
  margin-right: 10px;
  padding-right: 10px;
}

.footer-links li:not(:last-child):after {
  content: "";
  position: relative;
  top: 0;
  right: -9px;
  display: inline;
  width: 1px;
  font-size: 80%;
  border-right: solid #ffffff 1px;
}

.footer-links li a {
  font-family: var(--font-secondary);
  font-weight: 400;
  color: #FFFFFF;
  text-transform: uppercase;
}

.footer-links li a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* TODO (@Denis) : ancienne version pour .logos-container

.logos-container {
  justify-content: flex-start;
  align-items: center;
  gap: 40px;
  display: flex;
  flex-wrap: wrap;

  --logo-scale: 0.75;
}*/

/* TODO (@Denis) : version proposée pour .logos-container à adapter ? */

.logos-container {
  justify-content: flex-start;
  align-items: center;
  gap: 40px; /* augmenté de 5px pour avoir un peu plus d'espace */
  display: flex;
  flex-wrap: wrap;

  padding-top: 10px; /* ajouté pour centrer les logos dans le footer */
  padding-bottom: 20px;

  margin-left: 5px; /* ajouté pour espacer un peu le block de logo du texte du footer */

  --logo-scale: 0.75; /* réduit de 0.05 pour avoir un peu plus d'espace et avoir seulement 2 lignes de logos en Desktop */
}

.logos-container a {
  transform-origin: 50% 50%;
  transition: transform ease-in-out 0.35s;
}

.logos-container a:hover {
  transform: scale(1.25);
}

.logo {
  width: 8rem;
  height: auto;
}

.logo-cmj {
  width: calc( 178px * var(--logo-scale));
}

.logo-enc {
  width: calc( 256px * var(--logo-scale));
}

.logo-anr {
  width: calc( 183px * var(--logo-scale));
}

.logo-lamop {
  width: calc( 145px * var(--logo-scale));
}

.logo-paris1 {
  width: calc( 74px * var(--logo-scale));
}

.logo-cnrs {
  width: calc( 82px * var(--logo-scale));
}

.logo-pariscite {
  width: calc( 177px * var(--logo-scale));
}

.logo-an {
  width: calc( 223px * var(--logo-scale));
}

.logo-bnf {
  width: calc( 160px * var(--logo-scale));
}

.logo-mazarine {
  width: calc( 110px * var(--logo-scale));
}



@media screen and (max-width: 1024px) {

  footer .columns {
    flex-direction: column;
  }

  footer .columns > .column {
    width: 100%;
    max-width: unset !important;
  }

  footer .columns .column {
    padding: 55px 20px 8px;
  }

  footer .columns .column {
    padding-left: 20px !important;
  }

  footer .columns .column:last-child {
    padding: 55px 20px;
  }

  .logos-container {
    flex-direction: column;
  }

}


</style>