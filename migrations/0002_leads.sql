-- Lead generation, concierge conversations, and appointments.
-- Rows are unowned (auth off). Reads that return PII are PIN-gated in server functions.

create table if not exists leads (
  id text primary key,
  name text,
  email text,
  phone text,
  intent text,
  timeline text,
  location text,
  property_type text,
  price_range text,
  preapproved text,
  notes text,
  source text not null default 'chat',
  stage text not null default 'new',
  score integer not null default 0,
  tags text not null default '[]',
  consent_contact boolean not null default false,
  consent_sms boolean not null default false,
  conversation_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_updated_idx on leads (updated_at desc);
create index if not exists leads_stage_idx on leads (stage);
create index if not exists leads_email_idx on leads (email);

create table if not exists conversations (
  id text primary key,
  lead_id text,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id text primary key,
  conversation_id text not null,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_idx on messages (conversation_id, created_at);

create table if not exists appointments (
  id text primary key,
  lead_id text,
  conversation_id text,
  name text not null,
  email text not null,
  phone text,
  starts_at timestamptz not null,
  duration_min integer not null default 45,
  meeting_type text not null default 'video',
  topic text,
  notes text,
  status text not null default 'requested',
  consent_contact boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists appointments_starts_idx on appointments (starts_at);
