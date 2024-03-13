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
          Développée par la Mission projets numériques de l'École nationale des chartes en collaboration
          avec le Laboratoire de médiévistique occidentale de Paris (UMR 8589/ CNRS-Paris 1), les Archives nationales,
          la BnF et la bibliothèque Mazarine.
        </div>
        <ul class="footer-links">
          <li>
            <a href="#">Mentions Légales</a> <!-- /termsofservice -->
          </li>
          <li>
            <a href="#">Licence CC-BY-SA 4.0</a>
          </li>
        </ul>
      </div>
      <div class="column">
        <div class="logos-container is-flex is-centered">
          <a href="https://www.chartes.psl.eu/fr" target="_blank"><img src="@/assets/partners_logo/enc.png"
                                                                       alt="Logo École nationale des chartes"
                                                                       class="logo logo-enc"/></a>

          <a href="https://www.pantheonsorbonne.fr/" target="_blank"><img src="@/assets/partners_logo/paris1.png"
                                                                          alt="Logo Paris 1 Panthéon-Sorbonne"
                                                                          class="logo logo-paris1"/></a>

          <a href="https://www.cnrs.fr/fr" target="_blank"><img src="@/assets/partners_logo/cnrs.svg.png" alt="Logo CNRS"
                                                                class="logo logo-cnrs"/></a>

          <a href="https://lamop.pantheonsorbonne.fr/laboratoire-medievistique-occidentale-paris" target="_blank"><img
              src="@/assets/partners_logo/lamop.png" alt="Logo Lamop" class="logo"/></a>

          <a href="" target="_blank"><img
              src="@/assets/partners_logo/pariscite.png" alt="Logo Paris Cité" class="logo logo-pariscite"/></a>

          <a href="https://www.archives-nationales.culture.gouv.fr/" target="_blank"><img
              src="@/assets/partners_logo/an.png" alt="Logo Archives nationales" class="logo logo-an"/></a>

          <a href="https://www.bibliotheque-mazarine.fr/fr/" target="_blank"><img src="@/assets/partners_logo/mazarine.png"
                                                                                  alt="Logo Bibliothèque Mazarine"
                                                                                  class="logo"/></a>

          <a href="https://www.bnf.fr/fr" target="_blank"><img src="@/assets/partners_logo/bnf.png" alt="Logo BnF"
                                                               class="logo"/></a>

          <a href="https://anr.fr/Projet-ANR-20-CE27-0012" target="_blank"><img src="@/assets/partners_logo/ANR.jpg"
                                                                                alt="Logo ANR" class="logo logo-anr"/></a>
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
  align-items: flex-start;
  justify-content: center;
  border-top: solid 6px var(--brown);
}

footer,
footer .columns {
  margin: 0;
  padding: 0;
}

footer .columns .column {
  padding: 55px 40px 8px;
  background-color: #4C4949;
}

footer .columns .column:first-child {
  max-width: 485px;
  background-color: #302C2C;
}

footer .columns .column:nth-child(2) {
  max-width: 515px;
  padding-left: 30px;
}

footer .columns .column:last-child {
  padding-left: 0;
  padding-top: 40px;
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
}

.footer-links{
  display: flex;
}

.footer-links li,
.footer-links li a {
  font-size: 16px;
  line-height: 1;
}

.footer-links li:not(:last-child):after {
  content: "";
  display: inline-block;
  width: 1px;
  height: 80%;
  border-right: solid #ffffff 1px;
  margin: 0 10px;
  transform: translateY(2px);
}

.footer-links li a {
  font-family: var(--font-secondary);
  font-weight: 400;
  color: #FFFFFF;
  text-transform: uppercase;
}



.logos-container {
  align-items: center;
  gap: 40px;
  display: flex;
  flex-wrap: wrap;
}

.logo {
  width: 8rem;
  height: auto;
}

.logo-enc {
  width: 15rem;
}

.logo-an {
  width: 13rem;
}

.logo-anr {
  width: 9rem;
}

.logo-cnrs {
  width: 4rem;
}

.logo-pariscite {
  width: 13rem;
}

</style>