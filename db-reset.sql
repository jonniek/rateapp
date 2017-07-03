DROP TABLE account, collection, category, collection_category, image, vote, question, rating, comment, stars CASCADE;

CREATE TABLE account (
  account_id serial PRIMARY KEY,
  email varchar (50),
  accountname varchar (25),
  password varchar (100),
  of_age boolean DEFAULT false,
  login_ip inet,
  register_date date not null default now(),
  last_login timestamp not null default now()
);

CREATE TABLE collection (
  col_id serial PRIMARY KEY,
  owner_id serial NOT NULL REFERENCES account(account_id),
  title varchar (50),
  url varchar (10),
  private boolean NOT NULL DEFAULT false,
  nswf boolean NOT NULL DEFAULT false,
  created_date date not null default now()
);

CREATE TABLE category(
  cat_id serial PRIMARY KEY,
  category varchar(15)
);

CREATE TABLE collection_category (
  cat_id serial NOT NULL REFERENCES category(cat_id),
  col_id serial NOT NULL REFERENCES collection(col_id)
);

CREATE TABLE image (
  image_id serial PRIMARY KEY,
  col_id serial REFERENCES collection(col_id),
  url varchar(50) NOT NULL
);

CREATE TABLE vote (
  vote_id serial PRIMARY KEY,
  vote_winner serial REFERENCES image(image_id),
  vote_loser serial REFERENCES image(image_id),
  account_id serial REFERENCES account(account_id)
);

CREATE TABLE question (
  question_id serial PRIMARY KEY,
  col_id serial NOT NULL REFERENCES collection(col_id),
  question varchar(50) NOT NULL
);

CREATE TABLE rating (
  rating_id serial PRIMARY KEY,
  rating smallint NOT NULL DEFAULT 1200,
  image_id serial REFERENCES image(image_id),
  question_id serial REFERENCES question(question_id)
);

CREATE TABLE comment (
  comment_id serial PRIMARY KEY,
  comment varchar(140) NOT NULL,
  col_id serial REFERENCES collection(col_id),
  account_id serial REFERENCES account(account_id)
);

CREATE TABLE stars (
  star_id serial PRIMARY KEY,
  account_id serial NOT NULL REFERENCES account(account_id),
  col_id serial NOT NULL REFERENCES collection(col_id)
);


