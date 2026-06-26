-- PropSignal AI — Initial Schema

create table if not exists reports (
  id                  uuid primary key default gen_random_uuid(),
  project_input       text not null,
  status              text not null default 'running',   -- running | done | error
  current_step        text not null default 'resolving', -- resolving | searching | extracting | saving
  resolved_name       text,
  credibility_score   int,                               -- 0–100, null until done
  risk_level          text,                              -- low | medium | high | unknown
  summary             text,
  sources             jsonb default '[]',                -- [{ title, url }]
  error               text,
  created_at          timestamptz default now()
);

create table if not exists signals (
  id            uuid primary key default gen_random_uuid(),
  report_id     uuid not null references reports(id) on delete cascade,
  type          text not null,
  title         text not null,
  detail        text,
  sentiment     text not null,  -- positive | negative | neutral
  weight        int not null,   -- 1–5
  source_url    text not null,
  source_title  text,
  created_at    timestamptz default now()
);

create table if not exists searches (
  id          uuid primary key default gen_random_uuid(),
  report_id   uuid not null references reports(id) on delete cascade,
  query       text not null,
  results     jsonb default '[]',
  created_at  timestamptz default now()
);

-- Indexes
create index if not exists signals_report_id_idx on signals(report_id);
create index if not exists searches_report_id_idx on searches(report_id);
create index if not exists reports_created_at_idx on reports(created_at desc);
