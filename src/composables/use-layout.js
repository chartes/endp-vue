import {ref, computed} from "vue"

export default function useLayout() {


      let imageIsAvailable = ref(false);
      let isTOCOpened = ref(false);
      let isTOCMenuOpened = ref(false);
      let viewMode = ref("text-mode");

      let rawSearchedTerm = ref('');


      const tocCssClass = computed(() => {
        return isTOCOpened.value ? "is-opened" : "";
      });

      const tocMenuCssClass = computed(() => {
        return isTOCMenuOpened.value ? "toc-aside-is-opened" : "";
      });

      const toggleTOCContent = function (event) {
        event.preventDefault();
        isTOCOpened.value = !isTOCOpened.value;
      };

      const toggleTOCMenu = function (event) {
        event.preventDefault();
        isTOCMenuOpened.value = !isTOCMenuOpened.value;
      };

      const TOCMenuBtnCssClass = computed(() => {
        return isTOCMenuOpened.value ? "is-opened" : "";
      });

      const viewModeCssClass = computed(() => {
        if (!imageIsAvailable.value) {
          return "text-mode text-mode-only";
        } else {
          return viewMode.value;
        }
      });

      const changeViewMode = function (event, v) {
        event.preventDefault();
        viewMode.value = v;
      };



    return {
        rawSearchedTerm,
        imageIsAvailable,
        tocCssClass,
        tocMenuCssClass,
        toggleTOCContent,
        toggleTOCMenu,
        TOCMenuBtnCssClass,
        viewModeCssClass,
        changeViewMode,
    }
}