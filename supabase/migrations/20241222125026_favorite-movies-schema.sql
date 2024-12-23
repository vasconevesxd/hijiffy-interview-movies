DROP TABLE IF EXISTS favorite_movies;

CREATE TABLE favorite_movies (
    id bigint primary key generated always as identity not null,             
    profile_id uuid references profiles(id) on delete cascade not null,
    movie_id int not null 
);
