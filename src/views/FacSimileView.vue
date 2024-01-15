<template>
  <p>{{ endpVolume }}</p>
  <div class="container">
    <br>
    <br>
    <div class="header">
      <p class="title" v-if="state">{{ capitalizeFirstLetter(state) }}</p>
      <p v-if="imageNakalaSrc !== 'undefined'"><a target="_blank" :href="imageNakalaSrc">{{ imageNakalaSrc }}</a></p>
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
      viewer: null,
      windowID: null,
      imageNakalaSrc: "",
      state: "",
      isNavOpen: true,
      endpVolumeManifest: function () {
        if (this.endpVolume === null) {
          return `https://iiif.chartes.psl.eu/endp/collection/top`
        } else {
          return `https://iiif.chartes.psl.eu/endp/${this.endpVolume}/manifest`
        }
      },

    };
  },
  watch: {
    endpVolume: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal === null) {
          Mirador.viewer({
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
            windows: [{
              id: this.windowID,
              canvasIndex: 0,
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
        console.log(canvasIDUrl);
        canvasIDUrl = canvasIDUrl.replace("https://api.nakala.fr/iiif/", "https://nakala.fr/");
        canvasIDUrl = canvasIDUrl.replace("/Canvas/", "#");
        this.imageNakalaSrc = canvasIDUrl;
        const windowState = String(this.viewer.store.getState().windows[this.windowID].canvasId);
        // get last part of the string
        this.state = Object(mapSha1Dates[windowState.split("/")[(windowState.split("/").length - 1)]])['date_full'];
        this.$store.commit('setCanvasId', canvasID);
        this.$store.commit('setEndpVolume', registre);
        console.log(this.$store.state.canvasId);

      });
    }
    ,
  }
  ,
  mounted() {
    this.resizeTextOverlay();
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
      console.log(canvasIDUrl);
      canvasIDUrl = canvasIDUrl.replace("https://api.nakala.fr/iiif/", "https://nakala.fr/");
      canvasIDUrl = canvasIDUrl.replace("/Canvas/", "#");
      this.imageNakalaSrc = canvasIDUrl;
      const windowState = String(this.viewer.store.getState().windows[this.windowID].canvasId);
      // get last part of the string
      this.state = Object(mapSha1Dates[windowState.split("/")[(windowState.split("/").length - 1)]])['date_full'];
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