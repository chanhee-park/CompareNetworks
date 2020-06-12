ReactDOM.render(React.createElement(App, null), document.getElementById('root'));

var networks = [];
for (var i = 1; i <= 100; i++) {
  var filename = './dataset/watts_strogatz_graph/network(' + i + ').csv';
  var csv = Util.loadFile(filename);
  networks.push(Network.getNetwrokFromCSV(csv));
}

console.log(networks);

var stats = ['D', 'degree_min', 'degree_max', 'degree_avg', 'T', 'T_max', 'T_avg', 'dist_max', 'dist_avg'];
var diff = NetComparator.getDiffOfStats(networks, stats);
var mdsVal = Util.mds(diff);
console.log(mdsVal);

// DONE(0606): 레이아웃

// DONE(0607): network.js - class Network 구축
// DONE(0608): test data 구축 (watts strogatz graph)
// DONE(0609): network 통계치 추출
// DONE(0611): network 비교 - 통계치 

// TODO: sactter.js (축 선택)
// TODO: pcoord.js (lines, heatmap, and boxplot)
// TODO: diagram.js -> node-link-diagram
// TODO: diagram.js -> matrix-diagram
// TODO: diagram.js -> circos-diagram

// TODO: scatter 인터렉션 (호버, 선택)
// TODO: pcoord 인터렉션 (호버, 선택)
// TODO: scatter - pcoord 상호 인터렉션 (호버, 선택)

// TODO: diagram -> 대형 다이어그램에 통계치 표시
// TODO: diagram - 위치 변경
// TODO: diagram - diagram 상호 인터렉션
// TODO: diagram - scatter & coord 인터렉션 (하이라이트)

// TODO: 노드 탐색하기 (마우스 오버 -> 툴팁)
// TODO: 노드 탐색하기 (선택된 애들 -> 장바구니 (Table with chart))
// TODO: 네트워크 자동 선택 및 정렬