
export const spaceAroundCommas = function formatString(str) {
    // forst remove extra spaces around commas exemple "Presbyter ; Sacerdos" => "Presbyter; Sacerdos"
    str = str.replace(/(\s*;\s*)/g, ';');
    return str.toString().replace(/;/g, '\u00A0; ');
}

export const formatDate = function formatString(date) {
      if (!date) return 'Date non renseignée';
      const [year, monthCode, day] = date.split('-');
      const month = this.$store.state.months.find(m => m.iso_code === monthCode)?.name || '';
      return `${day ? `${day} ` : ''}${month} ${year}`;
    }