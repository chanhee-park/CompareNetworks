class Util {
  /**
     * 파일을 불러온다.
     * @method loadFile
     * @param {string} filePath 불러올 파일의 파일명을 포함한 경로
     * @returns {string} 불러온 파일의 responseText
     */
  static loadFile (filePath) {
    let result = null;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
      result = xmlhttp.responseText;
    }
    return result;
  }
}