<template>
  <div class='container'>
    <br>
    <br>
    <br>
    <div>
      <p class="title">Registre de conclusions capitulaires <span>{{endpVolume}}</span> - {{ state }}</p>
    </div>
    <br>
<div class='wrapper-mirador'>
  <div id='mirador'>
  </div>
</div>
  </div>
</template>

<script>
import Mirador from 'mirador/dist/es/src/index';
import textOverlayPlugin from 'mirador-textoverlay/es';
import endpManifestMapping from '../data/endp_manifest_mapping.json';
import mapSha1Dates from '../data/mapping_image_sha1_dates.json';
export default {
  name: 'FacSimileView',
  data() {
    return {
      endpManifestMapping,
      endpVolume: this.$route.params.register,
      state: "",
      canvasId: this.$route.params.canvas,
      endpVolumeManifest: function () {
        return `https://iiif.chartes.psl.eu/endp/${this.endpVolume}/manifest`
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
  },
  mounted() {
    this.resizeTextOverlay();
    let viewver = Mirador.viewer({
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
        views : [
          {key: 'single', behaviors: ['individuals']},
          //{key: 'book', behaviors: ['paged']},
        ],
        textOverlay: {
          enabled: true,
          selectable: true,
          visible: false,
          useAutoColors:true,
        },
      },
      windows: [
        {
          canvasIndex: this.canvasId,
          manifestId: this.endpVolumeManifest() ,
        },

      ],

    }, [...textOverlayPlugin]);
    viewver.store.subscribe(() => {
      const windowId = Object.keys(viewver.store.getState().windows)[0]; // Cela prend le premier, ajustez selon vos besoins
      const windowState = String(viewver.store.getState().windows[windowId].canvasId);
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
    background-color: #E3D6CA !important;
  }
  #mirador {
    position: relative;
    height: 900px;
  }
  text {
    /*font-size: 70px !important;*/
    /* font-size: 10px !important; */
  }

  tspan{
    /*font-size: 70px !important;*/
    font-size: 1px !important;

    font-weight: normal !important;
  }

  /*rect {
    fill: rgb(192, 180, 156) !important;
  }*/
</style>