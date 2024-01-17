<template>
  <div class="container">
    <br>
    <br>
    <div class="header">
      <p class="title" v-if="state">{{ capitalizeFirstLetter(state) }}</p>
      <p v-if="endpVolume !== 'collection'">Citation url du fac simile courant : <a :href="citationUrl">{{ citationUrl }}</a></p>
      <p v-if="endpVolume !== 'collection'"><a target="_blank" :href="imageNakalaSrc">{{ imageNakalaSrc }}</a></p>
      <br>
      <p style="color: red" v-if="endpVolume !== 'collection'">Le taux de reconnaissance du texte estimé pour ce fac-simile est de X%.
(Le texte affiché peut comporter un certain nombre d'erreurs. En effet, la couche texte de ce facsimile a été généré automatiquement par un programme de reconnaissance des écritures manuscrites (HTR).)</p>
      <button @click="toggleNav">Toggle Nav</button>
    </div>
    <div class="columns">
      <div class='column' v-if="isNavOpen">
        <fac-simile-navigation @update-mirador="handleMiradorUpdate"></fac-simile-navigation>
      </div>
      <div class='column' :class="{ 'is-full': !isNavOpen, 'is-8': isNavOpen }">
        <div id='mirador'></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Mirador from 'mirador/dist/es/src/index';
import FacSimileNavigation from "@/components/FacSimileNavigation.vue";
import textOverlayPlugin from 'mirador-textoverlay/es';
import endpManifestMapping from '../data/endp_manifest_mapping.json';
import mapSha1Dates from '../data/mapping_image_sha1_dates.json';
import capitalizeFirstLetter from "@/utils/_string_formater";

export default {
  name: 'FacSimileView',
  components: {FacSimileNavigation},
  data() {
    return {
      endpManifestMapping,
      citationUrl: window.location,
      viewer: null,
      windowID: null,
      imageNakalaSrc: "",
      state: "",
      isNavOpen: true,
      endpVolumeManifest: function () {
        if (this.endpVolume === "collection" && this.canvasId === "top") {
          return `https://iiif.chartes.psl.eu/endp/collection/top`
        } else {
          return `https://iiif.chartes.psl.eu/endp/${this.endpVolume}/manifest`
        }
      },

    };
  },
  watch: {
    citationUrl: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.citationUrl = newVal;
      }
    },
    canvasId: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.updateUrlParams();
        if (newVal === "top") {
          this.state = "";
          this.$store.commit('setEndpVolume', "collection");
          this.viewer = Mirador.viewer({
        id: 'mirador',
        window: {
          defaultView: 'single',
          views: [
            {key: 'single', behaviors: ['individuals']},
            //{key: 'book', behaviors: ['paged']},
          ],
          textOverlay: {
            enabled: true,
            selectable: true,
            visible: false,
            useAutoColors: true,
          },
        },
            workspaceControlPanel: {
            enabled: false,
          },
            workspace: {
            showZoomControls: true,
            type: "mosaic", // Which workspace type to load by default. Other possible values are "elastic"
          },
        windows: [{
          id: this.windowID,
          canvasIndex: this.canvasId,
          loadedManifest: `https://iiif.chartes.psl.eu/endp/collection/top`,
        }],
      }, [...textOverlayPlugin]);
        }
      }
    },
    endpVolume: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.updateUrlParams();
        if (newVal === "collection") {
          this.state = "";
          this.$store.commit('setCanvasId', "top");
          this.viewer = Mirador.viewer({
        id: 'mirador',
        window: {
          sideBarOpenByDefault: false,
          defaultView: 'single',
          views: [
            {key: 'single', behaviors: ['individuals']},
            //{key: 'book', behaviors: ['paged']},
          ],
          textOverlay: {
            enabled: true,
            selectable: true,
            visible: false,
            useAutoColors: true,
          },
        },
            workspaceControlPanel: {
            enabled: false,
          },
            workspace: {
            showZoomControls: true,
            type: "mosaic", // Which workspace type to load by default. Other possible values are "elastic"
          },
        windows: [{
          id: this.windowID,
          canvasIndex: this.canvasId,
          loadedManifest: `https://iiif.chartes.psl.eu/endp/collection/top`,
        }],
      }, [...textOverlayPlugin]);
        }
      }
    },
  },
  computed: {
    ...mapState(['canvasId','endpVolume']),
  },
  methods: {
     updateUrlParams() {
      this.$router.push({
        name: 'facsimile',
        params: {
          volumeIndex: this.endpVolume,
          canvasIndex: this.canvasId,
        },
      });
  },
    capitalizeFirstLetter,
    toggleNav(event) {
      event.preventDefault();
      this.isNavOpen = !this.isNavOpen;
    }
    ,
    // create a method to resize the font of all tspan elements
    // in the text overlay on attribute font-size
    resizeTextOverlay() {
      const tspanElements = document.querySelectorAll('tspan');
      tspanElements.forEach((tspan) => {
        tspan.setAttribute('font-size', '1px');
      });
    }
    ,
    handleMiradorUpdate(canvasID, registre) {

      console.log("ici", canvasID, registre)
      this.viewer = Mirador.viewer({
        id: 'mirador',
        window: {
          sideBarOpenByDefault: false,
          defaultView: 'single',
          views: [
            {key: 'single', behaviors: ['individuals']},
            //{key: 'book', behaviors: ['paged']},
          ],
          textOverlay: {
            enabled: true,
            selectable: true,
            visible: false,
            useAutoColors: true,
          },
        },
        workspace: {
            showZoomControls: true,
            type: "mosaic", // Which workspace type to load by default. Other possible values are "elastic"
          },
        workspaceControlPanel: {
            enabled: false,
          },
        windows: [{
          id: this.windowID,
          canvasIndex: canvasID,
          loadedManifest: `https://iiif.chartes.psl.eu/endp/${registre}/manifest`,
        }],
      }, [...textOverlayPlugin]);
      this.viewer.store.subscribe(() => {
        this.windowID = Object.keys(this.viewer.store.getState().windows)[0]; // Cela prend le premier, ajustez selon vos besoins
      let canvasIDUrl = String(this.viewer.store.getState().windows[this.windowID].canvasId);
      /* canvas IDUrl store "https://api.nakala.fr/iiif/10.34847/nkl.c33f4e1n/Canvas/b4653c428ae208e6492c180a095f9aa8d93d4a66"
      I want to transform it to "https://nakala.fr/10.34847/nkl.c33f4e1n#b4653c428ae208e6492c180a095f9aa8d93d4a66"
       */
      canvasIDUrl = canvasIDUrl.replace("https://api.nakala.fr/iiif/", "https://nakala.fr/");
      canvasIDUrl = canvasIDUrl.replace("/Canvas/", "#");
      this.imageNakalaSrc = canvasIDUrl;
      const windowState = String(this.viewer.store.getState().windows[this.windowID].canvasId);
      const sha1 = windowState.split("/")[(windowState.split("/").length - 1)];
      const canvasObject = Object(mapSha1Dates[sha1]);
      //console.log("on change de canvas", canvasObject['canvas_index']);
      // get last part of the string
        this.endpVolume = registre;
      this.canvasId = canvasObject['canvas_index'];
      this.$store.commit('setEndpVolume', registre);
      this.$store.commit('setCanvasId', canvasObject['canvas_index']);
      this.state = canvasObject['date_full'];

      });
    }
    ,
  }
  ,
  mounted() {
    this.resizeTextOverlay();
    const routeParams = this.$route.params;
    if (routeParams.volumeIndex && routeParams.canvasIndex) {
      this.$store.commit('setCanvasId', routeParams.canvasIndex);
      this.$store.commit('setEndpVolume', routeParams.volumeIndex);
    }
    this.viewer = Mirador.viewer({
      id: 'mirador',
      themes: {
        dark: {
          overlayFont: 'Chivo Mono',
          palette: {
            primary: {
              main: '#b00722',
            },
            secondary: {
              main: '#52b3fc',
            },
          },
        },
      },
      window: {
            sideBarOpenByDefault: false,
        defaultView: 'single',
        views: [
          {key: 'single', behaviors: ['individuals']},
          //{key: 'book', behaviors: ['paged']},
        ],
        textOverlay: {
          enabled: true,
          selectable: true,
          visible: false,
          useAutoColors: true,
        },
      },
      windows: [
        {
          canvasIndex: this.canvasId,
          manifestId: this.endpVolumeManifest(),
        },

      ],

    }, [...textOverlayPlugin]);
    this.viewer.store.subscribe(() => {
      this.windowID = Object.keys(this.viewer.store.getState().windows)[0]; // Cela prend le premier, ajustez selon vos besoins
      let canvasIDUrl = String(this.viewer.store.getState().windows[this.windowID].canvasId);
      /* canvas IDUrl store "https://api.nakala.fr/iiif/10.34847/nkl.c33f4e1n/Canvas/b4653c428ae208e6492c180a095f9aa8d93d4a66"
      I want to transform it to "https://nakala.fr/10.34847/nkl.c33f4e1n#b4653c428ae208e6492c180a095f9aa8d93d4a66"
       */
      canvasIDUrl = canvasIDUrl.replace("https://api.nakala.fr/iiif/", "https://nakala.fr/");
      canvasIDUrl = canvasIDUrl.replace("/Canvas/", "#");
      this.imageNakalaSrc = canvasIDUrl;
      const windowState = String(this.viewer.store.getState().windows[this.windowID].canvasId);
      const sha1 = windowState.split("/")[(windowState.split("/").length - 1)];
      const canvasObject = Object(mapSha1Dates[sha1]);
      //console.log("on change de canvas", canvasObject['canvas_index']);
      // get last part of the string
      this.canvasId = canvasObject['canvas_index'];
      this.$store.commit('setCanvasId', canvasObject['canvas_index']);
      this.state = canvasObject['date_full'];
    });
  }
  ,

}
;

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Chivo+Mono:wght@100&display=swap');


.title {
  font-size: 1.5rem;
  color: #0a0b0d;
}

.wrapper-mirador {
  flex-grow: 1;
  background-color: #E3D6CA !important;
}

.navfac {
  flex: 0 0 25%; /* do not grow, do not shrink, start at 25% of the parent's width */
}

.wrapper-mirador {
  flex: 1; /* grow to fill the remaining space */
  height: 900px; /* or 'auto' to fill the height */
}

#mirador {
  position: relative;
  height: 900px;
}

text {
  /*font-size: 70px !important;*/
  /* font-size: 10px !important; */
}

tspan {
  /*font-size: 70px !important;*/
  font-size: 1px !important;

  font-weight: normal !important;
}


.is-full {
  width: 100%;
}

.is-8 {
  width: 75%; /* ou la largeur que vous souhaitez pour cette colonne */
}

.column {
  transition: width 0.5s;
}

.is-hidden {
  display: none;
}

.is-3 {
  width: 25%;
}

.is-9 {
  width: 75%;
}

.is-12 {
  width: 100%;
}

/*rect {
  fill: rgb(192, 180, 156) !important;
}*/
</style>