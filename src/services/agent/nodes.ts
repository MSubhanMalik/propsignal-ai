import { chat } from "../ai/client";
import { searchWeb } from "../search/searcher";
import { RESOLVE_PROMPT, EXTRACT_AND_SCORE_PROMPT } from "./prompts";
import { ResolveOutputSchema, ExtractOutputSchema } from "@/types";
import { parseJSON } from "./parser";
import { db } from "../supabase";
import type { AgentRunState } from "./state";
import type { AgentStep, Source } from "@/types";

async function setStep(reportId: string, step: AgentStep) {
  await db.from("reports").update({ current_step: step }).eq("id", reportId);
}

export async function resolveNode(
  state: AgentRunState,
): Promise<Partial<AgentRunState>> {
  await setStep(state.reportId, "resolving");
  const raw = await chat(
    RESOLVE_PROMPT,
    `Project/developer query: "${state.projectInput}"`,
  );
  const { resolvedName, searchQueries } = parseJSON(raw, ResolveOutputSchema);
  return { resolvedName, searchQueries };
}

export async function searchNode(
  state: AgentRunState,
): Promise<Partial<AgentRunState>> {
  await setStep(state.reportId, "searching");

  const allResults = [];
  for (const query of state.searchQueries) {
    const results = await searchWeb(query);
    allResults.push(...results);
    await db.from("searches").insert({
      report_id: state.reportId,
      query,
      results: results as unknown as Record<string, unknown>[],
    });
  }

  const seen = new Set<string>();
  const searchResults = allResults.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });

  return { searchResults };
}

export async function extractAndScoreNode(
  state: AgentRunState,
): Promise<Partial<AgentRunState>> {
  await setStep(state.reportId, "extracting");

  const context = state.searchResults
    .map((r) => `Title: ${r.title}\nURL: ${r.url}\nSnippet: ${r.snippet}`)
    .join("\n\n---\n\n");

  const raw = await chat(
    EXTRACT_AND_SCORE_PROMPT,
    `Project: ${state.resolvedName}\n\nSearch Results:\n${context}`,
  );

  const { signals, credibilityScore, riskLevel, summary } = parseJSON(
    raw,
    ExtractOutputSchema,
  );
  const sources: Source[] = state.searchResults.map((r) => ({
    title: r.title,
    url: r.url,
  }));

  return { signals, credibilityScore, riskLevel, summary, sources };
}

export async function saveNode(
  state: AgentRunState,
): Promise<Partial<AgentRunState>> {
  await setStep(state.reportId, "saving");

  if (state.signals.length > 0) {
    await db
      .from("signals")
      .insert(state.signals.map((s) => ({ ...s, report_id: state.reportId })));
  }

  await db
    .from("reports")
    .update({
      status: "done",
      resolved_name: state.resolvedName,
      credibility_score: state.credibilityScore,
      risk_level: state.riskLevel,
      summary: state.summary,
      sources: state.sources as unknown as Record<string, unknown>[],
    })
    .eq("id", state.reportId);

  return {};
}
