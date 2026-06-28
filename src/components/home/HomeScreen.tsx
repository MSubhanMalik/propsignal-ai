"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { SearchForm } from "@/components/search/SearchForm";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Separator } from "@/components/ui/separator";
import { startResearch, fetchReports } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Report, RiskLevel } from "@/types";

const MOCK_SIGNALS = [
  { icon: "✗", text: "Court case filed against developer", neg: true },
  { icon: "✗", text: "Delivery delays reported by buyers", neg: true },
  { icon: "✓", text: "RUDA registered and approved", neg: false },
  { icon: "!", text: "Social media fraud allegations", neg: true },
];

function SampleReportCard() {
  return (
    <div className="relative">
      <div className="bg-white rounded-2xl border-2 border-foreground p-6 shadow-[6px_6px_0px_oklch(0.105_0.038_265)]">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          AI analysis · 8 signals found · 4 sources
        </div>

        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="font-display font-bold text-base text-foreground">
              Bahria Town Karachi
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Searched 2 queries · 12 results
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="font-display font-bold text-3xl text-amber-600 leading-none">
              72
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              Medium Risk
            </span>
          </div>
        </div>

        <div className="space-y-2.5 border-t border-border pt-4">
          {MOCK_SIGNALS.map((s, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                  s.neg
                    ? s.icon === "!"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {s.icon}
              </span>
              <span className="text-foreground/70">{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recentReports, setRecentReports] = useState<Report[]>([]);

  useEffect(() => {
    fetchReports()
      .then(setRecentReports)
      .catch(() => {});
  }, []);

  async function handleSubmit(query: string) {
    setLoading(true);
    try {
      const { reportId } = await startResearch(query);
      router.push(`/reports/${reportId}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 pt-8 pb-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border text-xs text-muted-foreground mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Free · No account needed · Pakistan real estate
            </div>

            <h1 className="font-display font-bold text-5xl lg:text-6xl text-foreground leading-[1.05] mb-6">
              Research before
              <br />
              you <span className="text-primary">invest.</span>
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-md">
              Enter any developer or project name. PropSignal scans public
              sources — news, court records, forums — and scores credibility in
              minutes.
            </p>

            <SearchForm onSubmit={handleSubmit} loading={loading} />
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="w-full max-w-sm">
              <SampleReportCard />
            </div>
          </div>
        </section>

        {recentReports.length > 0 && (
          <section className="pb-20">
            <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-widest mb-4">
              Recent Reports
            </h2>
            <div className="bg-white rounded-2xl border-2 border-foreground overflow-hidden shadow-[4px_4px_0px_oklch(0.105_0.038_265)]">
              {recentReports.map((r, i) => (
                <div key={r.id}>
                  {i > 0 && <Separator />}
                  <button
                    onClick={() => router.push(`/reports/${r.id}`)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-secondary/50 transition-colors text-left group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {r.project_input}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(r.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {r.credibility_score != null && (
                        <span className="font-display font-bold text-base text-foreground">
                          {r.credibility_score}
                        </span>
                      )}
                      {r.risk_level ? (
                        <RiskBadge level={r.risk_level as RiskLevel} />
                      ) : (
                        <span className="text-xs text-muted-foreground capitalize">
                          {r.status}
                        </span>
                      )}
                      <span className="text-muted-foreground group-hover:text-primary text-sm transition-colors">
                        →
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
