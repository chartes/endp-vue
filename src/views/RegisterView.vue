<template>
  <!-- Banner -->
  <div id="banner-image" class="container is-fluid">
    <h1 class="title">Accéder aux registres</h1>
  </div>
  <!-- end banner -->
  <!-- Main grid  -->
  <div class="columns is-multiline">
    <!-- Filters column (facets, histogram etc.) -->
    <div class="column is-12-mobile is-5-tablet is-5-desktop">
      <!-- Create a single component for this box facets ? -->
      <div class="box box-facets" >
        <!-- Date slider container -->
        <p class="subtitle is-5">Période du contenu</p>
        <div class="container-slider">
          <VueSlider
              class="slider-component"
              v-model="yearRange"
              @change="handleDateInput"
              :min="minYear"
              :max="maxYear"
              :tooltip="'always'"
              :enable-cross="false"
              :process="true"
              :lazy="true"
          />
          <button class="button is-outlined btn-reset-date" @click="handleResetSlider">
            <!-- icon reset --> <i class="fas fa-undo"></i></button>
        </div>
        <!-- Date interval box -->
        <RegisterDateIntervalBox
            :start-month-code="startMonthCode"
            :end-month-code="endMonthCode"
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
      <RegisterMetadataBox
          :total-of-registers="totalRegisters"
      />
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
import {mapState} from "vuex";
import VueSlider from 'vue-slider-component';


import RegisterNoSketchSearchBox from "@/components/RegisterNoSketchSearchBox.vue";
import RegisterDateIntervalBox from "@/components/RegisterDateIntervalBox.vue";
import RegisterHistogramChartBox from "@/components/RegisterHistogramChartBox.vue";
import RegisterMetadataBox from "@/components/RegisterMetadataBox.vue";
import RegisterCardNavigation from "@/components/RegisterCardNavigation.vue";

import 'vue-slider-component/theme/default.css';
import '@/assets/css/slider_custom.css';

export default {
  components: {
    RegisterMetadataBox,
    RegisterHistogramChartBox,
    RegisterNoSketchSearchBox,
    RegisterDateIntervalBox,
    RegisterCardNavigation,
    VueSlider,
  },
  data() {
    return {
      yearRange: [1326, 1504],
      minYear: 1326,
      maxYear: 1504,
      startMonthCode: '01',
      endMonthCode: '12',
      inputStartYear: '',
      inputEndYear: '',
      isFacetsBoxCollapsed: false,
    };
  },
  mounted() {
    [this.inputStartYear, this.inputEndYear] = this.yearRange;
  },
  computed: {
    ...mapState(['months', 'endpData', 'endpVolumesData']),

    totalRegisters() {
      return this.updatedCardData.length;
    },

    filteredAndGroupedData() {
      return this._getFirstAndLastEntriesPerVolume(
          this._groupByVolume(
              this._filterDataByDate()
          )
      );
    },

    updatedCardData() {
      const filteredGroupedData = this.filteredAndGroupedData;
      // retrieve data according to the volumes filtered and grouped by volume for
      // a specific interval of date
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
            period: `${this._formatDateToMonthYear(firstData.date)} - ${this._formatDateToMonthYear(lastData.date)}`,
            isEdited: volumeInfo.params.isEdited,
            facSimile: volumeInfo.params.facSimile,
          });
        }
        return acc;
      }, []);
    },
  },
  watch: {
    'startMonthCode': {
      handler: function (newVal) {
        if (this._isYearsInRangeEquals() && this.endMonthCode < newVal) {
          this.endMonthCode = newVal;
        }
      },
      immediate: true,
      deep: true
    },
    'endMonthCode': {
      handler: function (newVal) {
        if (this._isYearsInRangeEquals() && this.startMonthCode > newVal) {
          this.startMonthCode = newVal;
        }
      },
      immediate: true,
      deep: true
    },
    'yearRange': {
      handler: function (newVal) {
        this.inputStartYear = newVal[0].toString();
        this.inputEndYear = newVal[1].toString();
        if (newVal[0] > newVal[1]) {
          this.startMonthCode = '01';
          this.endMonthCode = '12';
        } else if (newVal[0] === newVal[1]) {
          if (this.startMonthCode > this.endMonthCode) {
            this.endMonthCode = this.startMonthCode;
          }
        }
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    /**
     * Test if years in range are equals
     * @returns {boolean}
     * @private
     */
    _isYearsInRangeEquals() {
      return this.yearRange[0] === this.yearRange[1];
    },

    /**
     * Filter registers by input date
     * interval into JSON data
     * @private
     * @returns {[string, unknown][]}
     */
    _filterDataByDate() {
      return Object.entries(this.endpData)
          .filter(([date]) => date >= this._formatDateIso(
                  this.startMonthCode,
                  this.yearRange[0]
              ) && date <= this._formatDateIso(
                  this.endMonthCode,
                  this.yearRange[1]
              )
          );
    },

    /**
     * Group registers by volume
     * @param filteredData
     * @private
     * @returns {*}
     */
    _groupByVolume(filteredData) {
      return filteredData.reduce((groupedByVolume, [date, dataEntries]) => {
        dataEntries.forEach(dataEntry => {
          const volume = dataEntry.volume;
          if (!groupedByVolume[volume]) {
            groupedByVolume[volume] = [];
          }
          groupedByVolume[volume].push({date, ...dataEntry});
        });
        return groupedByVolume;
      }, {});
    },

    /**
     * Get the first and last entries per volume
     * according to extreme dates
     * @param groupedByVolume
     * @private
     * @returns {*}
     */
    _getFirstAndLastEntriesPerVolume(groupedByVolume) {
      return Object.keys(groupedByVolume).reduce((result, volume) => {
        const entries = groupedByVolume[volume];
        result[volume] = [entries[0], entries[entries.length - 1]];
        return result;
      }, {});
    },

    /**
     * Retrieve the month name from the month code
     * @param {string} monthCode
     * @private
     * @return {string}
     */
    _getMonthName(monthCode) {
      const month = this.months.find(m => m.iso_code === monthCode);
      return month ? month.name : '';
    },

    /**
     * Format the date to ISO format (ex: 01,1456 => 1456-01)
     * @param {string} month_code
     * @param {number} year
     * @private
     * @return {string}
     */
    _formatDateIso(month_code, year) {
      return `${year.toString()}-${month_code.toString()}`;
    },

    /**
     * Format the date to month year format (ex: 1456-01 => Janvier 1456)
     * @param {string} dateString
     * @private
     * @return {string}
     */
    _formatDateToMonthYear(dateString) {
      let [year, monthCode] = dateString.split('-');
      return `${this._getMonthName(monthCode)} ${year}`;
    },

    /**
     * Check if the given years are valid (not null, not NaN, between minYear and maxYear)
     * @param {number} startYear
     * @param {number} endYear
     * @private
     * @return {Array<number>}
     */
    _checkYearsValidity(startYear, endYear) {
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
      return [startYear, endYear];
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
     * @public
     * @return {void}
     */
    handleDateIntervalChange({startYear, endYear, startMonthCode, endMonthCode}) {
      this.startMonthCode = startMonthCode;
      this.endMonthCode = endMonthCode;

      let years = this._checkYearsValidity(startYear, endYear);

      this._UpdateSliderProperties(years[0], years[1]);
    },

    /**
     * Handle the reset slider event
     * @public
     * @return {void}
     */
    handleResetSlider() {
      this._UpdateSliderProperties(this.minYear, this.maxYear);
      this.startMonthCode = '01';
      this.endMonthCode = '12';
    },

    /**
     * Handle the date input in format accepted by the slider
     * when the user change the date input
     * @public
     * @returns {(string|number)[]}
     */
    handleDateInput() {
      return [this.startMonthCode, this.yearRange[0], this.endMonthCode, this.yearRange[1]];
    },
  }
};
</script>

<style scoped>
/* Set image banner */
#banner-image::before {
  background-image: url("@/assets/banners/banner-registers_page.jpg");
}

/* facets part */

.box-facets {
  background-color: #f5f5f5;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border: 2px solid #8d1919;
  border-radius: 5px;
  position: sticky;
  top: 0;
}

.container-slider {
  margin-top: 3rem;
  margin-bottom: 1rem;
}

.btn-reset-date {
  margin-top: 1rem;
  margin-bottom: 0.3rem;
}

.btn-reset-date:hover {
  background-color: #8d1919;
  color: white;
}

/* results part */

.card-navigation-container {
  margin-top: 10px;
  margin-left: 0px;
  width: 83%;
}
</style>