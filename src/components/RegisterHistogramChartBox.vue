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
      const finalYValues = Object.values(this.pagesByYear);

      const trace = {
        x: Object.keys(this.pagesByYear),
        y: finalYValues,
        type: 'bar',
        text: "",
        hoverinfo: 'text',
        marker: {color: '#ad464b'}
      };

      const layout = {
        title: '',

        xaxis: {
          title: '',
          tickmode: 'linear',
          dtick: 10,
          showline: false,
          fixedrange: true,
        },
        yaxis: {
          title: '',
          autoRange: true,
          fixedrange: true,
        },
        font: {
          size: 13,
          family: 'Libre Baskerville, sans-serif',

        },
        annotations: [{
          xref: 'paper',
          yref: 'paper',
          x: 0,
          xanchor: 'right',
          y: 1,
          yanchor: 'bottom',
          text: 'Pages',
          showarrow: false,
          font: {
            size: 14,
            family: 'Libre Baskerville, sans-serif',
            weight: 'bold',
          }
        }],
        uirevision: false,
        displayModeBar: false
      };

      const graph = document.getElementById('histogram');
      Plotly.newPlot(graph, [trace], layout, {responsive: true, displayModeBar: false});

      // Initial configuration for the animation : set all values of the y-axis to 0
      const animationStart = {
        data: [{y: finalYValues.map(() => 0)}], // All values set to 0 for the initial state
      };

      const animationEnd = {
        data: [{y: finalYValues}],
        traces: [0],
        layout: {}
      };

      const animationOptions = {
        transition: {
          duration: 1000,
          easing: "cubic-in-out"
        },
        frame: {
          duration: 1000
        }
      };

      Plotly.animate(graph, animationStart, {transition: {duration: 0}})
          .then(() => Plotly.animate(graph, animationEnd, animationOptions))
          .then(() => {
            const text = Object.entries(this.pagesByYear).map(([year, pages]) => `${pages} page(s) pour ${year}`);
            Plotly.restyle(graph, {
              text: [text],
              hoverinfo: ['text']
            });
          });

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
        return (year >= this.startYear && year <= this.endYear) ? '#ad464b' : 'lightgrey';
      });
      if (graph) {
        Plotly.restyle(graph, 'marker.color', [colors], [0], {duration: 500, easing: "cubic-in-out"});
      }
    }
  }
};
</script>

<style scoped>
#histogram {
  max-width: 580px;
  margin: -50px -50px 0 -40px;
  padding: 0 0.1px 0 10px;
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
