/**
 * 네트워크 통계치를 계산하고 저장한다. (Static Class)
 * 통계치 목록 참고
 * (wiki) https://en.wikipedia.org/wiki/Network_science
 * (web) http://networkrepository.com/
 * (paper) ManyNets (2010 CHI - Visualization)
 */
class StatProcessor {
  static getStat (network) {
    stat = {};
    stat.N = network.nodes.size;
    stat.E = network.links.size;
    stat.D = stat.E / ((stat.N) * (stat.N - 1) / 2);

    // Degree - Histogram, min, max, avg
    stat.degrees = StatProcessor.getDegreeHistogram(network);
    const degreeArr = Object.values(stat.degrees)
    const degreeMinMax = Util.minmax(degreeArr);
    stat.degree_min = degreeMinMax.min;
    stat.degree_max = degreeMinMax.max;
    stat.degree_avg = Util.average(degreeArr);

    // Triangles (3-clique)
    const triangles = StatProcessor.getTriangles(network);
    stat.T = triangles.length;
    stat.T_max = StatProcessor.getMaximumTriangle(triangles);
    stat.T_avg = (stat.T * 3) / stat.E;

    // Distances
    const distAvgMax = StatProcessor.getAvgMaxDistance(network.distMatrix);
    stat.dist_max = distAvgMax.max;
    stat.dist_avg = distAvgMax.avg;

    return stat;
    /**
      * TODO: 개발이 필요한 네트워크 통계치
      * Clustering coefficient (local avg, global),
      * Assort coefficient,
      * Component count,
      * Component size,
      * Duration histogram,
      * Histograms of k-clique
      * Lower bound on the size of the maximum clique
      * Histograms of k-cores
      * Maximum k-core number,
      * and so on...
      */
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
   * get average and maximum distance of all connected node pairs
   * @param {number[][]} dist distance matrix (2d array)
   */
  static getAvgMaxDistance (dist) {
    const N = dist.length;
    let max_dist = 0,
      total_dist = 0,
      total_pair = 0;
    for (let i = 0; i < N - 1; i++) {
      for (let j = i + 1; j < N; j++) {
        if (isFinite(dist[i][j])) {
          max_dist = Math.max(max_dist, dist[i][j])
          total_dist += dist[i][j];
          total_pair += 1;
        }
      }
    }
    return { max: max_dist, avg: total_dist / total_pair };
  }
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
  },
  dist_max: {
    name: 'Maximum distance of all connected node pairs',
    type: 'Number',
    time: 'O(N^2)'
  },
  dist_avg: {
    name: 'Maximum distance of all connected node pairs',
    type: 'Number',
    time: 'O(N^2)'
  }
}
