// function putVar(key, value) {
//   AIR_VARS[key] = value;
// }
//
// function putVar2(key, value) {
//   AIR_VARS[key] = value;
// }
//
// function getVar(key, defaultValue) {
//   return AIR_VARS[key] || defaultValue;
// }

function getResCode() {
  return AIR_RESCODE;
}

function setHomeResult(value) {
  AIR_RESULT.data = (value && value.data) || value;
}

function setSearchResult(value) {
  AIR_RESULT.data = (value && value.data) || value;
}

function setResult(value) {
  AIR_RESULT.data = (value && value.data) || value;
}
