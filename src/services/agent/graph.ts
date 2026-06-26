import { StateGraph } from '@langchain/langgraph'
import { AgentAnnotation } from './state'
import { resolveNode, searchNode, extractAndScoreNode, saveNode } from './nodes'
import { db } from '../supabase'

const graph = new StateGraph(AgentAnnotation)
  .addNode('resolve', resolveNode)
  .addNode('search', searchNode)
  .addNode('extractAndScore', extractAndScoreNode)
  .addNode('save', saveNode)
  .addEdge('__start__', 'resolve')
  .addEdge('resolve', 'search')
  .addEdge('search', 'extractAndScore')
  .addEdge('extractAndScore', 'save')
  .addEdge('save', '__end__')
  .compile()

export async function runAgent(reportId: string, projectInput: string) {
  try {
    await graph.invoke({ reportId, projectInput })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    await db.from('reports').update({ status: 'error', error: msg }).eq('id', reportId)
  }
}
