<template>
  <!-- banner -->
  <div id="banner-image" class="container is-fluid"></div>

  <div class="columns">
    <div class="column">
      <h1 class="title">
        e-NDP<br/>
        Notre-Dame de Paris et son cloître<br>
        <span class="subtitle">Les lieux, les gens, la vie</span>
        <span class="period">1326-1504</span>
      </h1>
      <nav>
        <ul>
          <li>
            <router-link class="nav-link active" to="/registres">
              <span class="icon"><i class="fa fa-book"></i></span>
              Accès aux registres
            </router-link>
          </li>
          <li>
            <router-link class="nav-link active" to="/persons">
              <span class="icon"><i class="fa fa-user"></i></span>
              Accès aux personnes
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
    <div class="column container is-fluid">
      <p class="block lettrine">Le projet e-NDP propose de renouveler la connaissance de Notre-Dame de Paris par
        l'édition
        collaborative numérique des registres du chapitre cathédral. 26 registres, établis entre 1326 et 1504,
        donnent accès à toutes les décisions prises par les chanoines sur l'administration de la cathédrale, sur la
        gestion de leurs droits et de leur patrimoine, et sur la société du cloître.</p>
      <p class="block lettrine">Ces registres sont désormais accessibles grâce à la numérisation de leurs 14605 pages
      et à l'utilisation de la reconnaissance automatique de l'écriture manuscrite (HTR), qui permet d'en fournir une
      transcription. Celle-ci permet d'exhumer une source majeure pour l'histoire et la vie des hommes, des femmes et
      des enfants qui ont composé la société active à l'ombre de la cathédrale Notre-Dame et ont fait de cette dernière
      un modèle pour l'architecture, la liturgie, les arts et la vie intellectuelle et scientifique.</p>
    </div>
  </div>
  <!-- end banner -->
</template>

<script>
export default {
  name: 'HomeView',
}
</script>
<style src="@/assets/css/endp_utils.css"></style>
<style scoped>

#banner-image {
  height: 330px;
}

/* Set image banner */
#banner-image::before {
  background-size: 1920px auto;
  background-image: url("@/assets/banners/bandeau_home.jpg");
}

h1.title {
  padding: 70px 0 8px 20px;
  margin-bottom: 15px;
  font-size: 36px;
  font-weight: 700;
  line-height: 40px;
  color: var(--dark-grey);
  border-bottom: solid 1px #979797;
}

h1.title .subtitle {
  display: block;
  margin: 20px 0 64px;
  font-size: 36px;
  font-weight: 400;
  font-style: italic;
  line-height: 30px;
  color: var(--light-brown);
  vertical-align: top;
}

h1.title .period {
  display: block;
  font-size: 28px;
  font-weight: 400;
  font-style: italic;
  line-height: 30px;
  color: #303030;
}

.columns {
  gap: var(--column-gap-desktop);
  transform: translateY(-135px);
  margin-bottom: -135px;
}

.column {
  padding: 0;
}

.columns > .column:first-child {
  max-width: 460px;
  transform: translateY(135px);
}

.columns > .container.column:last-child {
  padding-bottom: 875px;
}

nav li {
  text-align: right;
  margin-bottom: 3px;
}

nav a {
  display: inline-block;
  font-size: 20px;
  font-weight: 400;
  font-style: italic;
  color: #343434;
}

nav a:hover {
  color: var(--link-over-color);
}


nav a .icon {
  display: none;
}

.container {
  padding: 70px 95px;
  background: linear-gradient(#F7F7F7CC 0%, #F7F7F7 11.94090256424186%, #F7F7F7 100%, #FCFCFC 100%);
  /* justify text */
  text-align: justify;
}

.container > *:last-child {
  padding-bottom: 100px;
  border-bottom: solid 1px #979797;
}

.block {
  font-size: 20px;
  font-weight: 400;
  line-height: 27px;
  color: var(--dark-grey);
  -webkit-hyphens: none;
}

.block a {
  color: var(--brown);
}

.block a:hover {
  color: var(--light-brown);
}

.lettrine::first-letter {
  font-size: 60px;
  color: var(--light-brown);
  vertical-align: top;
  font-weight: 700;

  margin-left: -7px;
  margin-top: 18px;
  padding-right: 0.2em;
  float: left;
}


@media screen and (max-width: 1024px) {

  .columns {
    flex-direction: column;
    gap: 0;
  }

  .columns > .column {
    width: 100%;
    max-width: unset !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  .columns > .column:first-child {
    background: linear-gradient(#F7F7F7CC 0%, #F7F7F7 11.94090256424186%, #F7F7F7 100%, #FCFCFC 100%);
    transform: none;
  }

  .columns > .container.column:last-child {
    padding-bottom: 500px;
  }

  nav {
    padding: 30px 20px 20px;
  }

  nav ul {
    margin: 0 auto;
    border-top: solid 1px #D7D7D7;
    border-bottom: solid 1px #D7D7D7;
  }

  nav li {
    text-align: center;
  }

  nav li > a {
    padding: 10px 0;
  }

  h1.title {
    border: none;
    margin-bottom: 0;
    padding: 15px 0 8px;
  }

  h1.title .subtitle {
    font-size: 28px;
    margin: 15px 0 10px;
  }

  h1.title .period {
    font-size: 20px;
  }

  .container {
    padding-top: 10px;
  }

  .container > :last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  .block {
    font-size: 18px;
  }

}
</style>
