/**
 * 잡다한 계산과 처리를 담당한다.
 * Static Class (-> non constructor)
 */
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

  /**
   * 최대 값과 최소 값을 찾는다.
   * @param {Iterable<number>} arrayLike 순회할 Iterable 객체 (eg. Array, Set, ..)
   */
  static minmax (arrayLike) {
    let min = + Infinity;
    let max = - Infinity;
    for (let item of arrayLike) {
      if (isNaN(item)) continue;
      min = Math.min(min, item);
      max = Math.max(max, item);
    }
    return {
      min: isFinite(min) ? min : -1,
      max: isFinite(max) ? max : -1
    };
  }

  // 합계 
  static sum = v => v.reduce((s, e) => s + e, 0);

  // 평균
  static average = v => Util.sum(v) / v.length;
}