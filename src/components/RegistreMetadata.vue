<template>
  <div class="container column">
    <div class="document-metadata">
      <div class="document-metadata-header" @click="toggleContent">
        <a href="#">
          <span class="metadata-header-entry">Métadonnées</span>
          <span class="metadata-header-title">{{ metadata.title }}</span>
        </a>
        <a href="#" class="toggle-btn" :class="{ 'is-opened': isOpened }"></a>
      </div>
      <aside v-if="isOpened" class="content">
        <div class="columns is-multiline">
          <div class="column is-7 block has-text-left">
            <p><span class="metadata-header-title">Dates extrêmes du registre</span> : <b>{{metadata['dts:extensions']['dc:coverage']}}</b></p>
            <p></p>
            <p>Licence : <a :href="metadata['dts:dublincore']['dct:rights']">License CC-BY 4.0</a></p>
            <p></p>
            <p>Participants à l'édition :</p>
    <ul>
      <li v-for="(participant, index) in metadata['dts:extensions']['dc:creator']" :key="index">
        {{ participant['@id'] }}
      </li>
    </ul>
          </div>
          <div class="column is-2">
          </div>
          <div class="column is-3">
            <p class="metadata-header-title">LIENS EXTERNES</p>
            <figure class="image is-48x48 level-left">
              <a v-bind:href="metadata['dts:extensions']['dc:relation']">
                <img :src="require('@/assets/an-logo.jpg')" alt="an logo"/>
              </a>
            </figure>
          </div>
        </div>
      </aside>
    </div>
  </div>

</template>
<script>
import axios from "axios";

export default {
  name: "RegistreMetadata",
  data() {
    return {
      metadata: [],
      isOpened: false,
    };
  },
  async created() {
    let documentId = this.$route.params.id;
    await axios.get(
        `http://localhost:8080/api/dts/collections?id=endp_${documentId}`
    ).then((res) => {
      console.log(res.data);
      this.metadata = res.data;
    }).catch((err) => {
      console.log(err);
    });
  },
  methods: {
    toggleContent() {
      this.isOpened = !this.isOpened;
    },
  },
};
</script>
<style scoped>
/* ... Vos styles existants ... */
@import url('https://fonts.googleapis.com/css2?family=Barlow&family=Barlow+Semi+Condensed&display=swap');

.document-metadata {
  width: 100%;
  font-family: "Barlow", sans-serif !important;
  position: relative;
}

.document-metadata-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #e4e4e4;
  border-radius: 6px;
  font-family: "Barlow Semi Condensed", sans-serif !important;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
}

.document-metadata-header:hover {
  background-color: #d8d8d8;
}

.document-metadata-header span.metadata-header-entry {
  margin-right: 40px;
  color: #4a4a4a;
  font-weight: bold;
}

.document-metadata-header span.metadata-header-title {
  color: #929292;
  font-weight: bold;
}

.toggle-btn {
  width: 27px;
  height: 27px;
  background: url('~@/assets/chevron_rouge.svg') center / cover no-repeat;
  transition: transform 0.6s;
}

.toggle-btn.is-opened {
  width: 27px;
  background: url('~@/assets/croix.svg') center / cover no-repeat;
}

.content {
  background-color: #f8f8f8;
  border-radius: 6px;
  padding: 20px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  height: 0;
  overflow: hidden;
}

</style>