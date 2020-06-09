import networkx as nx

# set params
# n: The number of nodes
# k: Each node is connected to k nearest neighbors in ring topology
# ... The number of edges will same to 'n * (k // 2)'.
# p: The probability of rewiring each edge
N = [25, 50, 100]
K = [4, 6, 8, 10, 12]
P = [0.1, 0.25, 1]

# generate random grahp objects
graphs = []
for n in N:
    for k in K:
        for p in P:
            g = nx.watts_strogatz_graph(n,k,p).edges()
            graphs.append(g)
            print(n, len(g), k, p)

# make csv string
files = []
for g in graphs:
    csv = ''
    for e in g:
        csv += str(e[0]) + ',' + str(e[1]) + '\n'
    files.append(csv)

# write as a csv file
for (i, csv) in enumerate(files):
    filename = 'network('+str(i+1)+').csv'
    f = open(filename,'w')
    f.write(csv) 
    f.close()

