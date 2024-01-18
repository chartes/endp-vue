<template>
  <!-- banner (TODO: convert to component) -->
  <div id="banner-image" class="container is-fluid">
    <h1 class="title">e-NDP Notre-Dame de Paris et son cloître : <br> les lieux, les gens, la vie (1326-1504)</h1>
  </div>
  <!-- end banner -->
  <div class="container is-fluid">
    <p class="block bleft lettrine">Le projet e-NDP est consacré à la publication numérique et à l'exploitation des 27
      premiers registres du chapitre de l'Église de Paris, rédigés par ses notaires entre 1326 et 1504. Ces registres
      contiennent les décisions prises collectivement par les chanoines pour l’administration du culte, des biens, des
      droits, des personnes et collectivités dont le doyen et le chapitre de l'Église de Paris sont seigneurs,
      employeurs ou propriétaires.</p>
    <p class="block bright lettrine">Ces propriétés et biens concernent le territoire du cloître, ses bâtiments et ses
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
</template>

<script>
export default {
  name: 'HomeView',
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');

#banner-image {
  position: relative; /* Pour le positionnement absolu du titre */
  height: 400px; /* Ajustez selon vos besoins */
  width: 100%;
  max-width: 100%;
  display: flex;
  animation: fadeImageIn 1s ease-out 0s;
  margin-bottom: 50px;
}


#banner-image::before {
  border-radius: 0px 0px 0px 10px;
  content: "";
  background-image: url("@/assets/home-ndp-map-banner.jpg");
  background-size: cover;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 0.5;
}

.title {
  font-family: MedievalSharp, sans-serif;
  font-size: 3rem;
  position: relative;
  align-items: flex-start;
  text-align: left;
  color: #031531;
  animation: fadeTitleIn 2s ease-out 0s;
}

.block {
  text-align: justify;
  width: 80%;
  text-indent: 0;
  -webkit-hyphens: none;
  animation: fadeTextIn 2s ease-out 0s;
}


.lettrine::first-letter {
  font-family: MedievalSharp, Times New Roman, Times, serif;
  font-size: 3.5em;
  margin-top: 20px;
  padding-right: 0.2em;
  float: left;
  color: #031531;
}

.institution__brand__logos__container {
  margin-top: 50px;
}

.image__partner {
  width: 400px;
  height: auto;
}

@media (max-width: 768px) {
  .image__partner {
    width: 100%; /* Taille maximale de l'écran */
  }
}

@keyframes fadeTitleIn {
  0% {
    opacity: 0;
    transform: translateY(100px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeImageIn {
  0% {
    opacity: 0;
    transform: translateX(100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeTextIn {
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

</style>
<style>
header {
  clear: both;
  padding: 1ex;
  border: dashed #ccc 1px;
  -webkit-border-radius: 1ex;
  -moz-border-radius: 1ex;
  border-radius: 1ex;
}

.toc-area {
  width: 100%;
  font-family: "Barlow", sans-serif !important;
  margin-bottom: 30px !important;
}

.pb-component {
  position:relative !important;
  float: left !important;
}

.toc-area-header {
  display: flex;
  width: 100%;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 6px;
  position: relative;
}

.toc-area-header > a {
  text-decoration: none;
  border: none;
}

.toc-area-content {
  background-color: #e4e4e4;
  border-radius: 0 0 6px 6px;
  display: none;
}

.toc-area.is-opened .toc-area-header {
  background-color: #f1f1f1;
  border-radius: 6px 6px 0 0;
}

.toc-area.is-opened .toc-area-content {
  display: block;
}

.toc-area .toc-area-content aside {
  width: 100% !important;
  padding: 20px 50px !important;
}

.toc-area .toc-area-content nav > ol.tree {
  columns: 4;
  gap: 40px;
}

.toc-content > aside > nav > nav > ol.tree > li {
  text-transform: uppercase;
  margin-bottom: 20px;
  padding: 0;
}

.toc-content > aside > nav > nav > ol.tree > li.more > a {
  display: inline-block;
  margin-bottom: 8px;
}

.toc-content > aside > nav > nav > ol.tree > li li {
  padding: 0;
  margin: 0 0 6px;
  text-transform: none;
}

.toc-content > aside > nav > nav > ol.tree > li ol {
  margin: 0;
}

.toc-content nav > ol.tree > li {
  break-inside: avoid;
}

.toc-content nav > ol.tree li::before {
  display: none;
}

.toc-content nav > .tree ol,
.tree ul {
  border: none !important;
}


.toc-content a:hover {
  background-color: transparent !important;
  border-radius: unset !important;
  color: #000;
  text-decoration: underline dotted !important;
}

.toc-area-aside a,
.toc-area-content a {
  font-family: "Barlow Semi Condensed", sans-serif !important;
  font-weight: 400;
  text-align: left;
  line-height: 20px;
  letter-spacing: 0;
  border: none;
  box-shadow: none;
}

.toc-area-content a {
  font-size: 17px;
  color: #252525;
}

.toc-area-aside a {
  font-size: 16px;
  color: #000;
}

/* toogle */
.toggle-btn {
  position: absolute;
  right: 20px;
  width: 27px;
  height: 27px;
  border: none;
  text-decoration: none;
}

.toc-area.is-opened .toggle-btn {
}

.controls {
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: #b9192f 1px dashed;
  border-bottom: #b8b8b8 1px solid;
  padding: 12px 0 9px;
}

.controls a {
  display: inline;
  font-family: "Barlow", sans-serif;
  font-size: 15px;
  font-weight: 500;
  text-transform: uppercase;
  color: #4a4a4a;
  margin: 0;
}

.controls > a.toc-menu-toggle {
  font-size: 14px;
  color: #aeaeae;
  padding: 6px 10px;
  border: #aeaeae 1px solid;
  border-radius: 4px;
}

.controls > a.toc-menu-toggle.is-opened {
  color: #b9192f;
  border-color: #b9192f;
}

.controls ul {
  align-items: center;
}

.controls ul > li {
  margin: 0;
}

.controls ul > li > a {
  display: inline-block;
  width: 42px;
  height: 42px;
  margin-right: 10px;
}

.controls ul > li > a.access_link {
  vertical-align: center;
  display: inline;
  margin-left: 15px;
}

.controls a.text-btn {
}

.text-mode .controls a.text-btn {
}

.controls a.text-images-btn {
  width: 80px;
  margin: 0 25px 0 15px;
}

.text-and-images-mode .controls a.text-images-btn {
}

.controls a.images-btn {
}

.images-mode .controls a.images-btn {
}

.text-mode-only .controls a.text-btn {
  pointer-events: none;
}

.text-mode-only .controls a.text-images-btn,
.text-mode-only .controls a.images-btn {
  pointer-events: none;
  opacity: 0.2;
}

.controls a.pdf-btn {
}

.controls a.xml-btn {
}

.document-area {
  width: 100%;
}

.document-area #aside,
.toc-area #aside {
  position: unset;
  float: none;
  margin: 0;
  background: none;
  border: none;
}

.document-area #aside header,
.toc-area #aside header {
  display: none;
}

.document-views {
  width: 100%;
}

.toc-area-aside {
  display: none;
}

.toc-aside-is-opened .toc-area-aside {
  display: flex;
  width: 220px;
}

.toc-aside-is-opened .document-views {
  flex: calc(100% - 220px);
}

.mirador-view {
  position: relative;
  min-height: 80vh;
  max-height: 100vh;
}

.text-mode .text-view,
.images-mode .mirador-view {
  flex: 100% 0 0;
  width: 100%;
}

.images-mode .text-view,
.text-mode .mirador-view {
  display: none;
}

.text-mode .mirador-view {
  flex: 100% 0 0;
}

.text-and-images-mode .text-view,
.text-and-images-mode .mirador-view {
  flex: 50% 0 0;
}

#center {
  width: 100%;
  margin: 0 !important;
}

#article {
  padding: 40px 10% 120px;
  border-bottom: 1px dotted #ffffff;
  min-height: 100%;
}

#article article {
  margin: 0;
}

#article h1.head.textpart,
#article .titlepage {
  font-family: "Barlow", sans-serif !important;
}

#article h1.head.textpart {
  padding: 0;
  font-size: 25px;
  font-weight: 500;
  line-height: 33px;
  text-transform: none;
  color: #971716;
}

#article .titlepage {
  font-size: 18px;
  line-height: 25px;
}

#article .titlepage hr {
  width: 100%;
  margin: 60px 0 45px;
  border: dashed #b9192f 1px;
}

#article .titlepage,
#article .titlepage .forename {
  font-variant: small-caps;
  text-transform: none;
}

#article .titlepage .surname {
  text-transform: uppercase;
}

#article .titlepage .forename,
#article .titlepage .surname {
  font-size: 20px;
  font-weight: 500;
}

#article .titlepage .name {
  margin-bottom: 30px;
}

#article .titlepage .roleName {
  font-size: 16px;
  line-height: 22px;
  text-transform: uppercase;
  font-style: italic;
  color: #777;
}

#article section.div {
  border: none;
  padding-bottom: 0;
  padding-top: 40px;
  font-family: "Libre Baskerville", serif !important;
  font-size: 16px;
  text-align: left;
  font-weight: 400;
  line-height: 28px;
  color: #5f5f5f;
}

#article section.div h2.head {
  line-height: 115%;
  color: #971716;
  border-bottom: none;
  padding: 1em 0 0 0;
  margin: 35px 0 43px 0px;
  text-align: center;
  font-variant: small-caps;
}

#article section.div h3.head {
  color: #222222;
  margin: 35px 0 28px 0;
  border-bottom: 0px dotted;
  text-align: center;
  padding: 1em 0 0 1ex;
  font-weight: bold;
  text-transform: none;
}

#article section.div h4.head {
  text-align: center;
  color: #999;
  font-size: 15px;
  font-weight: bold;
  padding: 1em 0 1ex 2ex;
}

.toc-area-header a {
  color: inherit;
}

@media screen and (max-width: 1150px) {
  .toc-area .toc-area-content nav > ol.tree {
    columns: 2;
  }

  .controls > a.toc-menu-toggle {
    margin-left: 20px;
  }

  .controls ul > li > a.access_link {
    margin-right: 20px;
  }
}

@media screen and (max-width: 800px) {
  #article {
    padding: 40px 4% 120px;
  }

  .toc-area .toc-area-content aside {
    padding: 20px 20px !important;
  }
}

@media screen and (max-width: 640px) {
  .pb,
  .controls > a.toc-menu-toggle,
  .toc-area-aside {
    display: none !important;
  }

  .toc-area .toc-area-content nav > ol.tree {
    columns: 1;
  }

  .toggle-btn {
    width: 20px;
    right: 15px;
  }

  .controls {
    flex-wrap: wrap;
  }

  .controls ul:first-of-type {
    order: 3;
    flex: 100% 0 0;
    width: 100%;
    justify-content: center;
    padding: 20px 0 10px;
  }

  .controls ul:last-of-type {
    flex: 100% 0 0;
    justify-content: center;
  }

  .controls ul:last-of-type > li > a {
    width: 30px;
    height: 30px;
  }

  .controls > ul:first-of-type > li:nth-child(2) {
    display: none;
  }

  #article section.div {
    font-size: 14px;
    line-height: 24px;
    display: block !important;
  margin-bottom: 1em !important;
  }

  #article h1.head.textpart {
    font-size: 20px;
    line-height: 25px;
  }

  #article section.div h2.head,
  #article section.div h3.head {
    font-size: 14px;
    line-height: 24px;
  }

  #article section.div {
    padding-top: 10px;
  }

  #article p.p {
    text-align: left;
    display: block !important;
  margin-bottom: 1em !important;
  }

  .text-and-images-mode .document-views {
    display: block !important;
  }

  .text-and-images-mode .text-view,
  .text-and-images-mode .mirador-view {
  }
}
</style>
<style>
.deliberation {
  display: block !important;
  margin-bottom: 1em !important;
}
</style>

