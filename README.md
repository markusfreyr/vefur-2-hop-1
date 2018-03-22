# Hópverkefni 1

Fyrsta hópverkefni í Vefforritun2 2018.

## Um verkefnið
Verkefnið snýst um að búa til vefþjónustu fyrir bókasafn, setja upp gagnagrunna og sjá um notendaumsjón.

Til þess að prófa vefþjónustuna er mælt með [Postman](https://www.getpostman.com/).

Ítarlegri lýsing á verkefni má finna [hér](https://github.com/vefforritun/vef2-2018-h1/blob/master/README.md) þar sem fram kemur hvaða slóðir eru studdar og hvers konar aðgerðir á þær.

## Síða í keyrslu
* [Á Heroku](https://fsd-verkefni4.herokuapp.com/)

## Uppsetning
Clone-a þetta repo, og ýta því á ykkar eigið git repo:

```bash
> git clone https://github.com/markusfreyr/vefur-2-hop-1.git
> cd vefur-2-hop-1
> git remote remove origin # fjarlægja remote sem verkefni er í
> git remote add origin <slóð á repo> # bæta við í þínu repo
> git push
```
Þegar þið eruð komin með verkefnið, sækið pakka með

```bash
> npm install
```

Áður en vefþjónustan er sjálf keyrð þarf að búa til schema fyrir töflur með því að keyra skipanalínu í rót verkefnis

```bash
> node ./db/createdb.js
```

Ef verið er að setja verkefnið upp á eigin vél eða

```bash
> heroku run node ./db/createdb.js
```

Til að koma gögnum úr [data.js](https://github.com/markusfreyr/vefur-2-hop-1/blob/master/data/data.csv) og í töfluna þarf að keyra

```bash
> node ./utils/csv2table.js
```

eða

```bash
> heroku run node ./utils/csv2table.js
```

Þá er loks hægt að keyra vefþjónustuna með

```bash
> npm start
```

Notað er [PostgreSQL](https://www.postgresql.org/) database management og fyrir verkefnið þarf því [node-postgres](https://node-postgres.com/) til að fá þessa virkni eins og skilgreint er í dependencies í [package-json](https://github.com/markusfreyr/vefur-2-hop-1/blob/master/package.json)

## API

```bash
> curl 
-H "Content-Type: application/json" 
-d '{"name": "Jón Jónsson", "username": "Jón", "password": "123456"}' http://localhost:3000/register
{"id":2,"username":"Jón","name":"Jón Jónsson","profile":null}

> curl 
-H "Content-Type: application/json" 
-d '{"username": "Jón", "password": "123456"}' http://localhost:3000/login
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxNzU5MTc2LCJleHAiOjE1MjI5NTkxNzZ9.zKHIi122oEPI31-wlYejBWRG0E7QnImhOqxWuEzCZ2k"}


curl 
-H "Content-Type: application/json" 
-H "Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxNzU5MTc2LCJleHAiOjE1MjI5NTkxNzZ9.zKHIi122oEPI31-wlYejBWRG0E7QnImhOqxWuEzCZ2k" 
-d '{"title": "Horrible book", "isbn13": "1231231231231", "author": "John", "description": "Very scary horror", "category": "Horror"}' http://localhost:3000/books
{"id":536,"title":"Horrible book","isbn13":"1231231231231","author":"John","description":"Very scary horror","category":"Horror"}
```

`GET` á `/books` sýnir lista af 10 af bókum ásamt hlekk á
 sjálfan sig, næstu síðu og ef við á þá síðu á undan sér.
 
 ```json
 {
 "links": {
 		  "self":	{"href":"http://localhost:3000/books/?offset=0&limit=10"},
 		  "next": {"href":"http://localhost:3000/books/?offset=10&limit=10"}
 	  },
 "limit":10,
 "offset":0,
 "items": [
   {
    "id":1,
    "title":"1984",
    "isbn13":"9780451524935",
    "author":"George Orwell",
    "description":"Winston Smith is a worker at the Ministry of Truth, where he falsifies records for the party. Secretly subversive, he and his colleague Julia try to free themselves from political slavery but the price of freedom is betrayal.",
    "category":"Science Fiction"
    },
    ... 9 bækur í viðbót
  ]
 }
 ```

## Tól
Sjá [package.json](https://github.com/markusfreyr/vefur-2-hop-1/blob/master/package.json)

## Höfundir

* **Arnar Pétursson** - arp25@hi.is - Hugbúnaðarverkfræðinemi
* **Freyr Saputra Daníelsson** - fsd1@hi.is - Hugbúnaðarverkfræðinemi
* **Markús Freyr Sigurbjörnsson** -  - Hugbúnaðarverkfræðinemi
