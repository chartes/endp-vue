<template>
  <p><i>Cliquer/survoler pour faire apparaître les événements</i></p>
  <button class="button btn-scroll" @mousedown="startScroll(-50)" @mouseup="stopScroll" :disabled="isAtTop">▲</button>
  <div class="timeline-scroll-container" ref="scrollContainer">
    <div class="timeline-container">
      <div v-for="group in groupedEvents" :key="group.date" class="timeline-item">
        <div @click="togglePopup(group.date)" class="timeline-dot"
             :class="{ 'without-date': group.date === 'date_inconnue', 'dot-selected': selectedDate === group.date }"></div>

        <div :class="['timeline-date', { active: hover === group.date || clicked === group.date }]" @click="togglePopup(group.date)">
          {{ formatDate(group.date) }}
        </div>
        <div v-if="clicked === group.date" class="popup-group">
          <div class="popup-and-navigation" v-for="(event, index) in group.events" :key="event._id_endp">
            <div class="timeline-popup" :style="{ zIndex: activePopupIndex[group.date] === index ? 100 : 99 }"
                 v-show="activePopupIndex[group.date] === index">
              <div class="popup-content">
                <div class="popup-date">☞ {{ event.type }}</div>
                <div class="popup-description">
                <span v-if="event.thesaurus_term_person" class="event-term"><u>{{
                    event.thesaurus_term_person.topic
                  }}</u> : {{ event.thesaurus_term_person.term_fr }} ({{ event.thesaurus_term_person.term_la }})</span>
                  <br v-if="event.thesaurus_term_person">
                  <span v-if="event.place_term" class="event-place"><u>Lieu</u> : {{
                      event.place_term.term_fr
                    }} ({{ event.place_term.term_la }})</span>
                </div>
                <span v-if="event.image_url"><!--icon book --><i class="fas fa-book"></i>
                <router-link :to="`/facsimile/${formatImageIdentifiers(event.image_url)}`" target="_blank"> Aller au Fac-simile</router-link>
              </span>
              </div>
            </div>
            <!-- Carousel Navigation: Shown if there's more than one event -->
            <div v-if="group.events.length > 1" class="popup-navigation" :style="{ zIndex: 101 }">
              <span class="popup-counter">{{ activePopupIndex[group.date] + 1 }}/{{ group.events.length }}</span>
              <button @click="navigateInCarousel(group, -1)" class="button nav-left">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button @click="navigateInCarousel(group, 1)" class="button nav-right">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button class="button btn-scroll" @mousedown="startScroll(50)" @mouseup="stopScroll" :disabled="isAtBottom">▼</button>
  <!--<div class="timeline-legend">
    <span class="legend-item"><span class="dot neutral"></span> Cliquer/Survoler pour faire apparaître</span>
    <span class="legend-item"><span class="dot without-date"></span> Date de l'événement inconnue</span>
  </div>-->
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "PersonDataTimeline",
  props: {
    eventsResponse: {
      required: true,
      default: () => []
    },
  },
  data() {
    return {
      hover: null,
      clicked: null,
      scrollInterval: null,
      isAtTop: true,
      isAtBottom: false,
      activePopupIndex: {},
      selectedDate: null,
    };
  },
  computed: {
    ...mapState(['months', 'mappingSha1VolumesJSON']),
    groupedEvents() {
      const normalizeDate = (date) => {
        return date.length === 4 ? `${date}-01-01` : date; // Normalisation des dates
      };

      let eventsWithDate = Object.values(this.eventsResponse)
          .filter(e => e.date)
          .map(e => ({...e, normalizedDate: normalizeDate(e.date)}))
          .sort((a, b) => new Date(a.normalizedDate) - new Date(b.normalizedDate));

      const eventsWithoutDate = Object.values(this.eventsResponse).filter(e => !e.date);

      // Transformation en tableau pour garder l'ordre
      const groupedArray = [];
      eventsWithDate.forEach(event => {
        const found = groupedArray.find(item => item.date === event.date);
        if (!found) {
          groupedArray.push({
            date: event.date, // Clé pour l'affichage
            events: [event]
          });
        } else {
          found.events.push(event);
        }
      });

      if (eventsWithoutDate.length > 0) {
        groupedArray.push({date: 'Date inconnue', events: eventsWithoutDate});
      }

      return groupedArray;
    },
  },

  mounted() {
    this.$refs.scrollContainer.addEventListener('scroll', this.handleScroll);
    this.$refs.scrollContainer.addEventListener('wheel', this.handleWheel, {passive: false});
  }
  ,
  methods: {
    /**
     * Navigate in the timeline's popup like a carousel
     * @param group
     * @param direction
     * @returns {void}
     */
    navigateInCarousel(group, direction) {
      console.log(group)
      console.log('navigateInCarousel',group.events);
      const totalEvents = group.events.length;
      let currentIndex = this.activePopupIndex[group.date] || 0;
      let newIndex = currentIndex + direction;
      if (newIndex >= totalEvents) {
        newIndex = 0;
      } else if (newIndex < 0) {
        newIndex = totalEvents - 1;
      }
      this.activePopupIndex[group.date] = newIndex;
      this.activePopupIndex = {...this.activePopupIndex};
    }
    ,
    /**
     * Prevents scrolling the page when scrolling the timeline
     * @param event
     */
    handleWheel(event) {
      event.preventDefault();
    }
    ,

    /**
     * Format the image identifiers to match the facsimile route
     * @param identifiers
     * @returns {string}
     */
    formatImageIdentifiers(identifiers) {
      if (!identifiers) return '';
      /*"image_url": "LL108B;FRAN_0393_00301.tif;f698da8e09f4e6ca97db5856f0527d2ac81c65e2" */
      const parts = identifiers.split(';');
      return `${parts[0]}/${this.mappingSha1VolumesJSON[parts[2]].canvas_index}`;
    }
    ,

    /**
     * Handle the scroll event to know if the user is at the top or bottom of the timeline
     */
    handleScroll() {
      this.isAtTop = this.$refs.scrollContainer.scrollTop === 0;
      this.isAtBottom = this.$refs.scrollContainer.scrollHeight - this.$refs.scrollContainer.scrollTop === this.$refs.scrollContainer.clientHeight;
    }
    ,

    /**
     * Toggle the popup of an event
     * @param amount
     */
    startScroll(amount) {
      this.stopScroll();
      this.scroll(amount);
      this.scrollInterval = setInterval(() => this.scroll(amount), 100);
    }
    ,

    /**
     * Stop the scrolling
     */
    stopScroll() {
      clearInterval(this.scrollInterval);
    }
    ,

    /**
     * Scroll the timeline
     * @param amount
     */
    scroll(amount) {
      const container = this.$refs.scrollContainer;
      if (container) {
        container.scrollBy({top: amount, behavior: 'smooth'});
      }
    }
    ,

    /**
     * Format the date to display it in the timeline
     * @param date
     * @returns {string}
     */
    formatDate(date) {
      if (!date) return 'Date non renseignée';

      const parts = date.split('-');
      let formattedDate = '';

      if (parts[0]) {
        formattedDate = parts[0]; // Année
      }
      if (parts[1]) {
        const month = this.$store.state.months.find(m => m.iso_code === parts[1]);
        const monthName = month ? month.name : '';
        formattedDate = monthName + (formattedDate ? ` ${formattedDate}` : '');
      }
      if (parts[2]) {
        formattedDate = `${parts[2]} ${formattedDate}`; // Jour
      }
      return formattedDate;
    }
    ,

    /**
     * Toggle the popup of an event
     * @param date
     */
    togglePopup(date) {
      if (this.clicked === date) {
        this.clicked = null; // Ferme le groupe si déjà ouvert
        this.selectedDate = null; // Désélectionne le dot
      } else {
        this.clicked = date;
        this.selectedDate = date; // Sélectionne le nouveau dot
        this.activePopupIndex[date] = this.activePopupIndex[date] || 0;
      }
    }
    ,
  }
}
;
</script>

<style scoped>
.timeline-container {
  position: relative;
  width: 2px;
  background: #333;
  margin: 1rem 10rem;
  height: 100%;
}

.timeline-item {
  position: relative;
  width: 100%;
  height: 60px;
}

.timeline-date {
  right: 2rem;
  bottom: 1.5rem;
  white-space: nowrap;
  font-weight: bold;
  position: absolute;
  cursor: pointer;
}

.timeline-dot {
  position: absolute;
  width: 20px;
  height: 20px;
  background: #FFFFFF;
  border-radius: 50%;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid #333;
}

.timeline-dot:hover {
  transform: translateX(-50%) scale(1.5);
  background: #BB062D;
}

.dot-selected {
  background: #BB062D;
}


.timeline-popup {
  position: absolute;
  left: 30px;
  top: -10px;
  min-width: 200px;
  background: #FFFFFF;
  padding: 0.5rem;
  border: 1px solid #333;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.timeline-date::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: black;
  transform: scaleX(0);
  transform-origin: bottom left;
  transition: transform 0.5s ease-in-out;
}

.timeline-date.active::after, .timeline-date:hover::after {
  transform: scaleX(1);
}

.popup-date {
  font-weight: bold;
}

.popup-description {
  margin-top: 5px;
}

.timeline-scroll-container {
  max-height: 30rem;
  padding: 2rem;
  overflow-y: auto;
  width: 80%;
}

.timeline-dot.without-date {
  background: #1F618D;
}

.timeline-legend {
  margin-top: 0.5rem;
  margin-right: 1rem;
  margin-bottom: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.legend-item .dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.5rem;
}

.legend-item .dot.with-date {
  background: #BB062D;
}

.legend-item .dot.without-date {
  background: #1F618D;
}

.legend-item .dot.neutral {
  background: #333;
}

.btn-scroll {
  margin-top: 1rem;
  bottom: 1rem;
  right: 1rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #BB062D;
  color: #FFFFFF;
  border: none;
  outline: none;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.popup-navigation {
  position: absolute;
  right: -22rem;
  top: -3rem;
  bottom: 0;
  display: flex;
  align-items: center;
}


.popup-counter {
  margin-right: 10px;
  font-weight: bold;
}

.nav-left, .nav-right {
  /* create a red circle  and space between */
  margin: 0 0.5rem 0 1.3rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #BB062D;
  color: #FFFFFF;
  border: none;
  outline: none;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);

}

.popup-and-navigation {
  display: flex;
  justify-content: space-between; /* ou 'flex-end' selon votre structure exacte */
  align-items: center;
}

.popup-navigation {
  margin-left: auto; /* pousse la navigation à l'extrémité droite du conteneur flex */
}
</style>