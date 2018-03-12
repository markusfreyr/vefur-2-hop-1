
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
    title varchar(180) UNIQUE NOT NULL,
    ISBN13 varchar(13) UNIQUE NOT NULL,
    author varchar(64),
    description text,
    categorie varchar(64) NOT NULL references categories(name) 
);

create table read_books(
    id SERIAL PRIMARY KEY,
    user_id INTEGER references users(id),
    book_id INTEGER references books(id),
    rank varchar(1),
    review text 
);
