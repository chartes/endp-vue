<template>
  <!-- Banner -->
  <div id="banner-image" class="container is-fluid"></div>
  <!-- end banner -->

  <div class="page-title">
    <h1>Registres</h1>
  </div>

  <!-- Main grid  -->
  <div class="columns is-multiline" :class="{ 'facets-box-collapsed' : isFacetsBoxCollapsed }">

    <!-- Filters column (facets, histogram etc.) -->
    <div class="column box-facets-column is-12-mobile is-5-tablet is-5-desktop">

      <!-- Filters toggle for mobile -->
      <a class="collapse-facets-box-toggle" @click="_collapseFacetsBox()">Filtres</a>

      <!-- Create a single component for this box facets ? -->
      <div class="box box-facets" >
        <!-- Date slider container -->
        <p class="subtitle is-5">Dates</p>
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
        </div>

        <!-- Date interval box -->
        <RegisterDateIntervalBox
            :start-month-code="startMonthCode"
            :end-month-code="endMonthCode"
            :yearRange="yearRange"
            @date-change="handleDateIntervalChange"
        />

        <!-- Reset button -->
        <button class="button is-outlined btn-reset-date" @click="handleResetSlider">
          <!-- icon reset --> <i class="fas fa-undo"></i>
        </button>

        <!-- NoSketch Engine search box -->
        <RegisterNoSketchSearchBox
            :year-range="yearRange"
        />

        <!-- Mobile : results count on facets box -->
        <div class="mobile-total-of-registers">
          <RegisterMetadataBox
              :total-of-registers="totalRegisters"
              :with-legend="false"
              class="register-meta-box"
          />

          <!-- Filters close button for mobile -->
          <a class="collapse-facets-box-close" @click="_collapseFacetsBox()">Voir</a>
        </div>

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
    <div class="column column-results is-12-mobile is-7-tablet is-7-desktop">

      <div  class="collapse-facets-box-toggle-wrapper">
        <a class="collapse-facets-box-toggle" @click="_collapseFacetsBox()">Filtres</a>
      </div>

      <div class="column-results-header">
        <RegisterMetadataBox
            :total-of-registers="totalRegisters"
            :with-legend="false"
            class="register-meta-box"
        />
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
            :yearFirstPage="cardData.year_first"
            :yearLastPage="cardData.year_last"
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
    ...mapState(['months', 'navByDatesJSON', 'metadataVolumesJSON']),

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
      return Object.entries(this.metadataVolumesJSON).reduce((acc, [volumeKey, volumeInfo]) => {
        if (filteredGroupedData[volumeKey]) {
          const volumeData = filteredGroupedData[volumeKey];
          const firstData = volumeData[0];
          const lastData = volumeData[volumeData.length - 1];
          acc.push({
            volumeID: firstData.volume,
            label: volumeInfo.label,
            firstPage: firstData.firstPage,
            lastPage: lastData.lastPage,
            year_first: firstData.date.split('-')[0],
            year_last: lastData.date.split('-')[0],
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
     * Collapse Facets Box
     * @returns {void}
     * @private
     */
    _collapseFacetsBox() {
      this.isFacetsBoxCollapsed = ! this.isFacetsBoxCollapsed;

      // Scroll Page to the top
      window.scrollTo(0, 0);
    },
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
      return Object.entries(this.navByDatesJSON)
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
.page-title, #banner-image::before {
  background-image: url("@/assets/banners/banner-registers.png");
}

.columns {
  gap: var(--column-gap-desktop);
}

.columns .column:first-child {
  width: 465px;
  background-color: var(--panel-bg-color);
  padding: 15px 0 23px;
}

.columns.facets-box-collapsed .column:first-child {
  display: none;
}

.columns .column:last-child {
  width: calc(100% - 50px - 465px);
  background-color: var(--panel-bg-color);
  padding: 0 32px var(--right-column-bottom-padding-desktop);
}

.columns.facets-box-collapsed .column:last-child {
  width: 100%;
}

.column-results-header {
  position: sticky;
  top:52px;
  z-index: 1;
  width: 100%;
  height: 272px;
  padding-top: 25px;
  background-color: var(--panel-bg-color);
}

.collapse-facets-box-toggle {
  display: inline-block;
  width: 25px;
  height: 25px;
  background-image: url("@/assets/images/b_openW.svg");
  text-indent: -9999px;
  margin-top: 25px;
}

.box-facets-column .collapse-facets-box-toggle {
  display: none;
}

.columns.facets-box-collapsed .collapse-facets-box-toggle {
  background-image: url("@/assets/images/b_closeW.svg");
}


/* facets part */

.box-facets {
  padding: 74px 0 0;
  position: sticky;
  top: 0;
}

.box-facets > p {
  padding: 0 20px;
}

.box-facets > .box-container-facets__date-interval,
.box-facets > .container-slider {
  padding: 0 40px;
}

.box-facets > .box-histogram {
  padding: 0 10px;
}

.mobile-total-of-registers {
  display: none;
}

.subtitle {
  display: block;
  margin-bottom: 75px;

  font-size: 24px;
  font-weight: 400;
  font-style: italic;
  color: #272727;
}

.container-slider {
  margin-top: 3rem;
  margin-bottom: 30px;
}

.btn-reset-date {
  position: relative;
  left: 50%;
  transform: translateX(-50%);

  width: 40px;
  height: 40px;
  margin-bottom: 0.3rem;
  background: url("@/assets/images/b_Recherche_reset.svg") center / cover;
  border: none;
}

.btn-reset-date:focus {
  outline: none;
  box-shadow: none;
}

.btn-reset-date:hover {
  background-image: url("@/assets/images/b_Recherche_reset_over.svg");
}

.btn-reset-date .fa-undo {
  display: none;
}

/* results part */

.card-navigation-container {
  width: 100%;
  margin: 0 0 45px;
}

@media screen and (max-width: 1024px) {

  #banner-image::before {
    background-color: #000000CC;
    background-image: none !important;
  }

  .columns {
    flex-direction: column;
    padding: 0 !important;
    position: relative;
  }

  .columns .column {
    padding: 20px var(--mobile-side-padding) var(--right-column-bottom-padding-mobile) !important;
  }

  .columns .column:first-child {
    display: block;
    width: 100%;
    border-bottom: solid 1px #D0D0D0;
  }

  .columns.facets-box-collapsed .column:first-child {
    display: none;
  }

  .columns.facets-box-collapsed .column.column-results,
  .columns .column.column-results {
    width: 100% !important;
    background-color: #ffffff;
  }

  .box-facets {
    position: relative;
    padding-top: 20px;
  }

  .box-facets > .box-container-facets__date-interval,
  .box-facets > .container-slider {
    padding: 0 40px;
  }

  .box-facets > p {
    padding: 0;
  }

  .column-results .collapse-facets-box-toggle {
    display: none;
  }

  .box-facets-column .collapse-facets-box-toggle {
    display: block;
  }

  .collapse-facets-box-toggle {
    font-family: var(--font-secondary);
    font-size: 18px;
    font-weight: 400;
    line-height: 1;
    text-transform: uppercase;
    text-indent: 0;
    margin: 0;
  }

  .box-facets-column .collapse-facets-box-toggle {
    position: relative;
    display: block;
    width: calc(100% - 2 * var(--mobile-side-padding));
    height: auto;
    padding: 8px 0;
    background: transparent url('~@/assets/images/b_Close_liste.svg') right 20px center / 30px auto no-repeat;
    box-sizing: border-box;
    color: #303030;
  }

  .columns:not(.facets-box-collapsed) .box-facets-column {
    padding-top: 0 !important;
  }

  .columns:not(.facets-box-collapsed) .box-facets-column  .collapse-facets-box-toggle {
    position: sticky;
    top: 102px;
    z-index: 10;
  }

  .columns:not(.facets-box-collapsed) .collapse-facets-box-toggle {
    width: 100vw;
    background-color: #FFF;
    box-sizing: border-box;
    transform: translateX(-25px);
    margin-top: 0;
    padding: 30px;
  }

  .columns.facets-box-collapsed .collapse-facets-box-toggle-wrapper {
    position: sticky;
    top:102px;
    z-index: 10;
    width: 100vw;
    max-width: 100%;
    padding: 20px 0;
    margin: -20px 0;
    background-color: #FFF;
  }

  .columns.facets-box-collapsed .collapse-facets-box-toggle {
    display: inline-block;
    width: auto;
    height: auto;
    padding: 8px 32px;
    background-color: #7B0C12;
    background-image: none;
    border-radius: 4px;
    color: #ffffff;
  }

  .column-results-header {
    position: relative;
    background: #FFF;
  }

  .columns.facets-box-collapsed {
    margin-top: -80px;
  }

  .columns.facets-box-collapsed .column-results-header {
    height: 228px;
  }

  .columns:not(.facets-box-collapsed) .column-results-header {
    position: unset;
    height: 0;
  }

  .columns:not(.facets-box-collapsed) .column-results .register-meta-box,
  .columns:not(.facets-box-collapsed) .card-navigation-container {
    display: none;
  }

  .mobile-total-of-registers {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding-top: 10px;
    border-bottom: solid 1px #D0D0D0;
    padding-bottom: 30px;
  }

  .mobile-total-of-registers a.collapse-facets-box-close {
    background-color: #303030;
    border-radius: 2px;
    padding: 10px 70px;

    font-family: var(--font-secondary);
    font-size: 18px;
    color: #FFFFFF;
    text-align: center;
    font-weight: 500;
    text-transform: uppercase;
  }

  .mobile-total-of-registers a.collapse-facets-box-close:hover {
    background-color: var(--light-brown-alt);
  }

  :deep(.box-facets .register-meta-box) {
    padding: 0;
  }

  :deep(.box-facets .register-meta-box .result-container-total) {
    border-bottom: none;
    margin: 0;
    padding: 0;
  }

  :deep(.box-facets .register-meta-box .resultCanvas) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .card-navigation-container {
    max-width: 100%;
    margin: 50px 0 25px;
  }
}

</style>