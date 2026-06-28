import { ExternalLink } from 'lucide-react'

interface Source {
  title: string
  url: string
}

interface Props {
  sources: Source[]
}

export function SourceList({ sources }: Props) {
  if (!sources.length) return null

  return (
    <div>
      <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-widest mb-3">
        Sources Reviewed ({sources.length})
      </h2>
      <div className="bg-white rounded-2xl border-2 border-foreground overflow-hidden shadow-[4px_4px_0px_oklch(0.105_0.038_265)]">
        {sources.map((src, i) => (
          <div key={i}>
            {i > 0 && <div className="border-t border-border" />}
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-secondary/50 transition-colors group"
            >
              <span className="font-display font-bold text-xs text-muted-foreground w-5 flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm text-foreground/70 group-hover:text-primary transition-colors truncate">
                {src.title}
              </span>
              <ExternalLink className="ml-auto flex-shrink-0 w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
