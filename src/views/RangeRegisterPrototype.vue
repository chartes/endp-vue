<template>
  <!-- banner (TODO: convert to component) -->
  <div id="banner-image" class="container is-fluid">
    <h1 class="title">Accéder aux Registres</h1>
  </div>
  <!-- end banner -->
  <div class="slider-container container">
    <div class="columns">
      <div class="column is-8">
        <p>PÉRIODE DU CONTENU</p>
        <br>
        <br>
        <vue-slider
            class="slider-component"
            v-model="yearRange"
            @change="getDateInput"
            :min="minYear"
            :max="maxYear"
            :tooltip="'always'"
            :enable-cross="false"
            :process="true"
            :lazy="true"
        ></vue-slider>
      </div>
    </div>
    <br>
    <div class="input-date-description-container flex-container">
      <br>
      <p>ENTRE</p>
      <div class="control has-icons-left">
        <div class="select">
          <select v-model="startMonthCode" class="uppercase" id="StartMonthSelect">
            <option v-for="month in months" :key="month.iso_code" :value="month.iso_code">
              {{ month.name }}
            </option>
          </select>
          <span class="icon is-left"><i class="fas fa-calendar-alt"></i></span>
        </div>
      </div>
      <div class="control">
        <input class="input" type="text" @change="onYearInputChange" v-model="inputStartYear">
      </div>
      <p>ET</p>
      <div class="control has-icons-left">
        <div class="select">
          <select v-model="endMonthCode" class="uppercase" id="EndMonthSelect">>
            <option v-for="month in months" :key="month.iso_code" :value="month.iso_code"
                    :disabled="shouldDisableEndMonthOption(month.iso_code)">
              {{ month.name }}
            </option>
          </select>
          <span class="icon is-left"><i class="fas fa-calendar-alt"></i></span>
        </div>
      </div>
      <div class="control">
        <input class="input" type="text" @change="onYearInputChange" v-model="inputEndYear">
      </div>

    </div>
    <br>
    <br>
    <div>
      <div class="field is-horizontal">
        <div class="field-label is-normal" style="flex-grow: 0; display: flex; align-items: center;">
          <p class="control" style="margin-right: 10px; margin-bottom: 30px">
            <img src="@/assets/no-sketch-engine-logo.png" alt="Logo" class="image is-24x24">
          </p>
          <label class="label" style="white-space: nowrap; margin-bottom: 30px">NoSketch Engine</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="field has-addons" style="margin-bottom: 1px;">
              <p class="control" style="margin-right: 2px;">
                <input class="input" type="text" placeholder="Entrez un terme" style="width: 250px"
                       v-model="NoSketchTermSearch">
              </p>
              <p class="control">
                <button class="button is-info" @click="goNoSketchResults">Rechercher</button>
              </p>
            </div>
            <p class="help">Recherche dans le corpus du terme : <i>"{{ NoSketchTermSearch }}"</i> entre
              {{ yearRange[0] }} et {{ yearRange[1] }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="data-viz-content">
      <div class="sidebar">
        <div class="histogram-container">
          <registerHistChart
              :startYearProp="yearRange[0]"
              :endYearProp="yearRange[1]"
              :minYear="minYear"
              :maxYear="maxYear"

          ></registerHistChart>
        </div>
        <!-- Section du nombre de registres -->
        <div class="result-container">
          <p class="resultCanvas">
            <span class="totalFounded">{{ numberOfRegistries }}</span> registre<span v-if="isPlural">s</span>
            disponible<span v-if="isPlural">s</span>

          </p>
        </div>

        <!-- Légende -->
        <div class="legend-container">
          <p class="legend-title">Légende</p>
          <div class="legend-item">
            <span class="icon book-icon"><i class="fas fa-book-open"></i></span>
            <span class="legend-text">fac-similé intéractif</span>
          </div>
          <div class="legend-item">
            <span class="icon book-icon"><i class="fas fa-book"></i></span>
            <span class="legend-text">édition TEI</span>
          </div>

        </div>
      </div>

      <!-- Histogramme -->

    </div>
    <br>
    <div class="container is-fluid card-navigation-container">
      <card-navigation
          class="card-navigation-container"
          v-for="(cardData, index) in updatedCardData"
          :key="index"
          :volume="cardData.volumeID"
          :is-edited="cardData.isEdited"
          :facSimile="cardData.facSimile"
          :title="cardData.label"
          :main-label="cardData.label"
          :AnSivLink="cardData.sivLink"
          :firstPage="cardData.firstPage"
          :lastPage="cardData.lastPage"
          :period="cardData.period"
          :defaultCanvasID="0"
          :firstCanvasID="cardData.firstPageCanvasID"
          :lastCanvasID="cardData.lastPageCanvasID"
      />
    </div>
    <br>
    <br>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import endpData from '../data/endp_data_range_new.json';
import endpVolumesData from '../data/endp_register_volumes.json';
import CardNavigation from "@/components/CardNavigation.vue";
import RegisterHistChart from "@/components/RegisterHistChart.vue";
// import DateSelector from "@/components/DateSelector.vue";

export default {
  components: {
    RegisterHistChart,
    // DateSelector,
    CardNavigation,
    VueSlider,
  },
  data() {
    return {
      yearRange: [1326, 1504],
      NoSketchTermSearch: '',
      minYear: 1326,
      maxYear: 1504,
      startMonthCode: '01',
      endMonthCode: '12',
      months: [
        {iso_code: '01', name: 'Janvier'},
        {iso_code: '02', name: 'Février'},
        {iso_code: '03', name: 'Mars'},
        {iso_code: '04', name: 'Avril'},
        {iso_code: '05', name: 'Mai'},
        {iso_code: '06', name: 'Juin'},
        {iso_code: '07', name: 'Juillet'},
        {iso_code: '08', name: 'Août'},
        {iso_code: '09', name: 'Septembre'},
        {iso_code: '10', name: 'Octobre'},
        {iso_code: '11', name: 'Novembre'},
        {iso_code: '12', name: 'Décembre'}
      ],
      endpData,
      endpVolumesData,
      startMonth: {
        monthIndex: null,
        month: null,
      },
      endMonth: {
        monthIndex: null,
        month: null,
      },
      startInputDate: function () {
        return `${this.yearRange[0]}-${this.startMonthCode}`;
      },
      endInputDate: function () {
        return `${this.yearRange[1]}-${this.endMonthCode}`;
      },
      inputStartYear: '',
      inputEndYear: '',
    };
  },
  mounted() {
    this.inputStartYear = this.yearRange[0];
    this.inputEndYear = this.yearRange[1];
  },
  computed: {
    filteredVolumes() {
      // Assuming you need to return the volumeData for use in the template
      return Object.entries(this.endpVolumesData)
          .filter(([, volumeData]) => {
            // The start and end properties from volumeData are used for comparison
            return volumeData.start >= this.yearRange[0] && volumeData.end <= this.yearRange[1];
          })
          .map(([, volumeData]) => volumeData); // Just return the volumeData
    },
    numberOfRegistries() {
      return this.updatedCardData.length;
    },
    isPlural() {
      return this.numberOfRegistries > 1;
    },
    filteredData() {
      const start = `${this.yearRange[0]}-${this.startMonthCode}`;
      const end = `${this.yearRange[1]}-${this.endMonthCode}`;
      return Object.entries(this.endpData)
          .filter(([date]) => date >= start && date <= end)
          .reduce((acc, [date, entries]) => {
            acc[date] = entries; // Ajoutez chaque tableau d'entrées au résultat
            return acc;
          }, {});
    },
    filteredAndGroupedData() {
      const start = `${this.yearRange[0]}-${this.startMonthCode}`;
      const end = `${this.yearRange[1]}-${this.endMonthCode}`;
      const filtered = Object.entries(this.endpData)
          .filter(([date]) => date >= start && date <= end);

      const groupedByVolume = {};
      filtered.forEach(([date, dataEntries]) => {
        dataEntries.forEach(dataEntry => {
          const volume = dataEntry.volume;
          if (!groupedByVolume[volume]) {
            groupedByVolume[volume] = [];
          }
          groupedByVolume[volume].push({date, ...dataEntry});
        });
      });

      const result = {};
      Object.keys(groupedByVolume).forEach(volume => {
        const entries = groupedByVolume[volume];
        result[volume] = [entries[0], entries[entries.length - 1]];
      });

      return result;
    },
    updatedCardData() {
      const filteredGroupedData = this.filteredAndGroupedData;

      // Filtrer les volumes qui ont des données correspondantes dans la période sélectionnée
      return Object.entries(this.endpVolumesData).reduce((acc, [volumeKey, volumeInfo]) => {
        if (filteredGroupedData[volumeKey]) {
          const volumeData = filteredGroupedData[volumeKey];
          const firstData = volumeData[0];
          const lastData = volumeData[volumeData.length - 1];
          acc.push({
            volumeID: firstData.volume,
            label: volumeInfo.label,
            firstPage: firstData.firstPage,
            lastPage: lastData.lastPage,
            firstPageCanvasID: firstData.firstPageCanvasIdx,
            lastPageCanvasID: lastData.lastPageCanvasIdx,
            sivLink: firstData.links.siv_link,
            period: `${this.formatDateToMonthYear(firstData.date)} - ${this.formatDateToMonthYear(lastData.date)}`,
            isEdited: volumeInfo.params.isEdited,
            facSimile: volumeInfo.params.facSimile,
          });
        }
        return acc;
      }, []);
    },
    resultsCount() {
      return Object.keys(this.filteredAndGroupedData).length;
    }
  },
  watch: {
    'startMonthCode': function (newVal) {
      if (this.yearRange[0] === this.yearRange[1] && this.endMonthCode < newVal) {
        this.endMonthCode = newVal;
      }
    },

    'yearRange': function (newVal) {
      this.inputStartYear = newVal[0].toString();
      this.inputEndYear = newVal[1].toString();
      this.filterData(); // Mettre à jour les données filtrées
      if (newVal[0] > newVal[1]) {
        // Si l'année de début est postérieure à l'année de fin, ajustez les mois
        this.startMonthCode = '01'; // Janvier de l'année de début
        this.endMonthCode = '12'; // Décembre de l'année de fin
      } else if (newVal[0] === newVal[1]) {
        // Si les années de début et de fin sont les mêmes, ajustez les mois si nécessaire
        if (this.startMonthCode > this.endMonthCode) {
          this.endMonthCode = this.startMonthCode;
        }
      }
    },

  },
  methods: {
    goNoSketchResults() {
      let cqlQuery = encodeURIComponent(`[word="${this.NoSketchTermSearch}"] within <doc (date >="${this.yearRange[0]}") & (date<="${this.yearRange[1]}") />`);
      let baseNoSketchUrl = "https://nosketch-engine.lamop.fr/#concordance";
      let queryParams = `corpname=endp&tab=advanced&queryselector=cql&attrs=word&viewmode=kwic&attr_allpos=all&refs_up=0&shorten_refs=1&glue=1&gdexcnt=300&show_gdex_scores=0&itemsPerPage=20&structs=s%2Cg&refs=%3Ddoc.id&default_attr=word&cql=${cqlQuery}&showresults=1&showTBL=0&tbl_template=&gdexconf=&f_tab=basic&f_showrelfrq=1&f_showperc=0&f_showreldens=0&f_showreltt=0&c_customrange=0`;
      window.open(`${baseNoSketchUrl}?${queryParams}`);
    },
    onYearInputChange() {
      let startYear = parseInt(this.inputStartYear);
      let endYear = parseInt(this.inputEndYear);
      console.log(startYear, endYear);

      // Vérifier si les années sont des nombres valides
      if (isNaN(startYear)) {
        startYear = this.minYear;
      } else {
        startYear = Math.max(this.minYear, Math.min(startYear, this.maxYear));
      }
      if (isNaN(endYear)) {
        endYear = this.maxYear;
      } else {
        endYear = Math.max(startYear, Math.min(endYear, this.maxYear));
      }

      // Convertir les entrées en nombres et valider les plages
      //startYear = Math.max(this.minYear, Math.min(parseInt(this.inputStartYear), this.maxYear));
      //endYear = Math.max(startYear, Math.min(parseInt(this.inputEndYear), this.maxYear));

      // Mettre à jour les propriétés réactives et le slider
      this.yearRange = [startYear, endYear];
      this.inputStartYear = startYear.toString();
      this.inputEndYear = endYear.toString();

      // Rafraîchir les données filtrées si nécessaire
      this.filterData();
    },
    getStartMonth(startMonth) {
      this.startMonth = startMonth;
    },
    getEndMonth(endMonth) {
      this.endMonth = endMonth;
    },
    formatMonth(monthObj) {
      if (monthObj === null) {
        return null
      } else {
        return monthObj.monthIndex < 10 ? `0${monthObj.monthIndex}` : `${monthObj.monthIndex}`
      }
    },
    getMonthName(monthCode) {
      const month = this.months.find(m => m.iso_code === monthCode);
      return month ? month.name : '';
    },
    formatDateToMonthYear(dateString) {
      const parts = dateString.split('-');
      const year = parts[0];
      const monthCode = parts[1];
      const monthName = this.getMonthName(monthCode);
      return `${monthName} ${year}`;
    },
    shouldDisableEndMonthOption(monthCode) {
      return this.yearRange[0] === this.yearRange[1] && monthCode < this.startMonthCode;
    },
    formatDate(dateString) {
      console.log("ICi la date: ", dateString);
      return dateString;
    },
    getDateInput() {
      this.filterData();
      console.log(this.startInputDate(), this.endInputDate());
      return [this.startMonthCode, this.yearRange[0], this.endMonthCode, this.yearRange[1]];
    },
    filterData() {
      const start = `${this.yearRange[0]}-${this.startMonthCode}`;
      const end = `${this.yearRange[1]}-${this.endMonthCode}`;
      this.filteredData = Object.fromEntries(
          Object.entries(this.endpData)
              .filter(([date]) => date >= start && date <= end)
      );
    },
  }
};
</script>
<style>
/* TODO: Styles banner A enlever a terme */
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');

#banner-image {
  position: relative; /* Pour le positionnement absolu du titre */
  height: 250px; /* Ajustez selon vos besoins */
  width: 100%;
  max-width: 100%;
  display: flex;
  animation: fadeImageIn 1s ease-out 0s;
  margin-bottom: 50px;
}


#banner-image::before {
  border-radius: 0px 0px 0px 10px;
  content: "";
  background-image: url("@/assets/banners/banner_registers_page.png");
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

/***********/

.vue-slider-process {
  color: #8d1919 !important;
  background-color: #8d1919 !important;
}

.vue-slider-dot-handle {
  border: 2px solid #8d1919 !important;
  box-shadow: 0px 0px 0px 2px #8d1919 !important;
}

.vue-slider-dot-tooltip-text {
  color: #fff !important;
  font-weight: bold !important;
}


.vue-slider-dot-tooltip-inner {
  font-size: 14px !important;
  white-space: nowrap !important;
  padding: 2px 5px !important;
  min-width: 20px !important;
  text-align: center !important;
  color: #fff !important;
  border-radius: 5px !important;
  border-color: #8d1919 !important;
  background-color: #8d1919 !important;
  box-sizing: content-box !important;
}
</style>
<style scoped>

.slider-component {
  margin-right: 20px;
}


.data-viz-content {
  display: flex;
  flex-wrap: wrap;
}

.sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* Styles spécifiques à la colonne de gauche (barre latérale) */
}

.histogram-container {
  flex: 2;
  max-width: 60%;
}

.card-navigation-container {
  margin-top: 10px;
  margin-left: -90px;
  width: 100%;
  position: relative;
}


div.columns {
  margin-top: 50px;
}


option {
  text-transform: capitalize !important;
  font-weight: bold !important;
}

.resultCanvas {
  font-size: 30px;
  width: 100%;
  height: 100%;
}

.totalFounded {
  font-size: 35px;
  font-weight: bold;
  color: #8d1919;
}

.input-date-description-container > p {
  font-size: 17px;
  color: #969696;
  font-weight: bold !important;
}

.flex-container {
  display: flex;
  align-items: center; /* Centre verticalement */
}

.flex-container > div {
  margin: 0.5px 10px 0px 40px; /* Ajoute une marge de 10px à gauche et à droite de chaque élément */
}

.input {
  width: 100px;
  text-align: center;
  font-weight: bold !important;
}

.result-container {
  padding: 10px;
  margin-bottom: 20px;
}

.legend-container {
  border: 1px solid #ddd;
  padding: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 30%; /* Réduire la marge à droite */
  position: relative; /* Important pour positionner le label par rapport à ce conteneur */
}

.legend-title {
  background-color: white; /* Arrière-plan pour masquer la bordure derrière le texte */
  position: absolute; /* Positionnement absolu */
  top: -12px; /* Déplacer vers le haut pour qu'il soit au-dessus de la bordure */
  left: 5px; /* Ajuster la position horizontale */
  padding: 0 5px; /* Ajouter un peu de marge */
  margin-left: 5px;
  font-weight: bold;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.book-icon {
  margin-right: 5px;
}
</style>