Introduction to SQL for Analysis
================================

In this tutorial we are going to import some data into a relational database, and answer a few questions from it by writing SQL queries.

***SQL***: Stands for Structured Query Language, which is often pronouced as *sequel*. It's a programming language, but unlike other general-purpose languages such as Python it is a specialised language specifically for managing relational databases.

***Relational database***: The most common type of database. Relational databases store tables (similar to a spreadsheet), which can have links (called relationships) between them. Other types of database include: graph databases such as [Neo4j] (https://neo4j.com/) which store data as a set items linked to each other, and document databases such as [Elasticsearch] (https://www.elastic.co/products/elasticsearch), which store each record as a completely separate page of information. These other types of database have their own languages, but relational databases all use SQL.

So why use SQL? In short, it is a more powerful and robust way to ask questions of your data than if you were using something like Excel. Once you are familar with the language you will be able to take a single question you have and convert it into a query. This query can then be recorded, meaning your work is self-documenting, reproducible, and auditable. The power of the language also means work that would perhaps have taken several VLookups in Excel can be achieved with just a few lines of SQL, [reducing the space where mistakes could slip in] (http://www.nytimes.com/2013/04/19/opinion/krugman-the-excel-depression.html). Furthermore, relational databases can deal with gigantic datasets if need be -- you are really only limited by how powerful your computer is. (Millions of rows? You should be fine on your laptop.)

The relational database we are going to be using in this tutorial is [Postgres] (https://www.postgresql.org/), though there are other popular relational databases including [SQLite] (https://sqlite.org/) and [MySQL] (http://www.mysql.com/). Though technically they are all accessed using SQL, the language does in fact vary a bit between them, especially when it comes to importing data -- though most simple queries will be the same.


Getting set up
--------------

### Mac

If you don't already have Homebrew, follow the instructions [on its website] (http://brew.sh/) to get it installed first.

Next, from the terminal install Postgres:

```bash
$ brew install postgres
```

Then lets start Postgres running in the background:

```bash
$ postgres -D /usr/local/var/postgres
```

You will need to leave that tab open. When you're finished with Postgres, press `Ctrl-C` here to shut it down.

Next download and run [Postico] (https://eggerapps.at/postico/), a Postgres client which gives us a visual interface for writing and running our SQL queries.

### Windows

(todo)


Creating a database
-------------------

When your client first starts up it will ask you what database you want to connect to. Though since we don't have a database yet, we will need to create one. To do this we need to connect to a special built-in database called `postgres`. Connect to that database using your client -- you can leave other fields (such as username and password) blank.

You might have realised at this point that we are slighty confusingly using the word 'database' to refer to two different things -- both for Postgres and the individual databases which live inside it. It would perhaps make more sense to think of the latter as 'projects', encapsulating all your data for a given piece of work, each completely separate from other projects.

Once you are connected we are ready to run our first SQL statement. We are going to be looking at crime data, so let's create a new database named 'crime'.

```sql
CREATE DATABASE crime;
```

Now let's see all of our databases:

```sql
SELECT datname FROM pg_database;
```

You should see a list of four, the special `postgres` database we are currently connected to, and the `crime` one we just created. There are also two special 'template' databases which you can ignore.

You can now disconnect from the `postgres` database and connect to the `crime` one we just created.


Getting your data in
--------------------

We are going to be looking at crime. Go to [the data section of data.police.uk] (https://data.police.uk/data/) and select a police force you are interested in and generate your download. You should end up with a CSV file.

If you open the data file in Excel you might notice it's quite nice clean data -- CSV format, no colours or other formatting, no full-width title rows, etc. Though SQL is great for querying data, it's not so great for cleaning it. If your data did need cleaning it would probably be easier to run in through a tool such as [OpenRefine] (http://openrefine.org/) at this point.

Before we actually import the the main crime dataset we first need to create a table for it to go in:

```sql
CREATE TABLE crimes(
    id text,
    month text,
    reportedBy text,
    fallsWithin text,
    longitude float,
    latitude float,
    location text,
    lsoaCode text,
    lsoaName text,
    type text,
    lastOutcomeCategory text,
    context text
);
```

Here we have specifed names for each column -- converted from the spreadsheet to use camelCase. Though column names are allowed to contain spaces if surrounded by `"` that soon gets irritating so typically column names use either camelCase or underscore_case to delimit words.

We also need to require a type for each column. The [Postgres website lists all the different types] (https://www.postgresql.org/docs/current/static/datatype.html#DATATYPE-TABLE), though in most cases you only need to know the common ones -- as well as `text` there is `integer` for whole numbers, `float` for decimal numbers, and `boolean` for true/false values. There are also some types for dealing with dates and times, though they require some special handling which we aren't going to get into here.

To run the import we need to know exactly where the CSV files we downloaded are:
* **Mac:** In the terminal use `cd` navigate to where your file is, probably `~/Downloads`. Run `pwd` to get the directory location, then `ls` to get a list of all the files there. The full location of your file is the directory location plus a `/`, then the file name.
* **Windows:** (todo)

Replace `<location>` in the query below with the location of your data to start the import:

```sql
COPY crimes FROM '<location>'
WITH (FORMAT csv, HEADER true);
```

One thing to note is that we are importing every column from the CSV, in the same order. Postgres doesn't let you select specific columns unfortunately.

Once that's complete we should have all our data inside Postgres. To check everything has worked correctly let's bring back the first ten rows of our data:

```sql
SELECT * FROM crimes
LIMIT 10;
```

If that works then congratulations! We are now ready to start asking some proper questions of our data.


Sorting
-------

By default results can come back in any order. If we want to specify what column we want to use to sort the data we can use the `ORDER BY` clause:

```sql
SELECT * FROM crimes
ORDER BY lastOutcomeCategory;
```

By default ordering is ascending (ie. smallest first), but we can use the `DESC` keyword to reverse it. We can also sort by multiple columns:

```sql
SELECT * FROM crimes
ORDER BY lastOutcomeCategory, type DESC;
```


Filtering
---------

Perhaps we are not interested in all the columns right now, so let's specify the ones we want:

```sql
SELECT month, type, lastOutcomeCategory FROM crimes;
```

To filter down to only look at a specific type of crime we can use the `WHERE` clause:

```sql
SELECT month, lastOutcomeCategory FROM crimes
WHERE type = 'Possession of weapons';
```

If you want to get all results except a specific value you can use `<>`. If you have numerical columns, you can also filter using `<`, `>`, `<=`, `>=`.

We can also do some basic fuzzy matching using the `LIKE` keyword:

```sql
SELECT month, type, lastOutcomeCategory FROM crimes
WHERE type LIKE '%theft';
```

This gives us crimes from both the 'Bicycle theft' and 'Other theft' types. Here the `%` character is a wildcard -- meaning that for the above query any record who has a type ending in 'theft' will match. To also match text starting with 'theft' you would have to add a `%` to the end too.

Note that `LIKE` is case-sensitive. If we wanted to be case-insensitive the easiest way to do it would be to use the `lower()` function to first convert the field to lowercase before matching:

```sql
SELECT month, type, lastOutcomeCategory FROM crimes
WHERE lower(type) LIKE '%theft';
```

Now if we want to do multiple filters we can just add them on using the `AND` keyword:

```sql
SELECT month, type, lastOutcomeCategory FROM crimes
WHERE lower(type) LIKE '%theft'
AND lastOutcomeCategory = 'Under investigation';
```

At this point you have run a few queries, and you probably have a bit of a feel about how they look -- keywords in capitals, with each new part of the query on a new line. However, though this is how SQL queries are conventually written it's purely for readability. You can write everything lowercase with newlines whereever makes sense for you and everything will still work.

**Check your understanding:** Can you write a query to find all bicycle theft crimes where the offender was either sent to prison or received a suspended prison sentence.

**Tip:** If you need a full list of all the different types of outcome, you can use the `DISTINCT` keyword to only get one of each value:

```sql
SELECT DISTINCT lastOutcomeCategory FROM crimes;
```


Summarising
-----------

SQL has [a number of] (https://www.postgresql.org/docs/current/static/functions-aggregate.html) aggregate functions which we can use to summarise our data in different ways.

***Aggregate function***: computes a single result from a set of input values. The simplest is `count()`, which instead of returning the rows you have selected, returns how many of them there are.

For example:

```sql
SELECT count(*) FROM crimes
WHERE type = 'Anti-social behaviour';
```

This shows us how many crimes classed as antisocial behaviour exist in our data. Since this function is just counting rows, we do not need to pass in a column name, it can just count everything, which is why we give it the value `*`.

For other functions that work on numerical columns, such as `sum()`, `avg()`, `min()`, and `max()`, you need to pass in the column name that you want that function to look at.


Grouping
--------

Using aggregate functions we can divide up our data into different groups. In Excel, this would be where we would be using a pivot table. In SQL, we use `GROUP BY`:

```sql
SELECT type, count(*) FROM crimes
GROUP BY type,
ORDER BY count(*) DESC;
```

You can group by multiple columns too. This query shows us how many crimes of each type have each outcome:

```sql
SELECT type, lastOutcomeCategory, count(*) FROM crimes
GROUP BY type, lastOutcomeCategory
ORDER BY type, count(*) DESC;
```

We can also use the `HAVING` clause to filter values computed from aggregate functions:

```sql
SELECT type, count(*) FROM crimes
GROUP BY type
HAVING count(*) > 1000
ORDER BY count(*) DESC;
```

What's the difference between `WHERE` and `HAVING`? Aggregate functions such as `sum()` can only be filtered inside a `HAVING`. You can only use `HAVING` if you have a `GROUP BY`. For everything else, use `WHERE`.

**Check your understanding:** First write a query to get a list of all the different types of offence in the data. Pick one, and write a query to bring back numbers for that type of offence showing how many resulted in each different outcome.


Joining
-------

The `JOIN` clause lets us connect one table to another via an ID column. If you're coming from Excel, think of it as the equivilent to a VLookup, though much more powerful.

Before we join anything together, we need to bring in another table to join our crimes data to.

We're going to use [the Index of Multiple Deprivation from December 2015] (https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/464430/English_Index_of_Multiple_Deprivation_2015_-_Guidance.pdf). This is the official measure of relative deprivation per neighbourhood in England. Each neighbourhood is ranked from 1 (most deprived) to 32,844 (least deprived).

The ONS calls these neighbourhoods lower-layer super output areas (LSOAs) of about 1,500 residents, and each has an ID. Since these IDs are also used within our crime data, we can use that column to link our two tables together.

First [download the data] (http://geoportal.statistics.gov.uk/datasets/75fcb66839a04725912194a2633e6b4b_0), then repeat the steps in the earlier section to import it in to Postgres. Call this table `deprivation`. Make sure you give the `imd15` column the type `integer`.

Again, it's a good idea to do a quick `SELECT` to check the data has imported correctly.

There are two main types of `JOIN`:
* `INNER JOIN`: The rows that match in both tables.
* `OUTER JOIN`: The rows that match in both tables, plus non-matching rows from one or both tables.

Outer joins are further subdivided into three types:
* `LEFT OUTER JOIN`: Includes non-matching rows from the first table given.
* `RIGHT OUTER JOIN`: Includes non-matching rows from the second table given.
* `FULL OUTER JOIN`: Includes non-matching rows from both tables.

If that seems unclear you might find [this article] (https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/) helpful, which uses Venn diagrams to visualise what each does.

Let's run our join to look at our crimes ordered by the level of deprivation in the neighbourhood:

```sql
SELECT crimes.*, deprivation.imd15 FROM crimes
INNER JOIN deprivation ON crimes.lsoaCode = deprivation.lsoa11cd
ORDER BY imd15;
```

Notice the `SELECT` part is a bit different, as we now have to specify a table for each column we want.

**Check your understanding:** Since we did an `INNER JOIN`, we are only seeing rows where an ID exists in both -- this may mean you may be seeing fewer rows than if you had just selected from `crimes` as some crimes have no known location. What query would we run if we wanted to see *every* crime, linked to the index of multiple deprivation where possible?


Getting your data out
---------------------

Most SQL clients have a button to download the results of a query to a CSV file, but we can do this directly in SQL too! We need the location where you want the new file to appear (including the filename), as before when we imported data. Here is an example that exports the results of the query `SELECT * FROM crimes LIMIT 10` to a CSV:

```sql
COPY (SELECT * FROM crimes LIMIT 10) TO '<location>'
WITH (FORMAT csv, HEADER true);
```
