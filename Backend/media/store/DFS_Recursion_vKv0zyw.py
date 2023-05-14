def dfs(graph,root,goal,visted=[]):
    if not visted:visted=[root]
    if goal==root:
        return [goal]
    path=None
    children=graph.get(root,[])
    for child in children:
        print(child,root)
        if child not in visted:
            visted.append(child)
            path=dfs(graph,child,goal,visted)
            if path:
                path.insert(0,root)
                return path
            
    
    return path
graph ={
    'a':["b","c","z","d"],
    "b":["e","f"],
    "c":["f","w"],
    "f":["c"]
    
}
path=dfs(graph,"a","w")
if path: print("ans : ",path)
else:print("not exsist in graph")

"""
Depth-first search is a kind of graph search where a
branch of the search tree is explored as deeply as
possible before backtracking.
Properties of depth-first search:

Complete? No: fails in infinite-depth spaces, spaces with
loops
    Modify to avoid repeated states along path
    complete in finite spaces
    Time? O(b
Time? O(b^m): terrible if m is much larger than d
Space? O(bm), i.e., linear space!
Optimal? No but can be made optimal using path checking

"""