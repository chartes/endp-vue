<template>
  <!-- banner -->
  <div id="banner-image" class="container is-fluid">
  </div>
  <div class="columns">
    <div class="column">
      <h1 class="title">
        e-NDP<br/>
        Notre-Dame de Paris et son cloître : <br>
        <span class="subtitle">les lieux, les gens, la vie</span>
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
      <p class="block lettrine">Le projet e-NDP est consacré à la publication numérique et à l'exploitation des 27
        premiers registres du chapitre de l'Église de Paris, rédigés par ses notaires entre 1326 et 1504. Ces registres
        contiennent les décisions prises collectivement par les chanoines pour l’administration du culte, des biens, des
        droits, des personnes et collectivités dont le doyen et le chapitre de l'Église de Paris sont seigneurs,
        employeurs ou propriétaires.</p>
      <p class="block lettrine">Ces propriétés et biens concernent le territoire du cloître, ses bâtiments et ses
        églises ― Notre-Dame et ses tours, Saint-Denis-du-Pas, Saint-Jean-le-Rond, Saint-Aignan ―, le parvis et
        l'Hôtel-Dieu, les très nombreuses maisons, terres, bois, vignes, étangs et autres possessions hors du cloître,
        hors de la Cité et hors de Paris. Le menu
        <router-link to="/registres">registres</router-link>
        donne accès aux 14605 pages numérisées des registres et à une transcription obtenue par processus de
        reconnaissance de l'écriture manuscrite (« HTR » Handwritten Text Recognition). L’exploitation du contenu des
        registres et de la transcription par « HTR » vise à la connaissance du cloître, de sa topographie et de son bâti,
        de sa population, de son économie et de sa vie, des usages que l’on y fait du livre et de l’écrit.
      </p>
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
  background: url("@/assets/banners/banner-ndp-map_home_page.jpg") center / cover;
}

h1.title {
  padding: 60px 0 8px;
  margin-bottom: 15px;
  font-size: 36px;
  font-weight: 700;
  line-height: 40px;
  color: var(--dark-grey);
  border-bottom: solid 1px #979797;
}

h1.title .subtitle {
  display: block;
  margin: 15px 0 50px;
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
  gap: 50px;
  transform: translateY(-135px);
}

.columns > .column:first-child {
  max-width: 430px;
  transform: translateY(135px);
}

nav li {
  text-align: right;
}

nav a {
  display: inline-block;
  font-size: 20px;
  font-weight: 400;
  font-style: italic;
  color: #343434;
}

nav a .icon {
  display: none;
}

.container {
  padding: 70px 85px;
  background: linear-gradient(#F7F7F7CC 0% ,#F7F7F7 11.94090256424186% ,#F7F7F7 100% ,#FCFCFC 100%);
}

.container > *:last-child {
  padding-bottom: 100px;
  border-bottom: solid 1px #979797;
}

.block {
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  color: var(--dark-grey);

  -webkit-hyphens: none;
}

.lettrine::first-letter {
  font-size: 60px;
  color: var(--light-brown);
  vertical-align: top;
  font-weight: 700;

  margin-top: 10px;
  padding-right: 0.2em;
  float: left;
}

</style>
