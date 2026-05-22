export interface Neo4jConfig {
  uri: string;
  username: string;
  password: string;
}

export interface GraphNode {
  id: string;
  labels: string[];
  properties: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  type: string;
  startNodeId: string;
  endNodeId: string;
  properties: Record<string, unknown>;
}

export interface GraphQueryResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

let _connected = false;

export function isNeo4jConnected(): boolean {
  return _connected;
}

export async function connectNeo4j(_config: Neo4jConfig): Promise<boolean> {
  _connected = true;
  return true;
}

export async function queryGraph(_cypher: string): Promise<GraphQueryResult> {
  return { nodes: [], edges: [] };
}
