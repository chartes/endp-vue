<template>
  <div class="timeline-parent" :class="{ 'timeline-collapsed' : isTimelineCollapsed }">
    <button class="button button-toggle" @click="_collapseTimeline()">VOIR</button>

    <div class="timeline-legend">
      <span class="legend-item"><span class="dot neutral"></span> Cliquer pour afficher l'événement</span>
      <!--<span class="legend-item"><span class="dot without-date"></span> Date de l'événement inconnue</span>-->
    </div>
    <button class="button btn-scroll btn-scroll-up" @mousedown="startScroll(-100)" @mouseup="stopScroll"
            :disabled="isAtTop"></button>
    <div class="timeline-scroll-container" ref="scrollContainer">
      <div class="timeline-container">
        <div v-for="group in groupedEvents" :key="group.date" class="timeline-item" :class="{ 'dot-selected': selectedDate === group.date }">
          <div @click="togglePopup($event, group.date)" class="timeline-dot"
               :class="{ 'without-date': group.date === 'date_inconnue' || group.date === 'Date inconnue' }"></div>

          <div :class="['timeline-date', { active: hover === group.date || clicked === group.date }]"
               @click="togglePopup($event, group.date)">
            {{ formatDate(group.date) }}
          </div>
          <div v-if="clicked === group.date" class="popup-group">
            <div class="popup-group-content" ref="timelinePopup">

              <div class="popup-and-navigation"
                   v-for="(event, index) in group.events"
                   :key="event._id_endp"
                   :class="{ 'is-active': activePopupIndex[group.date] === index }">
                <div class="timeline-popup"
                     v-show="activePopupIndex[group.date] === index"
                >
                  <div class="popup-content">
                    <div class="popup-date">{{ event.type }}</div>
                    <div class="popup-description">
                  <span v-if="event.thesaurus_term_person" class="event-term"><u>{{
                      event.thesaurus_term_person.topic
                    }} : </u>{{ spaceAroundCommas(event.thesaurus_term_person.term_fr) }} ({{ spaceAroundCommas(event.thesaurus_term_person.term_la) }})</span>
                      <br v-if="event.thesaurus_term_person">
                      <span v-if="event.place_term" class="event-place"><u>Lieu</u> : {{
                          event.place_term.term_fr
                        }} ({{ event.place_term.term_la }})</span>
                    </div>
                    <router-link :to="`/facsimile/${formatImageIdentifiers(event.image_url)}`" target="_blank" v-if="event.image_url">
                      <span><i class="fas fa-book"></i> Aller au fac-similé</span>
                    </router-link>
                  </div>
                </div>
                <!-- Carousel Navigation: Shown if there's more than one event -->
                <div v-if="group.events.length > 1" class="popup-navigation" :style="{ zIndex: 101 }">
                  <button @click="navigateInCarousel(group, -1)" class="button nav-left"/>
                  <span class="popup-counter">{{ activePopupIndex[group.date] + 1 }}/{{ group.events.length }}</span>
                  <button @click="navigateInCarousel(group, 1)" class="button nav-right"/>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="button btn-scroll btn-scroll-down" @mousedown="startScroll(100)" @mouseup="stopScroll"
            :disabled="isAtBottom || hasNoScroll"></button>

    <button class="button button-toggle button-close" @click="_collapseTimeline()">FERMER</button>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {spaceAroundCommas} from "@/modules/string_format";

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
      hasNoScroll: false,
      activePopupIndex: {},
      selectedDate: null,
      isTimelineCollapsed: true
    };
  },
  computed: {
    ...mapState(['months', 'mappingSha1VolumesJSON']),
    /*groupedEvents() {
      //console.log('this.eventsResponse',this.eventsResponse);
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

      //console.log('groupedArray',groupedArray);

      return groupedArray;
    },*/
    groupedEvents() {
      // Parse une date et retourne un objet avec année, mois, jour et un poids pour le tri.
      const parseDate = (date) => {
        // remove tildes from date
        date = date.replace(/~/g, '');
        const parts = date ? date.split('-').map(Number) : [];
        return {
          year: parts[0] || 0,
          month: parts[1] || 0,
          day: parts[2] || 0,
          // Le poids indique la précision de la date (utile pour le tri).
          weight: parts.length
        };
      };

      // Compare deux dates.
      const compareDates = (a, b) => {
        const dateA = parseDate(a.date), dateB = parseDate(b.date);
        // Compare année, puis mois, puis jour, puis poids.
        if (dateA.year !== dateB.year) return dateA.year - dateB.year;
        if (dateA.month !== dateB.month) return dateA.month - dateB.month;
        if (dateA.day !== dateB.day) return dateA.day - dateB.day;
        return dateA.weight - dateB.weight;
      };

      // Tri des événements par date.
      const eventsWithDate = this.eventsResponse.filter(e => e.date).sort(compareDates);
      const eventsWithoutDate = this.eventsResponse.filter(e => !e.date);

      // Groupement des événements par date unique.
      let grouped = eventsWithDate.reduce((acc, event) => {
        const foundIndex = acc.findIndex(item => item.date === event.date);
        foundIndex === -1 ? acc.push({date: event.date, events: [event]}) : acc[foundIndex].events.push(event);
        return acc;
      }, []);

      // Ajoute les événements sans date à la fin.
      if (eventsWithoutDate.length) grouped.push({date: 'Date inconnue', events: eventsWithoutDate});

      return grouped;
    }

  },

  mounted() {
    this.initScroll();
    document.body.addEventListener("click", this._deselectDate);
  },
  unmounted() {
    document.body.removeEventListener("click", this._deselectDate);
  },
  methods: {
    spaceAroundCommas,
    /**
     * Navigate in the timeline's popup like a carousel
     * @param group
     * @param direction
     * @returns {void}
     */
    navigateInCarousel(group, direction) {
      //console.log(group)
      // console.log('navigateInCarousel', group.events);
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

      this.$nextTick(() => {
        this.initScroll();
        this.scrollIfPopUpOverflow();
        this.handleScroll();
      });
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
     * Initialize the scroll event
     */
    initScroll() {
      this.hasNoScroll = Math.abs(this.$refs.scrollContainer.scrollHeight - this.$refs.scrollContainer.clientHeight) < 1;

      if (! this.hasNoScroll) this.$refs.scrollContainer.addEventListener('scroll', this.handleScroll)
      else this.$refs.scrollContainer.removeEventListener('scroll', this.handleScroll)

      // this.$refs.scrollContainer.addEventListener('wheel', this.handleWheel, {passive: false});
    }
    ,

    /**
     * Handle the scroll event to know if the user is at the top or bottom of the timeline
     */
    handleScroll() {
      this.isAtTop = this.$refs.scrollContainer.scrollTop < 1;
      this.isAtBottom = this.$refs.scrollContainer.scrollHeight - this.$refs.scrollContainer.scrollTop === this.$refs.scrollContainer.clientHeight;
      console.log(this.isAtTop);
    }
    ,

    /**
     * Scroll if the popup is partially hidden at bottom
     */
    scrollIfPopUpOverflow() {
      if (this.$refs.timelinePopup.length) {
        const timelinePopupRect = this.$refs.timelinePopup[0].getBoundingClientRect()
        const scrollContainerRect = this.$refs.scrollContainer.getBoundingClientRect();
        const overflow = timelinePopupRect.bottom - scrollContainerRect.bottom;
        if (overflow > 0) {
          this.scroll(overflow + 100, 'instant');
        }
      }
    }
    ,

    /**
     * Start scrolling
     * @param amount
     */
    startScroll(amount) {
      this.stopScroll();
      this.scroll(amount);
      this.scrollInterval = setInterval(() => {
        console.log(amount, this.isAtTop, this.isAtBottom)
        if ((this.isAtTop && amount < 0) || (this.isAtBottom && amount > 0)) {
          this.stopScroll();
        } else {
          this.scroll(amount)
        }

      }, 100);
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
    scroll(amount, behavior = 'smooth') {
      const container = this.$refs.scrollContainer;
      if (container) {
        container.scrollBy({top: amount, behavior});
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
    togglePopup($event, date) {
      $event.stopPropagation();
      if (this.clicked === date) {
        this.clicked = null; // Ferme le groupe si déjà ouvert
        this.selectedDate = null; // Désélectionne le dot
      } else {
        this.clicked = date;
        this.selectedDate = date; // Sélectionne le nouveau dot
        this.activePopupIndex[date] = this.activePopupIndex[date] || 0;
      }

      this.$nextTick(() => {
        this.initScroll();
        this.scrollIfPopUpOverflow();
        this.handleScroll();
      });
    }
    ,

    /**
     * Collapse Timeline on mobile
     * @returns {void}
     * @private
     */
    _collapseTimeline() {
      this.isTimelineCollapsed = ! this.isTimelineCollapsed;
    },

    /**
     * Deselect active date
     * @returns {void}
     * @private
     */
    _deselectDate($event) {
      if (!$event.target.closest('.popup-group')) {
        this.selectedDate = null;
        this.clicked = null
      }
    },

  }
}
;
</script>

<style scoped>
.timeline-container {
  position: relative;
  width: 6px;
  background: #dfdede;
  margin: 0 auto;
  height: 100%;
}

.timeline-item {
  position: relative;
  width: 100%;
  min-height: 84px;
}

.timeline-date {
  position: absolute;
  right: 2rem;
  top: 42px;
  transform: translateY(-50%);
  white-space: nowrap;
  cursor: pointer;

  font-style: italic;
  font-size: 20px;
  font-weight: normal;
  color: #000000;
}

.timeline-item.dot-selected .timeline-date {
  color: var(--light-brown-alt);
}


.timeline-dot {
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  top: 42px;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 5px solid #dfdede;
}

.timeline-dot,
.legend-item .dot.neutral {
  background: #DFDEDE;
}

.timeline-dot.without-date,
.legend-item .dot.without-date {
  background-color: #FFFFFF;
  border: #DFDEDE 6px solid;
}

.timeline-item:not(.dot-selected) .timeline-dot:hover {
  transform: translate(-50%, -50%) scale(1.2);
  background: #303030;
  border: #303030;
}

.timeline-item.dot-selected {
  padding-bottom: 20px;
}

.timeline-item.dot-selected .popup-group-content {
}

.timeline-item.dot-selected .timeline-dot {
  width: 31px;
  height: 31px;
  background: #BB062D !important;
  border: #BB062D !important;
}

.timeline-scroll-container {
  min-height: 86px;
  max-height: min( 50rem, calc(100vh - 200px));
  overflow-y: auto;
  border-top: 1px solid #A7A7A7;
  border-bottom: 1px solid #A7A7A7;

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+
}

.timeline-scroll-container::-webkit-scrollbar {
  background: transparent; /* Chrome/Safari/Webkit */
}

.timeline-scroll-container::-webkit-scrollbar-track {
  background: #DFDEDE;
}

.timeline-scroll-container::-webkit-scrollbar-thumb {
  background-color: var(--light-brown-alt);
  border-radius: 3px;
  border: #303030;
}


.timeline-legend {
  margin-bottom: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-family: var(--font-secondary);
  font-size: 17px;
}

.legend-item .dot {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 10px;
}

.button.button-toggle {
  display: none;
}

.button.btn-scroll {
  bottom: 0;
  right: 0;
  left: 50%;
  transform: translateX(-50%);

  width: 49px;
  height: 49px;
  border: none;
  background: url("@/assets/images/b_fleche_top.svg") center / 49px auto no-repeat;
  padding: 0;
  outline: none;
  cursor: pointer;
}

.button.btn-scroll.btn-scroll-down {
  transform-origin: 50% 50%;
  transform: rotate(180deg) translateX(50%);
}

.button.btn-scroll[disabled] {
  opacity: 0.25;
  cursor: default;
}

.popup-group {
  transform: translateX(-50%) translateY(80px);
  width: 343px;
  max-width: 90vw;
}

.popup-group-content {
  margin-bottom: 80px;
}

.timeline-popup {
  width: 100%;
  background: rgba(255,255,255, 0.95);
  padding: 20px 20px 60px;
  box-shadow: 0px 0px 12px 0 #00000033;
  border-radius: 10px;
  z-index: 10;
}

.popup-date {
  font-style: italic;
  font-size: 22px;
  color: #000000;
}

.popup-description {
  font-family: var(--font-secondary);
  font-size: 20px;
  line-height: 1.2;
  color: #6E6E6E;
}

.popup-description .event-term u {
  display: block;
  text-decoration: none;
  color: #A53605;
}

.popup-and-navigation {
  display: none;
}

.popup-and-navigation.is-active {
  position: relative;
  display: flex;
  justify-content: space-between; /* ou 'flex-end' selon votre structure exacte */
  align-items: center;
}

.popup-navigation {
  position: absolute;
  bottom: 15px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.popup-counter {
  font-family: var(--font-secondary);
  font-weight: 500;
  font-size: 20px;
  color: #A53605;
}

.popup-content a {
  display: inline-block;
  margin-top: 2px;
  font-family: var(--font-secondary);
  font-size: 20px;
  color: #000000;
  text-decoration: none;
}

.popup-content a:hover {
  color: #BB062D;
}

.popup-content .fas {
  margin-right: 2px;
}

.nav-left, .nav-right {
  width: 30px;
  height: 30px;
  color: #FFFFFF;
  border: none;
  outline: none;
  cursor: pointer;
  background: url("@/assets/images/b_fleche.svg") center / 23px auto no-repeat;
}

.nav-left {
  transform: rotate(180deg);
  transform-origin: 50% 50%;
}

@media screen and (max-width: 1024px) {

  .timeline-parent {
    position: relative;
  }

  .button.btn-scroll {
    display: none;
  }

  .timeline-scroll-container,
  .timeline-legend {
    display: none;
  }

  .timeline-parent {
    border-top: 1px solid #A7A7A7;
  }

  .timeline-parent:not(.timeline-collapsed) {
    margin: 0 -20px;
    background-color: #F2F2F2;
    padding: 60px 20px 90px;
    box-shadow: inset 0px 20px 20px 0 #0000003A;
  }

  .timeline-parent:not(.timeline-collapsed)::after {
    content: "";
    display: block;
    width: 100%;
    height: 60px;
    box-shadow: inset 0px 20px 20px 0 #0000003A;
    position: absolute;
    bottom: 0;
    left: 0;
    transform: rotate(180deg);
  }

  .timeline-parent:not(.timeline-collapsed) .timeline-legend {
    display: block;
  }

  .timeline-parent:not(.timeline-collapsed) .timeline-scroll-container {
    display: block;
  }

  .timeline-scroll-container {
    min-height: unset;
    max-height: unset;
    overflow-y: unset;
    border: none;
  }

  .button.button-toggle {
    position: absolute;
    left: 50%;
    top: -28px;
    z-index: 10;
    transform: translateX(-50%);

    display: inline-block;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    text-align: center;
    padding: 0;
    box-shadow: none;
  }

  .button.button-toggle.button-close {
    display: none;
  }

  .timeline-parent:not(.timeline-collapsed) .button.button-toggle.button-close {
    display: inline-block;
    top: unset;
    bottom: -28px;
  }

  .timeline-parent:not(.timeline-collapsed) .button.button-toggle.button-close,
  .timeline-parent:not(.timeline-collapsed) .button.button-toggle {
    text-indent: -9999px;
    background: #FFFFFF url('~@/assets/images/b_Close_liste.svg') center / 22px auto no-repeat;
  }
}

@media screen and (max-width: 480px) {
  .timeline-date {
    font-size: 16px;
  }
}

</style>