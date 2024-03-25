<template>
  <div class="box box-histogram">
    <div id="histogram"></div>
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist';
import {mapState} from "vuex";

export default {
  name: 'RegisterHistogramChartBox',
  props: {
    startYearProp: {
      type: Number,
      default: 1326,
      required: true
    },
    endYearProp: {
      type: Number,
      default: 1504,
      required: true
    }
  },
  data() {
    return {
      startYear: 1326,
      endYear: 1504,
      minYear: 1326,
      maxYear: 1504,
      pagesByYear: {}
    };
  },
  computed: {
    ...mapState(['navByDatesJSON'])
  },
  mounted() {
    this.calculatePagesByYear();
    this.plotHistogram();
  },
  watch: {
    startYearProp() {
      this.startYear = this.startYearProp;
      this.updateChartColors();
    },
    endYearProp() {
      this.endYear = this.endYearProp;
      this.updateChartColors();
    }
  },
  methods: {
    /**
     * Calculate the total number of pages for each year
     * @returns {void}
     */
    calculatePagesByYear() {
      Object.keys(this.navByDatesJSON).forEach(key => {
        const year = key.split('-')[0]; // Split the key and get the year
        const pages = this.navByDatesJSON[key].reduce((total, record) => {
          return total + (record.lastPageCanvasIdx - record.firstPageCanvasIdx + 1);
        }, 0);

        if (!this.pagesByYear[year]) {
          this.pagesByYear[year] = pages;
        } else {
          this.pagesByYear[year] += pages;
        }
      });
    },

    /**
     * Plot the histogram
     * @returns {void}
     */
    plotHistogram() {
      const trace = {
        x: Object.keys(this.pagesByYear),
        y: Object.values(this.pagesByYear),
        type: 'bar',
        marker: {color: '#8d1919'}
      };

      const layout = {
        title: '',
        xaxis: {
          title: '',
          tickmode: 'linear',
          dtick: 10,
          showline: false
        },
        yaxis: {
          title: ''
        },
        uirevision: false,
        displayModeBar: false
      };

      const graph = document.getElementById('histogram');
      Plotly.newPlot(graph, [trace], layout, {responsive: true, displayModeBar: false});
      graph.on('plotly_relayout', () => {
        const xaxis = graph.layout.xaxis;
        if (xaxis.range) {
          this.startYear = Math.max(this.minYear, Math.min(this.maxYear, Math.floor(xaxis.range[0])));
          this.endYear = Math.max(this.minYear, Math.min(this.maxYear, Math.floor(xaxis.range[1])));
        }
      });

    },

    /**
     * Update the colors of the histogram bars based on the start and end year
     * @returns {void}
     */
    updateChartColors() {
      const years = Object.keys(this.pagesByYear);
      const graph = document.getElementById('histogram');
      const colors = years.map(year => {
        return (year >= this.startYear && year <= this.endYear) ? '#8d1919' : 'lightgrey';
      });
      if (graph) {
        Plotly.restyle(graph, 'marker.color', [colors], [0], {duration: 500, easing: "linear"});
      }
    }
  }
};
</script>

<style scoped>
#histogram {
  max-width: 580px;
  margin: -50px -50px 0 -40px;
  padding: 0 1px 0 1px;
}
:deep(.main-svg) {
  background-color: transparent !important;
}

@media screen and (max-width: 1015px) {
  #histogram {
    margin: 0 -50px;
    max-width: 150%;
    padding: 0 1px 0 1px;
  }
}

@media screen and (max-width: 970px) {
  #histogram {
    margin: 0 0 0 -50px;
    max-width: 160%;
    padding: 0 1px 0 1px;
  }
}

@media screen and (max-width: 850px) {
  #histogram {
    margin: 0 0 0 -50px;
    width: 120%;
    padding: 0 1px 0 1px;
  }
}
</style>
