
export const spaceAroundCommas = function formatString(str) {
    // forst remove extra spaces around commas exemple "Presbyter ; Sacerdos" => "Presbyter; Sacerdos"
    str = str.replace(/(\s*;\s*)/g, ';');
    return str.toString().replace(/;/g, '; ');
}