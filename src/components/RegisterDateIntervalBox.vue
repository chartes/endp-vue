<template>
  <div class="box-container-facets__date-interval">
    <div>
      <span class="box-date-interval__label">Entre</span>
      <RegisterBaseDateSelector
        :monthCode="start_month_code"
        :year="input_start_year"
        :mode-range="'start'"
        @date-change-selector="onDateInputChange"
      />
    </div>
    <div>
      <span class="box-date-interval__label">Et</span>
      <RegisterBaseDateSelector
        :monthCode="end_month_code"
        :year="input_end_year"
        :mode-range="'end'"
        :should-disable-option="shouldDisableEndMonthOption"
        @date-change-selector="onDateInputChange" />
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import RegisterBaseDateSelector from "@/components/RegisterBaseDateSelector.vue";
export default {
  name: "DateIntervalBoxSelectorBox",
  components: {
    RegisterBaseDateSelector
  },
  props: {
    /**
     * Start month ISO code
     * @values 01 (January) by default
     */
    startMonthCode: {
      type: String,
      default: "01",
      required: false,
    },
    /**
     * End month ISO code
     * @values 12 (December) by default
     */
    endMonthCode: {
      type: String,
      default: "12",
      required: false,
    },
    /**
     * Year range (given by the parent component - slider)
     */
    yearRange: {
      type: Array,
      default: () => [],
      required: true
    },
  },
  data() {
    return {
      start_month_code: '',
      end_month_code: '',
      input_start_year: '',
      input_end_year: '',
      input_month_code: '',
    };
  },
  computed: {
    ...mapState(['months'])
  },
  watch: {
    yearRange: {
      handler(newVal) {
        this.input_start_year = newVal[0] <= newVal[1] ? newVal[0] : newVal[1];
        this.input_end_year = newVal[0] <= newVal[1] ? newVal[1] : newVal[0];
      },
      immediate: true,
      deep: true,
    },
    startMonthCode: {
      handler: function (newVal) {
        this.start_month_code = newVal;
      },
      immediate: true,
      deep: true,
    },
    endMonthCode: {
      handler: function (newVal) {
        this.end_month_code = newVal;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    /**
     * Triggers when year inputs and month selectors change
     * @param {string} year
     * @param {string} monthCode
     * @param {string} modeRange
     * @emits date-change
     * @event date-change
     * @return void
     */
    onDateInputChange({year, monthCode, modeRange}) {
      this.$emit('date-change', {
        startYear: modeRange === 'start' ? year : this.input_start_year,
        endYear: modeRange === 'end' ? year : this.input_end_year,
        startMonthCode: modeRange === 'start' ? monthCode : this.start_month_code,
        endMonthCode: modeRange === 'end' ? monthCode : this.end_month_code,
      });
    },

    /**
     * Deactivate month options in month selector if the year range is the same
     * and the month code is lower than the start month code
     *
     * @param {string} monthCode
     * @returns {boolean}
     */
    shouldDisableEndMonthOption(monthCode) {
      return this.yearRange[0] === this.yearRange[1] && monthCode < this.start_month_code;
    },
  }
};
</script>

<style scoped>
.box-container-facets__date-interval {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;
}

.box-container-facets__date-interval > * {
  position: relative;
  display: inline-block;
  flex: 50% 0 0;
  vertical-align: middle;
  overflow: hidden;
}

.box-date-interval__label {
  display: block;
  padding-left: 4px;
  margin-bottom: 10px;
  font-family: var(--font-secondary);
  font-size: 18px;
  font-weight: 500;
  line-height: 1.2;
  color: #272727;
  text-transform: uppercase;
}


@media screen and (max-width: 1024px) {

  .box-container-facets__date-interval {
    flex-direction: column;
  }

  .box-date-interval__label {
    text-align: center;
  }

  .box-container-facets__date-interval > * {
    width: 100%;
    text-align: center;
  }
}

</style>