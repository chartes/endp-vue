<template>
  <div class="box-container-facets__date-interval">
    <span class="box-date-interval__label">Entre</span>
    <div class="control has-icons-left">
      <div class="select select-month">
        <select v-model="start_month_code" class="uppercase" @change="onDateInputChange">
          <option v-for="month in months" :key="month.iso_code" :value="month.iso_code">
            {{ month.name }}
          </option>
        </select>
        <span class="icon is-left"><i class="fas fa-calendar-alt"></i></span>
      </div>
    </div>
    <div class="control control-input-date">
      <input class="input" type="text" @change="onDateInputChange" v-model="input_start_year">
    </div>
    <span class="box-date-interval__label">Et</span>
    <div class="control has-icons-left">
      <div class="select select-month">
        <select v-model="end_month_code" class="uppercase" @change="onDateInputChange">
          <option v-for="month in months" :key="month.iso_code" :value="month.iso_code"
                  :disabled="shouldDisableEndMonthOption(month.iso_code)">
            {{ month.name }}
          </option>
        </select>
        <span class="icon is-left"><i class="fas fa-calendar-alt"></i></span>
      </div>
    </div>
    <div class="control control-input-date">
      <input class="input" type="text" @change="onDateInputChange" v-model="input_end_year">
    </div>
  </div>
</template>

<script>
export default {
  name: "DateIntervalBoxSelectorBox",
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
      months: this.$store.state.months,
    };
  },
  watch: {
    yearRange: {
      handler: function (newVal) {
        if (newVal[0] > newVal[1]) {
          this.input_start_year = newVal[1];
          this.input_end_year = newVal[0];
        }else {
          this.input_start_year = newVal[0];
          this.input_end_year = newVal[1];
        }
      },
      deep: true,
      immediate: true,
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
     */
    onDateInputChange() {
      this.$emit('date-change', {
        startYear: this.input_start_year,
        endYear: this.input_end_year,
        startMonthCode: this.start_month_code,
        endMonthCode: this.end_month_code
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
  /* space between the date interval box and the other facets */
  margin-bottom: 1rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* augment size of the date interval box */
  padding: 1rem;
  border: 0.5px solid #0a0a0a;
  border-radius: 5px;
}

.box-container-facets__date-interval > * {
  position: relative;
  /* space between elements in the date interval box */
  margin-right: 0.3rem;
  /* align elements horizontally */
  display: inline-block;
  /* align elements vertically */
  vertical-align: middle;
  margin-bottom: 1rem;
  margin-top: 1rem;
  overflow: hidden;
}

.select-month {
  width: 100%
}

.control-input-date {
  width: 15%;
  margin-bottom: 1rem;
}
</style>