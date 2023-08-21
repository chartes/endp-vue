<template>
  <!--<div v-html="toc"/>-->
  <hr>
  <div class="columns">
    <!--<div class="column is-3">
      <div class="toc-area app-width-margin">
        <div class="toc-area-header">
          <a href="#" v-on:click="toggleTOCContent">SOMMAIRE</a>
          <a href="#" class="toggle-btn" v-on:click="toggleTOCContent"></a>
        </div>
      </div>
      <div id="toc-area" v-if="isTocOpen" class="toc-area-content toc-content"/>
    </div>-->
    <div class="column">
      <div class="content has-text-justified has-text-left" v-html="document"/>
    </div>
    <div class="document-area is-flex app-width-margin">
      <div id="toc-area-aside" class="toc-area-aside toc-content" />
     <!-- <div class="document-views is-flex">
        <div class="text-view" id="text-view">
          <div :id="$route.params.docId" :key="$route.params.docId" />
        </div>
      </div>-->
    </div>
    <!--<div id="mirador" class="column"></div>-->
  </div>
</template>
<script>
import axios from "axios";
//import Mirador from 'mirador/dist/es/src/index';
export default {
  name: "RegistreDocument",
  data() {
    return {
      document: null,
      toc: null,
      isTocOpen: true,
    }
  },

  methods: {
    toggleTOCContent() {
      this.isTocOpen = !this.isTocOpen;
    },
  },
  async created() {
    let docId = this.$route.params.id;
    let tmpDom = document.createElement('div');
    // fetch html template
    await axios.get(
        `http://localhost:8080/api/dts/document?id=endp_${docId}&format=html`
    ).then((res) => {
      // push html template in canvas
      //this.document = res.data;
      tmpDom.innerHTML = res.data;
      const toc = tmpDom.querySelector('#aside');
      //const tocAreadDest = document.querySelector('#toc-area');
      //if (tocAreadDest.firstChild) {
      //  tocAreadDest.removeChild(tocAreadDest.firstChild);
      //}
      //tocAreadDest.appendChild(toc);
       let frameNum = 13;
      tmpDom.querySelectorAll("a.pb.facs").forEach((a) => {
        const container = document.createElement("div");
        let url = a.href;
        let urlPart = url.replace(/\/full\/.*$/, '');
        let urlSecond = `${urlPart}/full/full/0/default.jpg`;
        container.innerHTML = `<aside class="media pb-component"><article class="pb"><div class="pb-label"><a href="${urlSecond}" target="_blank"></a></div><div><a href="${urlSecond}" target="_blank"><img class="pb-thumnbail" src="${url}" /></a></div></article></aside>`;
        frameNum = frameNum + 1;
        // replace the link with a PageBreak component
        a.parentNode.replaceChild(container.firstChild, a);
      });
      const tocAsideDest = document.querySelector("#toc-area-aside");
      if (tocAsideDest.firstChild) tocAsideDest.removeChild(tocAsideDest.firstChild);
      tocAsideDest.appendChild(toc.cloneNode(true));
      this.toc = toc.innerHTML;
      let documentElement = tmpDom.querySelector('#index');
      documentElement.classList.add('container');
      documentElement.querySelectorAll('.div.chapitre.level2').forEach((div) => {
        div.classList.remove('div', 'chapitre', 'level2');
        div.classList.add('column', 'block');
      });
      this.document = documentElement.innerHTML;
      //console.log(this.document);
      this.toc = tmpDom.querySelector('ol.tree').innerHTML;
    }).catch((err) => {
      console.log(err);
    });
  }
}
</script>
<style src="../assets/css/html.css" id="document-html-css">
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
<style src="../assets/css/postprod.css"></style>
