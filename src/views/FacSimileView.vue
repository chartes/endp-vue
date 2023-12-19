<template>
  <div class='container'>
    <br>
    <br>
    <div class='columns'>
      <div class='column is-4 navfac'>
        <fac-simile-nav @update-mirador="handleMiradorUpdate"></fac-simile-nav>
      </div>
      <div class='column is-10 wrapper-mirador'>
        <br>
        <p class="title" v-if="state">Date : {{ state }}</p>
        <p v-if="state">Citer l'image sur Nakala : <a target="_blank" :href="imageNakalaSrc">{{ imageNakalaSrc }}</a></p>
        <div id='mirador'></div>
      </div>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
import Mirador from 'mirador/dist/es/src/index';
import FacSimileNav from "@/components/FacSimileNav.vue";
import textOverlayPlugin from 'mirador-textoverlay/es';
import endpManifestMapping from '../data/endp_manifest_mapping.json';
import mapSha1Dates from '../data/mapping_image_sha1_dates.json';

export default {
  name: 'FacSimileView',
  components: {FacSimileNav},
  data() {
    return {
      endpManifestMapping,
      viewer: null,
      windowID: null,
      imageNakalaSrc: "",
      endpVolume: this.$route.params.register,
      state: "",
      canvasId: this.$route.params.canvas,
      endpVolumeManifest: function () {
        if (parseInt(this.endpVolume) === 0) {
          return `https://iiif.chartes.psl.eu/endp/collection/top`
        } else {
          return `https://iiif.chartes.psl.eu/endp/${this.endpVolume}/manifest`
        }
      }
    };
  },
  methods: {
    // create a method to resize the font of all tspan elements
    // in the text overlay on attribute font-size
    resizeTextOverlay() {
      const tspanElements = document.querySelectorAll('tspan');
      tspanElements.forEach((tspan) => {
        tspan.setAttribute('font-size', '1px');
      });
    },
    handleMiradorUpdate (canvasID, registre) {
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
    });
    },
  },
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
  },

};

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
  /* fixed on scroll */
  position: sticky !important;
  top: 0 !important;
  margin-top: 0 !important;
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

/*rect {
  fill: rgb(192, 180, 156) !important;
}*/
</style>