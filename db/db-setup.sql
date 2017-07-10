--CREATE SCHEMA
DROP SCHEMA rateapp CASCADE;

CREATE SCHEMA rateapp;

SET search_path TO rateapp,public;

CREATE TABLE rateapp.account (
  account_id serial PRIMARY KEY,
  email varchar (50) UNIQUE,
  accountname varchar (25),
  avatar_url varchar (100),
  password varchar (100),
  of_age boolean DEFAULT false,
  login_ip inet,
  register_date date not null default now(),
  last_login timestamp not null default now()
);

CREATE TABLE rateapp.collection (
  col_id serial PRIMARY KEY,
  owner_id serial NOT NULL REFERENCES rateapp.account(account_id) ON DELETE CASCADE,
  title varchar (50),
  url varchar (10),
  private boolean NOT NULL DEFAULT false,
  nsfw boolean NOT NULL DEFAULT false,
  created_date date not null default now()
);

CREATE TABLE rateapp.category(
  cat_id serial PRIMARY KEY,
  category varchar(15) UNIQUE
);

CREATE TABLE rateapp.collection_category (
  cat_id serial NOT NULL REFERENCES rateapp.category(cat_id),
  col_id serial NOT NULL REFERENCES rateapp.collection(col_id) ON DELETE CASCADE
);

CREATE TABLE rateapp.image (
  image_id serial PRIMARY KEY,
  col_id serial REFERENCES rateapp.collection(col_id) ON DELETE CASCADE,
  url varchar(50) NOT NULL
);

CREATE TABLE rateapp.vote (
  vote_id serial PRIMARY KEY,
  vote_winner serial REFERENCES rateapp.image(image_id),
  vote_loser serial REFERENCES rateapp.image(image_id),
  account_id serial REFERENCES rateapp.account(account_id) ON DELETE CASCADE,
  vote_time timestamp default now()
);

CREATE TABLE rateapp.question (
  question_id serial PRIMARY KEY,
  col_id serial NOT NULL REFERENCES rateapp.collection(col_id) ON DELETE CASCADE,
  question varchar(50) NOT NULL
);

CREATE TABLE rateapp.rating (
  rating_id serial PRIMARY KEY,
  rating smallint NOT NULL DEFAULT 1200,
  image_id serial REFERENCES rateapp.image(image_id) ON DELETE CASCADE,
  question_id serial REFERENCES rateapp.question(question_id) ON DELETE CASCADE
);

CREATE TABLE rateapp.comment (
  comment_id serial PRIMARY KEY,
  comment varchar(140) NOT NULL,
  col_id serial REFERENCES rateapp.collection(col_id),
  account_id serial REFERENCES rateapp.account(account_id) ON DELETE CASCADE
);

CREATE TABLE rateapp.star (
  star_id serial PRIMARY KEY,
  account_id serial NOT NULL REFERENCES rateapp.account(account_id) ON DELETE CASCADE,
  col_id serial NOT NULL REFERENCES rateapp.collection(col_id),
  CONSTRAINT u_constraint UNIQUE (account_id, col_id)
);


-- DATA FETCH FUNCTIONS

CREATE OR REPLACE FUNCTION rateapp.get_collection(colid int) RETURNS json AS 
$BODY$
DECLARE
  found_collection rateapp.collection;
  questions json;
  images json;
  owner json;
BEGIN
  -- Load the collection data:
  SELECT * INTO found_collection
  FROM rateapp.collection c
  WHERE c.col_id = colid;

  -- Get assigned questions:
  SELECT CASE WHEN COUNT(x) = 0 THEN '[]' ELSE json_agg(x) END INTO questions 
  FROM (SELECT q.question_id, question
        FROM rateapp.question q
        WHERE q.col_id = colid) x;

  -- Get assigned questions:
  SELECT CASE WHEN COUNT(z) = 0 THEN '[]' ELSE json_agg(z) END INTO owner
  FROM (SELECT a.account_id, a.accountname, a.avatar_url
        FROM rateapp.account a
        WHERE a.account_id = found_collection.owner_id) z;

  -- Get assigned images:
  SELECT CASE WHEN COUNT(y) = 0 THEN '[]' ELSE json_agg(y) END INTO images
  FROM (SELECT i.image_id, i.url, array_agg(r.*) as ratings
        FROM rateapp.image i
        LEFT JOIN rateapp.rating r
        ON r.image_id = i.image_id
        WHERE i.col_id = 2
        GROUP BY i.image_id
        ) y;

  -- Build the JSON Response:
  RETURN (SELECT json_build_object(
    'id', found_collection.col_id,
    'owner', owner,
    'title', found_collection.title,
    'url', found_collection.url,
    'private', found_collection.private,
    'nsfw', found_collection.nsfw,
    'created_date', found_collection.created_date, 
    'questions', questions,
    'images', images));

END
$BODY$
LANGUAGE 'plpgsql';



CREATE OR REPLACE FUNCTION rateapp.get_account(aid int) RETURNS json AS 
$BODY$
DECLARE
  found_account rateapp.account;
  collections json;
  starred json;
BEGIN
  -- Load the collection data:
  SELECT * INTO found_account
  FROM rateapp.account a
  WHERE a.account_id = aid;

  -- Get assigned questions:
  SELECT CASE WHEN COUNT(x) = 0 THEN '[]' ELSE json_agg(x) END INTO collections 
  FROM (SELECT *
        FROM rateapp.collection c
        WHERE c.col_id = found_account.account_id) x;

  -- Get assigned questions:
  SELECT CASE WHEN COUNT(z) = 0 THEN '[]' ELSE json_agg(z) END INTO starred
  FROM (SELECT *
        FROM rateapp.collection c
        INNER JOIN rateapp.star s 
        ON c.col_id = s.col_id
        WHERE s.account_id = found_account.account_id) z;

  -- Build the JSON Response:
  RETURN (SELECT json_build_object(
    'id', found_account.account_id,
    'name', found_account.accountname,
    'avatar', found_account.avatar_url,
    'of_age', found_account.of_age,
    'register_date', found_account.register_date,
    'last_login', found_account.last_login, 
    'collections', collections,
    'starred', starred));

END
$BODY$
LANGUAGE 'plpgsql';