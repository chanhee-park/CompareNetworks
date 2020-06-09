/**
 * 네트워크 통계치를 계산하고 저장한다.
 * 통계치 목록 참고
 * (wiki) https://en.wikipedia.org/wiki/Network_science
 * (web) http://networkrepository.com/
 * (paper) ManyNets (2010 CHI - Visualization)
 */
class Stat {
  constructor(network) {
    // Nodes, Edges, Density
    this.N = network.nodes.size;
    this.E = network.links.size;
    this.D = this.E / ((this.N) * (this.N - 1) / 2);

    // Degree - Histogram, min, max, avg
    this.degrees = Stat.getDegreeHistogram(network);
    const degreeArr = Object.values(this.degrees)
    const degreeMinMax = Util.minmax(degreeArr);
    this.degree_min = degreeMinMax.min;
    this.degree_max = degreeMinMax.max;
    this.degree_avg = Util.average(degreeArr);

    // Triangles (3-clique)
    const triangles = Stat.getTriangles(network);
    this.T = triangles.length;
    this.T_max = Stat.getMaximumTriangle(triangles);
    this.T_avg = (this.T * 3) / this.E;
  }

  /**
   * Count of Degrees of all nodes in the network
   * @param {Network} network 
   */
  static getDegreeHistogram (network) {
    const histogram = {};
    [...network.nodes].forEach(node => histogram[node] = 0);
    [...network.links].forEach(link => {
      histogram[link.from] += 1;
      histogram[link.to] += 1;
    });
    return histogram;
  }

  /**
   * Find All Triangles (3-clique) in the Network
   * @param {Network} network 
   */
  static getTriangles (network) {
    const nodes = [...network.nodes];
    const N = nodes.length;
    const matrix = network.matrix;
    const triangles = [];
    for (let i = 0; i < N - 2; i++) {
      for (let j = i + 1; j < N - 1; j++) {
        for (let k = j + 1; k < N; k++) {
          if (matrix[i][j] == 0) continue;
          else if (matrix[i][k] == 0) continue;
          else if (matrix[j][k] || 0) continue;
          else triangles.push([i, j, k]);
        }
      }
    }
    return triangles;
  }

  /**
   * Find Maximum Triangle formed by a edge.
   * @param {Number[]} triangles elem[0,1,2] represents node column in the matrix notation.
   */
  static getMaximumTriangle (triangles) {
    const cnt = {};
    for (let t of triangles) {
      cnt[t[0]] = (t[0] in cnt) ? cnt[t[0]] + 1 : 1
      cnt[t[1]] = (t[1] in cnt) ? cnt[t[1]] + 1 : 1
      cnt[t[2]] = (t[2] in cnt) ? cnt[t[2]] + 1 : 1
    }
    return Math.max(...Object.values(cnt));
  }

  /**
   * TODO: 개발이 필요한 네트워크 통계치 
   * Component count, 
   * Component size, 
   * Duration histogram,
   * Assort coefficient, 
   * Average shortest path length (or characteristic path length)
   * Clustering coefficient (local avg, global),  
   * Triangles (count, max, avg),
   * Lower bound on the size of the maximum clique
   * Histograms of k-clique
   * Histograms of k-cores
   * Maximum k-core number,
   * and so on...
   */
}

const STAT_DESC = {
  N: {
    name: 'Number of Nodes',
    type: 'Number',
    time: 'O(1)'
  },
  E: {
    name: 'Number of Edges',
    type: 'Number',
    time: 'O(1)'
  },
  D: {
    name: 'Density(Edeg-Node Ratio)',
    type: 'Number',
    time: 'O(1)'
  },
  degrees: {
    name: 'Degree Histogram',
    type: 'Histogram',
    time: 'O(E)'
  },
  degree_min: {
    name: 'Minimum Degree',
    type: 'Number',
    time: 'O(E + N)'
  },
  degree_max: {
    name: 'Maximum Degree',
    type: 'Number',
    time: 'O(E + N)'
  },
  degree_avg: {
    name: 'Average Degree',
    type: 'Number',
    time: 'O(E + N)'
  },
  T: {
    name: 'Number of Triangles',
    type: 'Number',
    time: 'O(N^3)'
  },
  T_max: {
    name: 'Maximum number of triangles formed by a edge',
    type: 'Number',
    time: 'O(N^3)'
  },
  T_avg: {
    name: 'Average triangles formed by a edge',
    type: 'Number',
    time: 'O(N^3)'
  }
}
