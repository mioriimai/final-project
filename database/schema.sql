set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "public"."users" (
  "userId"         serial,
  "username"       text           not null,
  "email"          text           not null,
  "hashedPassword" text           not null,
  "createdAt"      timestamptz(6) not null default now(),
  primary key ("userId"),
  unique ("username")
);

create table "public"."items" (
  "itemId"              serial,
  "originalImageUrl"    text           not null,
  "bgRemovedImageUrl"   text           not null,
  "category"            text           not null,
  "brand"               text           not null,
  "color"               text           not null,
  "note"                text           not null,
  "userId"              serial         not null,
  "isFavorite"          BOOLEAN,
  "createdAt"      timestamptz(6) not null default now(),
  primary key ("itemId")
);
