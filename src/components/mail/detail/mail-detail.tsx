import { useMailStore } from "@/stores/mail-store";
import { useMails, useMailAction } from "@/hooks/use-mail";
import { 
  Archive, Trash2, Reply, Forward, Shield, AlertTriangle, 
  CheckCircle, Download, Monitor, Activity, ShieldAlert,
  XCircle, RotateCcw, Share2, Ban, FolderOpen, File, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Severity } from "@/lib/mail/types";

const SEVERITY_STYLES: Record<Severity, { badge: string; border: string; bg: string; text: string }> = {
  critical: { badge: "bg-danger/15 text-danger", border: "border-danger/30", bg: "bg-danger/5", text: "text-danger" },
  high: { badge: "bg-orange/15 text-orange", border: "border-orange/30", bg: "bg-orange/5", text: "text-orange" },
  medium: { badge: "bg-warning/15 text-warning", border: "border-warning/30", bg: "bg-warning/5", text: "text-warning" },
  clean: { badge: "bg-success/15 text-success", border: "border-success/30", bg: "bg-success/5", text: "text-success" },
};

function AuthBadge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <strong className="text-[11px] font-semibold text-muted uppercase">{label}</strong>
      <span className={cn("text-[11px] font-bold", pass ? "text-success" : "text-danger")}>
        {pass ? "PASS" : "FAIL"}
      </span>
    </span>
  );
}

export function MailDetail() {
  const selectedMailId = useMailStore((s) => s.selectedMailId);
  const filters = useMailStore((s) => s.filters);
  const { data } = useMails(filters);
  const actionMutation = useMailAction();

  const allMails = data ? data.pages.flatMap((d) => d.data) : [];
  const selected = allMails.find((m) => m.id === selectedMailId);

  if (!selected) {
    return (
      <div className="flex h-full items-center justify-center bg-bg">
        <div className="flex flex-col items-center text-muted">
          <ShieldAlert className="h-12 w-12 mb-4 opacity-20" />
          <p className="text-sm">Select an email to view threat details</p>
        </div>
      </div>
    );
  }

  const sStyles = SEVERITY_STYLES[selected.severity];

  const handleAction = (action: string) => {
    actionMutation.mutate({ mailId: selected.id, action });
  };

  return (
    <div className="flex h-full flex-col bg-bg overflow-hidden relative">
      {/* Action Bar Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <button onClick={() => handleAction("archive")} className="rounded-md p-1.5 text-muted hover:bg-surface-hover hover:text-fg transition-colors tooltip-trigger" title="Archive">
            <Archive className="h-4 w-4" />
          </button>
          <button onClick={() => handleAction("trash")} className="rounded-md p-1.5 text-muted hover:bg-danger/10 hover:text-danger transition-colors" title="Trash">
            <Trash2 className="h-4 w-4" />
          </button>
          <button onClick={() => handleAction("star")} className={cn("rounded-md p-1.5 transition-colors", selected.starred ? "text-orange bg-orange/10 hover:bg-orange/20" : "text-muted hover:bg-surface-hover hover:text-fg")} title="Star">
            <Star className={cn("h-4 w-4", selected.starred && "fill-current")} />
          </button>
          <div className="h-4 w-px bg-border mx-1" />
          <button onClick={() => handleAction("reply")} className="rounded-md p-1.5 text-muted hover:bg-surface-hover hover:text-fg transition-colors" title="Reply">
            <Reply className="h-4 w-4" />
          </button>
          <button onClick={() => handleAction("forward")} className="rounded-md p-1.5 text-muted hover:bg-surface-hover hover:text-fg transition-colors" title="Forward">
            <Forward className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {selected.status === "quarantined" ? (
            <button onClick={() => handleAction("release")} className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-[11px] font-medium text-fg hover:bg-surface-hover transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> Release
            </button>
          ) : (
             <button onClick={() => handleAction("quarantine")} className="flex items-center gap-1.5 rounded-md bg-danger/15 text-danger px-3 py-1.5 text-[11px] font-medium hover:bg-danger/25 transition-colors">
              <XCircle className="h-3.5 w-3.5" /> Quarantine
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Email Headers */}
        <div className="px-8 py-6">
          <h2 className="text-xl font-semibold text-fg mb-4">{selected.subject}</h2>
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full text-[13px] font-bold", sStyles.badge)}>
                {selected.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[14px] text-fg">{selected.sender}</span>
                  <span className="text-[12px] text-muted">&lt;{selected.senderEmail}&gt;</span>
                </div>
                <div className="text-[11px] text-muted mt-0.5">to {selected.to}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] text-muted">{selected.date}</div>
              <div className="flex items-center justify-end gap-3 mt-2">
                <AuthBadge label="SPF" pass={selected.auth.spf} />
                <AuthBadge label="DKIM" pass={selected.auth.dkim} />
                <AuthBadge label="DMARC" pass={selected.auth.dmarc} />
              </div>
            </div>
          </div>
        </div>

        {/* Threat Intelligence Panel */}
        {selected.threat ? (
          <div className={cn("mx-8 mb-6 rounded-xl border p-5", sStyles.border, sStyles.bg)}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={cn("flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider", sStyles.text)}>
                <AlertTriangle className="h-4 w-4" /> DeepMail Threat Intel
              </h4>
              <span className={cn("text-[11px] font-bold uppercase", sStyles.text)}>Confidence: {Math.round(selected.threat.confidence)}%</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div>
                <div className="text-[10px] uppercase font-semibold text-muted mb-1">Classification</div>
                <div className="text-[13px] font-medium text-fg">{selected.threat.classification}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-muted mb-1">Origin</div>
                <div className="text-[13px] font-medium text-fg">{selected.threat.originIp} ({selected.threat.originCountry})</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-muted mb-1">Similar Campaigns</div>
                <div className="text-[13px] font-medium text-fg">{selected.threat.similarCampaigns} matches globally</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-muted mb-1">MITRE ATT&CK</div>
                <div className="flex flex-wrap gap-1">
                  {selected.threat.mitre.map(m => (
                    <span key={m} className="rounded bg-fg/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-fg">{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-fg/10 pt-4 mt-2">
              <div className="text-[11px] font-semibold text-muted uppercase">ML Explainability</div>
              {selected.threat.mlExplainability.map(feature => (
                <div key={feature.feature} className="flex items-center gap-3">
                  <div className="w-40 text-[12px] text-fg truncate">{feature.feature}</div>
                  <div className="flex-1 h-1.5 rounded-full bg-fg/10 overflow-hidden">
                    <div className={cn("h-full", sStyles.badge)} style={{ width: `${feature.contribution}%` }} />
                  </div>
                  <div className="w-8 text-right text-[10px] font-mono text-muted">{feature.contribution}%</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-8 mb-6 rounded-xl border border-success/30 bg-success/5 p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-success shrink-0" />
            <div>
              <div className="text-[13px] font-semibold text-success">No threats detected</div>
              <div className="text-[12px] text-success/80 mt-0.5">Email passed all authentication and ML content checks.</div>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="px-8 pb-8 text-[14px] leading-relaxed text-fg/90 whitespace-pre-line font-serif max-w-4xl">
          {selected.body.join("\n\n")}
        </div>

        {/* Attachments */}
        {selected.attachments.length > 0 && (
          <div className="px-8 pb-8">
            <div className="text-[11px] font-semibold uppercase text-muted mb-3 border-b border-border pb-2">Attachments ({selected.attachments.length})</div>
            <div className="flex flex-wrap gap-4">
              {selected.attachments.map(att => (
                <div key={att.id} className={cn("group flex w-64 flex-col rounded-lg border bg-surface overflow-hidden transition-shadow hover:shadow-md", att.threat?.isMalicious ? "border-danger/30" : "border-border")}>
                  <div className="flex items-center gap-3 p-3 border-b border-border">
                    <div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded bg-fg/5", att.threat?.isMalicious && "bg-danger/10 text-danger")}>
                      <File className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-medium text-fg">{att.name}</div>
                      <div className="text-[10px] text-muted">{(att.size / 1024 / 1024).toFixed(1)} MB</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-2 p-1.5">
                    <button className="flex-1 flex items-center justify-center gap-1.5 rounded py-1.5 text-[10px] font-medium text-secondary hover:bg-surface hover:text-fg transition-colors">
                      <Download className="h-3 w-3" /> Download
                    </button>
                    <button onClick={() => handleAction("sandbox")} className="flex-1 flex items-center justify-center gap-1.5 rounded py-1.5 text-[10px] font-medium text-secondary hover:bg-surface hover:text-fg transition-colors">
                      <Monitor className="h-3 w-3" /> Sandbox
                    </button>
                  </div>
                  {att.threat?.isMalicious && (
                    <div className="bg-danger/10 p-2 text-[10px] font-medium text-danger text-center border-t border-danger/20">
                      VT Score: {att.threat.vtScore}/94 ({att.threat.family})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SOC Bottom Action Bar */}
      {selected.severity !== "clean" && (
        <div className="border-t border-border bg-surface-2 px-6 py-3 shrink-0 flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={() => handleAction("case")} className="flex items-center gap-1.5 rounded bg-accent/20 px-3 py-1.5 text-[11px] font-bold text-accent hover:bg-accent/30 transition-colors">
              <FolderOpen className="h-3 w-3" /> Create Case
            </button>
            <button onClick={() => handleAction("share")} className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[11px] font-medium text-secondary hover:bg-surface-hover hover:text-fg transition-colors">
              <Share2 className="h-3 w-3" /> Share
            </button>
            <button onClick={() => handleAction("rule")} className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[11px] font-medium text-secondary hover:bg-surface-hover hover:text-fg transition-colors">
              <Shield className="h-3 w-3" /> Gen Rule
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleAction("block_sender")} className="flex items-center gap-1.5 rounded border border-danger/30 bg-danger/10 px-3 py-1.5 text-[11px] font-medium text-danger hover:bg-danger/20 transition-colors">
              <Ban className="h-3 w-3" /> Block Sender
            </button>
            <button onClick={() => handleAction("block_domain")} className="flex items-center gap-1.5 rounded border border-danger/30 bg-danger/10 px-3 py-1.5 text-[11px] font-medium text-danger hover:bg-danger/20 transition-colors">
              <Ban className="h-3 w-3" /> Block Domain
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
