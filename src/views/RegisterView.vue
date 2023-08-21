<template>
 <div class='container'>
    <div class='columns is-centered'>
      <div class='column is-8'>
        <div class="container">
          <h1 class='title'>Registres</h1>
          <hr>
        </div>
        <table class='table is-hoverable is-centered is-fullwidth'>
          <thead>
            <tr>
              <th>Volumes</th>
              <th>Métadonnées - SIV</th>
              <th>Fac-Simile</th>
              <th>Édition TEI</th>
              <th>
                <span class="icon-text">
                  <span class="icon">
                    <img src="@/assets/no-sketch-engine-logo.png" class="logo-nse" alt="nosketch logo">
                  </span>
                  <span>Recherche NoSketch</span>
                </span>

              </th>
            </tr>
          </thead>
                   <tbody>
            <tr v-for="(registre, index) in registres" :key="index">
              <td>{{ registre.volume }}</td>
              <!--
              <td>
                <span v-if="book.read">Yes</span>
                <span v-else>No</span>
              </td>-->
              <td id="meta-siv-toggle-btn">

                <a :href="registre.siv_link" target="blank" title="Accéder aux métadonnées des Archives nationales">
                  <i class="fa fa-info"></i></a>
              </td>
              <td id="fac-simile-toggle-btn">
                <a v-if="registre.volume == 'LL117'" target="_blank" href="http://localhost:5173/facsimile" title="Consulter le registre Mirador">
                  <i class="fa fa-eye"></i>
                </a>
                <router-link to="#" style="cursor: not-allowed !important;" v-else>
                  <i class="fa fa-eye" style="color:black;"></i>
                </router-link>
              </td>
              <td id="edition-toggle-btn">
                <router-link :to="{name: 'edition', params: {id: registre.volume.toLowerCase() }}" v-if="this.active_edition.includes(parseInt(registre.id))"><i class="fa fa-file"></i></router-link>
                <!--<a v-if="this.active_edition.includes(parseInt(registre.id))" :href="`http://localhost:8000/edition/${registre.id}`" target="blank" title="Accéder à l'édition TEI du registre">
                <i class="fa fa-file"></i>
                </a>-->
                <a href="#"  style="cursor: not-allowed !important;" v-else>
                <i class="fa fa-file" style="color:black;"></i>
                </a>
              </td>

              <td id="search-nosketch-toggle-btn">
                <form>
                  <div class="form-group">
                    <input :id="'search_'+index" v-model="searchValue[index]" class="form-control" placeholder="Rechercher un terme dans le volume...">
                   <!-- <input type="checkbox" :id="'cql_search_'+index" value="true" v-model="cql_activate[index]">
                <label :for="'cql_search_'+index">CQL</label> -->
                    <button class="btn btn-primary" @click="search(index, registre.volume)"><i class="fa fa-search"></i></button>
                </div>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import EditionView from "@/views/EditionView.vue";
export default {
  name: "RegisterView",
  data() {
    return {
      registres: [],
      searchValue: [],
      active_edition: [1, 17],
      // cql_activate: [],
    };
  },
  created() {
      const path = 'http://localhost:8000/registers';
      axios.get(path)
        .then(res => {
          this.registres = res.data.registers;
          for(let i = 0; i < this.registres .length; i++) {
          this.searchValue.push('');
        }
        });
  },
  computed: {
    EditionView() {
      return EditionView
    },
    isInArray : function (value) {
      return this.active_edition.includes(value)
    },
    toLowerCase (value) {
      return value.toLowerCase()
    }
  },
  methods: {
    search(index, volume) {
      // console.log(this.cql_activate);
      const url = `https://nosketch-engine.lamop.fr/#concordance?corpname=endp&tab=advanced&keyword=${this.searchValue[index]}&attrs=word&viewmode=kwic&attr_allpos=all&refs_up=0&shorten_refs=1&glue=1&gdexcnt=300&show_gdex_scores=0&itemsPerPage=20&structs=s%2Cg&refs=%3Ddoc.id&default_attr=lemma&showresults=1&tts=%7B%22doc.volume%22%3A%5B%22${volume}%22%5D%7D&showTBL=0&tbl_template=&gdexconf=&f_tab=basic&f_showrelfrq=1&f_showperc=0&f_showreldens=0&f_showreltt=0&c_customrange=0&operations=%5B%7B%22name%22%3A%22iquery%22%2C%22arg%22%3A%22${this.searchValue[index]}%22%2C%22query%22%3A%7B%22queryselector%22%3A%22iqueryrow%22%2C%22iquery%22%3A%22${this.searchValue[index]}%22%2C%22sca_doc.volume%22%3A%5B%22${volume}%22%5D%7D%2C%22id%22%3A1678%7D%5D`;
      window.open(url);
    }
  },
};
</script>

<style scoped>
  div.columns {
      margin-top: 50px;
    }

    h1 {
      color: black !important;
      margin-bottom: 20px;

    }

    .table td {
      font-size: 17px
    }

    .table th {
      font-size: 17px
    }
    .logo-nse {
  width: 20px;
  height: 20px;
}
    .icon-text .icon {
  margin-right: 0.5rem;
}
</style>