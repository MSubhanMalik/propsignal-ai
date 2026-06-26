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
      <h2 className="text-base font-semibold text-[#0D1B2A] mb-3">
        Sources Reviewed ({sources.length})
      </h2>
      <div className="bg-white border border-[#E2E8F0] rounded-xl divide-y divide-[#E2E8F0]">
        {sources.map((src, i) => (
          <a
            key={i}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F8FA] transition-colors group"
          >
            <div className="w-6 h-6 rounded bg-[#F1F3F7] flex items-center justify-center flex-shrink-0 text-xs text-[#94A3B8] font-medium">
              {i + 1}
            </div>
            <span className="text-sm text-[#475569] group-hover:text-[#1D4ED8] transition-colors truncate">
              {src.title}
            </span>
            <svg className="ml-auto flex-shrink-0 w-3.5 h-3.5 text-[#CBD5E1] group-hover:text-[#1D4ED8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}
