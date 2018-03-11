
-- Schema hér

create table users ( 
    id SERIAL PRIMARY KEY,
    username varchar(64) NOT NULL,
    password varchar(64) NOT NULL,
    name varchar(64) NOT NULL,
    url varchar(64) NOT NULL
);

create table categories(
    id SERIAL PRIMARY KEY,
    name varchar(64) UNIQUE NOT NULL
);

create table books(
    id SERIAL PRIMARY KEY,
    title varchar(64) UNIQUE NOT NULL,
    ISBN13 smallint UNIQUE NOT NULL,
    author varchar(64),
    description text,
    categorie varchar(64) NOT NULL references categories(name) 
);

create table read_books(
    id SERIAL PRIMARY KEY,
    user_id smallint references users(id),
    book_id smallint references books(id),
    rank smallint,
    review text 
);
