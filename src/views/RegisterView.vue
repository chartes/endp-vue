<template>
  <!-- Banner -->
  <div id="banner-image" class="container is-fluid">
    <h1 class="title">Accéder aux Registres</h1>
  </div>
  <!-- end banner -->
  <!-- Main grid  -->
  <div class="columns is-multiline">
    <!-- Filters column (facets, histogram etc.) -->
    <div class="column is-12-mobile is-5-tablet is-5-desktop">
      <div class="box box-facets">
        <!-- Date slider container -->
        <p class="subtitle is-5">Période du contenu</p>
        <div class="container-slider">
          <VueSlider
              class="slider-component"
              v-model="yearRange"
              @change="getDateInput"
              :min="minYear"
              :max="maxYear"
              :tooltip="'always'"
              :enable-cross="false"
              :process="true"
              :lazy="true"
          />
        </div>
        <!-- Date interval box -->
        <RegisterDateIntervalBox
            :yearRange="yearRange"
            @date-change="handleDateIntervalChange"
        />
        <!-- NoSketch Engine search box -->
        <RegisterNoSketchSearchBox
            :year-range="yearRange"
        />
        <!-- histogram viz box -->
          <RegisterHistogramChartBox
              :startYearProp="yearRange[0]"
              :endYearProp="yearRange[1]"
              :minYear="minYear"
              :maxYear="maxYear"
          />
      </div>
    </div>
    <!-- end Filters column -->
    <!-- Results column -->
    <div class="column column-result is-12-mobile is-7-tablet is-7-desktop">
      <div class="box box-results-info">
        <div class="container result-container">
          <p class="resultCanvas">
            <span class="totalFounded">{{ numberOfRegistries }}</span> registre<span v-if="isPlural">s</span>
            disponible<span v-if="isPlural">s</span>
          </p>
        </div>
        <div class="container legend-container">
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
      <div class="container card-navigation-container">
        <RegisterCardNavigation
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

    </div>
    <!-- end Results column -->
    <!-- end Main grid -->
  </div>

</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

import RegisterNoSketchSearchBox from "@/components/RegisterNoSketchSearchBox.vue";
import RegisterDateIntervalBox from "@/components/RegisterDateIntervalBox.vue";
import RegisterHistogramChartBox from "@/components/RegisterHistogramChartBox.vue";

import RegisterCardNavigation from "@/components/RegisterCardNavigation.vue";

import endpData from '../data/endp_data_range_new.json';
import endpVolumesData from '../data/endp_register_volumes.json';

export default {
  components: {
    RegisterHistogramChartBox,
    RegisterNoSketchSearchBox,
    RegisterDateIntervalBox,
    RegisterCardNavigation,
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
      months: this.$store.state.months,
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
    /**
     * Check if the given years are valid
     * @param {number} startYear
     * @param {number} endYear
     * @private
     * @return {void}
     */
    _checkYearValidity(startYear, endYear) {
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
    },
    /**
     * Update the slider properties
     * @param {number} startYear
     * @param {number} endYear
     * @private
     * @return {void}
     */
    _UpdateSliderProperties(startYear, endYear) {
      this.yearRange = [startYear, endYear];
      this.inputStartYear = startYear.toString();
      this.inputEndYear = endYear.toString();
    },
    /**
     * Handle the date interval change
     * @param {number} startYear
     * @param {number} endYear
     * @param {string} startMonthCode
     * @param {string} endMonthCode
     * @return {void}
     */
    handleDateIntervalChange({startYear, endYear, startMonthCode, endMonthCode}) {
      startYear = parseInt(startYear);
      endYear = parseInt(endYear);
      this.startMonthCode = startMonthCode;
      this.endMonthCode = endMonthCode;

      this._checkYearValidity(startYear, endYear);
      this._UpdateSliderProperties(startYear, endYear);

      // Refresh the filtered data
      this.filterData();
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
<style scoped>
/* Set image banner */
#banner-image::before {
  background-image: url("@/assets/banners/banner_registers_registers_page.png");
}

.box-facets {
  background-color: #f5f5f5;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border: 2px solid #8d1919;
  border-radius: 5px;
  /* make this box fixed when scrolling */
  position: sticky;
  top: 0;

}

.container-slider {
  margin-top: 3rem;
  margin-bottom: 2rem;
}


/* results part */

.totalFounded {
  font-size: 35px;
  font-weight: bold;
  color: #8d1919;
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

.card-navigation-container {
  margin-top: 10px;
  margin-left: 0px;
  width: 83%;
}


</style>

<style>
/***********/
/* Slider style specifics */

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
<!--
<style scoped>

/* Set image banner */
#banner-image::before {
  background-image: url("@/assets/banners/banner_registers_registers_page.png");
}

@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');


/* Facets styles */

.container--facets {
  justify-content: space-between;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: sticky;
}

.container--slider {
  width: 100%;
  margin: 0 auto;
  padding: 5em 0.5em;
}


.container--date--interval > .control > input {
  width: 100px;
  text-align: center;
  font-weight: bold !important;
  /* space between input and label */
  margin: 0 0 0 0;
  padding: 0 0 0 0;

}

.container--date--interval {
  display: flex;
  align-items: center; /* Centre verticalement */
  width: 100px;
  text-align: center;
  font-weight: bold !important;
  margin: 0.5px 10px 0px 40px;
}

.container--nosketch-search {
  padding: 2rem 2.5rem;
  margin: 0 auto 1rem auto;
}

.container--histogram {
  margin-top: -10%;
}

/* Filters and results section */

.input--nosketch {
  width: 300px !important;
}

.totalFounded {
  font-size: 35px;
  font-weight: bold;
  color: #8d1919;
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

.card-navigation-container {
  margin-top: 10px;
  margin-left: 0px;
  width: 83%;
}
</style>-->


<!--
<div class="columns is-multiline">
  <div class="column is-5-desktop is-12-mobile is-12-tablet">
    <div class="container container--facets">
      <p>PÉRIODE DU CONTENU</p>
      <div class="container container--slider">
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
      <div class="container--date--interval">
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
      <div class="container--nosketch-search">
        <p class="control">
          <img src="@/assets/no-sketch-engine-logo.png" alt="Logo" class="image is-24x24">
        </p>
        <p>RECHERCHE NO SKETCH</p>
        <div class="field has-addons">
          <p class="control">
            <input class="input" type="text" placeholder="Entrez un terme" v-model="NoSketchTermSearch">
          </p>
          <p class="control">
            <button class="button is-info" @click="goNoSketchResults">Rechercher</button>
          </p>
        </div>
        <p class="help">Recherche dans le corpus du terme : <i>"{{ NoSketchTermSearch }}"</i> entre
          {{ yearRange[0] }} et {{ yearRange[1] }}</p>
      </div>
      <div class="container container--histogram">
        <RegisterHistogramChart
            :startYearProp="yearRange[0]"
            :endYearProp="yearRange[1]"
            :minYear="minYear"
            :maxYear="maxYear"
        />
      </div>
    </div>
  </div>
  <div class="column">
    <div class="container result-container">
      <p class="resultCanvas">
        <span class="totalFounded">{{ numberOfRegistries }}</span> registre<span v-if="isPlural">s</span>
        disponible<span v-if="isPlural">s</span>
      </p>
    </div>
    <div class="container legend-container">
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
    <div class="container card-navigation-container">
      <RegisterCardNavigation
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
  </div>
</div>-->
