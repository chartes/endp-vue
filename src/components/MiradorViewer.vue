<template>
  <div id='mirador-test'></div>
</template>

<script>
import Mirador from 'mirador/dist/es/src/index';
import textOverlayPlugin from 'mirador-textoverlay/es';

export default {
  name: 'MiradorViewer',
  props: {
    endpVolumeManifest: String,
    canvasId: String,
  },
  methods: {
    initMiradorViewer() {
      this.viewer = Mirador.viewer({
        id: 'mirador-test',
        windows: [
          {
            id: 'test',
            canvasIndex: this.canvasId,
            loadedManifest: this.endpVolumeManifest,
          }
        ],
      }, [...textOverlayPlugin]);
    },
  },
  watch: {
    endpVolumeManifest: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.initMiradorViewer();
      }
    },
    canvasId: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.initMiradorViewer();
      }
    }
  },
  mounted() {
    this.initMiradorViewer();
  }
};
</script>
<style scoped>
#mirador-test {
  position: relative;
  height: 100vh;
}
</style>
