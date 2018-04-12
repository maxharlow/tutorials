Find connections with fuzzy matching
====================================

In this tutorial we are going to take a couple of different datasets, and then find the names that are listed in both, even when those names aren't written in quite the same way. To do this we'll apply a technique called *fuzzy matching*, using a tool called [CSV Match](https://github.com/maxharlow/csvmatch).

**Fuzzy matching**: Matching up two sets of names of things that aren't quite the same, but refer to the same thing. Typically in journalism that means names of people or names of companies.

Let's look at a real example. How many people are listed here?

```
Lord Philip Harris
Lord Harris of Peckham
Lord Philip C. Harris
Philip Lord C Harris
Lord Phillip Harris of Peckham
Lord na Harris
Lord Harris
Philip Harris, Baron Harris of Peckham
```

These do indeed relate to one person -- the different ways [Lord Harris](https://beta.parliament.uk/people/Hakx59lu)' name is seen on the [Electoral Commission's party finance data](http://search.electoralcommission.org.uk), his Wikipedia page, and in news reports. Intuitively we can use our powerful human brains to see that this might be the case here. But if you've got his name written one way in one file, and a different way in another file, the computer is going to say that there's no matches. This is the problem that fuzzy matching solves.

This technique has been used by the Guardian to find [the names of various public figures](https://www.theguardian.com/uk-news/2014/jul/09/offshore-tax-dealings-celebrities-sportsmen-leaked-jersey-files) and [donors to political parties](https://www.theguardian.com/politics/2014/jul/08/offshore-secrets-wealthy-political-donors) using data leaked from a wealth management firm matched against data scraped from [Forbes rich lists](https://www.forbes.com/lists) and the Electoral Commission. Global Witness used it to show how [Myanmar's huge jade industry is controlled by military elites, family members of the former dictator, and drug lords](https://www.globalwitness.org/en/campaigns/oil-gas-and-mining/myanmarjade) by combining mining licences matched against names of sanctioned people and companies. News agency Irin used the tool we're going to be learning about today, CSV Match, to find that [the United Nations had been paying money to a group involved in selling blood diamonds to fund militias in the Central African Republic](https://www.irinnews.org/investigation/2016/09/02/exclusive-un-paying-blacklisted-diamond-company-central-african-republic) using the UN's list of contractors matched against the UN's list of sanctioned companies.

You may have noticed a pattern in these examples -- what we have here is a repeatable recipe we can use in investigations. Banks and law firms have actually been using a process like this for years to identify people, companies, and transactions where they either just need to be more careful, or where it's simply the law not to do business with them due to sanctions or other reasons.


Getting set up
--------------

We also need to install Python and CSV Match from the terminal.

* [What and where is the terminal?](https://github.com/maxharlow/tutorials/tree/master/getting-started#the-terminal)
* [How should I install things?](https://github.com/maxharlow/tutorials/tree/master/getting-started#installing-things)

### Mac

In the terminal, use `brew` to install Python:

    $ brew install python3

### Windows

If you are using the terminal the Windows 10 way via Bash on Windows you can use `apt-get` to install Python:

    $ apt-get install python3

If you have a another version of Windows and you are using Cygwin as your terminal can use `apt-cyg` to install Python:

    $ apt-cyg install python3

### Linux

In the terminal, use `apt-get` to install Python:

    $ sudo apt-get install python3

<hr>

We are not actually going to be using Python in this tutorial, however Python comes with Pip, which is a tool for installing things written in Python, and CSV Match is one of those things.

    $ pip3 install csvmatch

You should also create a new project directory for the files we are going to be creating in this tutorial.

* [How do I use the terminal?](https://github.com/maxharlow/tutorials/tree/master/getting-started#essentials-of-the-terminal)
* [How should I organise my files?](https://github.com/maxharlow/tutorials/tree/master/getting-started#organising-your-files)

From the terminal, make sure you are in your projects directory. Then run:

    $ mkdir learning-csvmatch
    $ cd learning-csvmatch


Getting the data
----------------

We have six sets of data we're going to be looking at. Download each of them.

1. Forbes world billionaires list. [The ~2,000 richest people in the world.](https://www.forbes.com/billionaires/list) **[Download here.](https://raw.githubusercontent.com/maxharlow/tutorials/master/find-connections-with-fuzzy-matching/forbes-billionaires.csv)**
2. Forbes American billionaires list (aka. the Forbes 400). [The ~400 richest people in America.](https://www.forbes.com/forbes-400/list) **[Download here.](https://raw.githubusercontent.com/maxharlow/tutorials/master/find-connections-with-fuzzy-matching/forbes-forbes-400.csv)**
3. Forbes Chinese billionaires list. [The ~400 richest people in China.](https://www.forbes.com/china-billionaires/list) **[Download here.](https://raw.githubusercontent.com/maxharlow/tutorials/master/find-connections-with-fuzzy-matching/forbes-china-billionaires.csv)**
4. CIA world leaders list. [Almost 6,000 heads of state and cabinet members from governments around the world, excluding the US.](https://www.cia.gov/library/publications/world-leaders-1) **[Download here.](https://raw.githubusercontent.com/maxharlow/tutorials/master/find-connections-with-fuzzy-matching/cia-world-leaders.csv)**
5. Politico's unauthorised White House visitors list. [The ~3,600 names from a crowdsourced project to list all who have visited the Trump White House.](https://www.politico.com/interactives/databases/trump-white-house-visitor-logs-and-records/index.html) **[Download here.](https://raw.githubusercontent.com/maxharlow/tutorials/master/find-connections-with-fuzzy-matching/white-house-visitors.csv)**
6. The UN sanctions list. [People, groups, and companies sanctioned by the United Nations.](https://www.un.org/sc/suborg/en/sanctions/un-sc-consolidated-list) **[Download here.](https://raw.githubusercontent.com/maxharlow/tutorials/master/find-connections-with-fuzzy-matching/un-sanction.csv)**


Once they're downloaded, move them into the projects directory you just made. Then check they're all in the right place from the terminal:

    $ ls

You should see a list of the six files.


Exact matches
-------------

To start off we're going to do some exact matching, and then we'll bring in the fuzzy element after. Let's try and answer this question: how many names on the Forbes world billionaires list are also on their China billionaires list?

Before we start matching up these files we need to know what columns they have, and what's in those columns. The easiest way to do this is just with Excel, or whatever other spreadsheet program you have installed already.

Let's first look at `forbes-china-billionaires.csv`, so open that up. We're interested in maching up these files based on the name of each individual. We have a column here with exactly that -- `name`, and it's all lowercase. That's important, as we will need to tell CSV Match which columns to look at, and they need to be written exactly as they are in the spreadsheet..

Now open up the `forbes-billionaires.csv` file. We have another name column. Helpfully it has the exact same title -- `name` again.

Now we have the information we need to run our first command:

    $ csvmatch \
        forbes-billionaires.csv \
        forbes-china-billionaires.csv \
        --fields1 name \
        --fields2 name

Let's look through what's going on here. Firstly we are typing in the name of the tool, `csvmatch`. Then we have a space and a backslash. This tells the computer we are going to go onto a new line, but we haven't finished typing our command, so it knows not to run it yet. We could also have typed this all on one line, but it tends to be easier to read on multiple lines. Next we have our first file name, and then our second. Then we need to tell it the column names, or fields we are going to be matching on. On the last line we don't use a backslash, so when we press enter the computer knows to run the command.

You should see a long list of names filling the screen. These are our matches! But wouldn't it be more useful if they were in a file?

To send the output from CSV Match into a file we need to add an angle bracket we need another line, a `>` character, and then the name of our output file:

    $ csvmatch \
        forbes-billionaires.csv \
        forbes-china-billionaires.csv \
        --fields1 name \
        --fields2 name \
        > billionaires-from-china.csv

Open the `billionaires-from-china.csv` file and you should see your results in a nice spreadsheet file that could be used for further analysis.

**Tip:** In the terminal, you can press the up key to get the command you just ran. You can then edit it there and run it again without having to type it all out. However, note that if you typed it on multiple lines it will show up as being all on one line.

**Tip:** If you're using a Mac you can type `open` followed by the name of the file in the terminal, and the file will be opened up in in its default program, such as Excel. So for this example enter `open billionaires-from-china.csv`.


Getting the columns we want
---------------------------

So by default CSV Match only outputs the columns that have been used for matching. In our case it was the two name columns. Let's just get the list of names from the world billionaires file (the first one), and their ranking in that list. Let's also change the filename from the command we ran before so our new results don't overwrite our old file:

    $ csvmatch \
        forbes-billionaires.csv \
        forbes-china-billionaires.csv \
        --fields1 name \
        --fields2 name \
        --output 1.name 1.realTimeRank \
        > billionaires-from-china-ranked.csv

Now open up `billionaires-from-china-ranked.csv` and check the results are what you expect.

**Check your understanding:** Can you adapt this to output the following columns: their name from the first file, their rank from the second file, and their country from the first file.


Naive approaches to fuzzy
-------------------------

So far when we've been running exact matches, they really have been exact -- case-sensitive, in fact. One common way to make a match fuzzier is to ignore the case of the letters, but actually there are a few other things we can ignore which are often incidental to a name. We can:

* Ignore case
* Ignore common name prefixes (Mr, Ms, etc)
* Ignore other domain-specific words
* Ignore non-alphanumeric characters
* Ignore non-latin characters (é, å, ß, etc)
* Ignore the order the words are in

These aren't the full-blown fuzzy algorithms that we'll be seeing later. However combining these 'naive' approaches will often give you some pretty good matches. This approach tends to be relatively fast, too.

Let's see an example:

    Orbán, Viktor  =  Viktor Orban  ?  These don't match! In fact every character is different. But let's ignore non-latin characters...
    Orban, Viktor  =  Viktor Orban  ?  Notice the á has become an a. Now let's remove non-alphanumerics...
    Orban Viktor   =  Viktor Orban  ?  The comma in the name has now gone. Finally let's sort the words in alphabetical order...
    Orban Viktor   =  Orban Viktor  ?  And it's a match!

Now let's see how this works in practice with some of our data. Let's answer this question: which names from the CIA world leaders list are on the White House visitors list?

The first thing to do is open up the `cia-world-leaders.csv` file. We need to look for the heading of the column we want to use -- it's `leader_name`. Whilst we're here, let's look at the data in this column -- looks like their style is to write surnames in all-capitals. Perhaps this will be a problem for us?

Then open up the `white-house-visitors.csv` file and look for the name column there.

Let's try a straight match, as we did before, and see if we get any results:

    $ csvmatch \
	    cia-world-leaders.csv \
	    white-house-visitors.csv \
	    --fields1 leader_name \
	    --fields2 visitor_name

You should see... nothing. Zero matches. Perhaps there aren't any. Or perhaps we just need to apply some fuzziness? We saw that surnames were written in all-capitals in the world leaders list, but not in the White House visitors list, so that's probably the reason we're not seeing any results. Let's try making our match case-insensitive by adding the `--ignore-case` *flag*. Let's also put the output into a file too:

**Flag**: A flag is an extra option given to a command line program to turn on a feature, or give it extra information. Often the same flag can be written two ways: a long way, starting with two hypens, such as `--ignore-case`, and a short way, with just a single hyphen followed by a single letter, such as `-i`. If you have multiple flags written the short way you can combine them with a single hypen to save even more space -- so `-i -a` could also be written `-ia`.

    $ csvmatch \
	    cia-world-leaders.csv \
	    white-house-visitors.csv \
	    --fields1 leader_name \
	    --fields2 visitor_name \
	    --ignore-case \
	    > leaders-visiting-trump.csv

Open the `leaders-visiting-trump.csv` file, and you should now see a few hundred results! Make a note of the number.

**Check your understanding:** Write out this command again, but using the short format versions of the flags, and put the results in a different file. The short formats for `--fields1` and `--fields2` are `-1` and `-2`. If it has worked the results will be exactly the same.

Now let's combine multiple naive approaches to get an even fuzzier match. The four we are going to use are ignoring case (`-i`), ignoring non-alphanumeric characters (`-a`), ignoring non-latin versions of characters (`-n`), and ignoring word order (`-s`). Putting it all together gives us:

    $ csvmatch \
	    cia-world-leaders.csv \
	    white-house-visitors.csv \
	    --fields1 leader_name \
	    --fields2 visitor_name \
	    -ians \
	    > leaders-visiting-trump-2.csv

If you compare the number of results in the new file to the one before, you should see that making our matching fuzzier has given us some extra potential matches.


Fuzzy algorithm #1: Levenshtein
-------------------------------

Now we've covered the basics, let's look at a 'proper' fuzzy matching algorithm.

The most common approach to doing this is to count the number of additions, removals, and substitutions that are needed to change one name into another, giving us a score at the end of how many changes had to be made. This is called the *edit distance*.

One of the most well-known algorithms using this approach is the *Levenshtein* algorithm, so named after a Russian mathematician who came up with the idea.

For example, say one file had the name `Max Harlow`, and the other had `Mac Harlod`. How similar are they? Well both are 10 letters long, and going through one letter at a time we can see that only two letters are different. That gives us a similarity score of 80%. If we say our threshold to consider the two a match is 60%, these two are going to come back as potential matches. On the other hand comparing `Max Harlow` to `John Dales` would give us only a 10% similarity score, as only the L in the surname is the same letter in the same position -- below the threshold.

Let's use this technique to answer this question: how many Chinese billionaires appear in the CIA world leaders list? We're going to use the `--fuzzy` flag, and tell it we want to use the `levenshtein` algorithm:

    $ csvmatch \
	    cia-world-leaders.csv \
	    forbes-china-billionaires.csv \
	    --fields1 leader_name \
	    --fields2 name \
	    --fuzzy levenshtein \
	    > billionaire-chinese-leaders.csv

You should see about 28 results.


Fuzzy algorithm #2: Metaphone
-----------------------------

Another approach is to look at the phonetics of how names are typically pronounced. One of the most common is called Metaphone.

For example, if it were comparing `Catherine` with `Kathryn` it'd be a match, but comparing `Dave` with `David` would not be a match.

This approach works pretty well, and catches things that wouldn't be caught with edit-distance type approaches -- particularly where information has been taranscribed from speech, or when you have names written in another language that have been transliterated into English. However, not having a scoring number means you can't adjust how sensitive it is. Worse, Metaphone is focused on English pronunciation of traditional English-language people names. There are some other algorithms that focus on other languages, but you have to pick the right one for your data, and if it's mixed of names from different backgrounds it might not be so effective.

Let's use this approach to answer this question: which world leaders from the CIA list are on the United Nations sanctions list? We're going to use the `--fuzzy` flag again, but specify the `metaphone` algorithm:

    $ csvmatch \
	    cia-world-leaders.csv \
	    un-sanctions.csv \
	    --fields1 leader_name \
	    --fields2 name \
	    --fuzzy metaphone \
	    > sanctioned-leaders.csv

We could have done this with case-insensitive matching, and you'd get seven results. With Metaphone it's 19, though some of those are almost certainly not the same, we do see names being match such as `JON Kyong Nam` and `YO'N CHO'NG NAM`. These may not  actually are the same person, but these are the kinds of matches we can get with a phonetic approach that won't see otherwise.

Fuzzy algorithm #3: Bilenko
---------------------------

The third approach is to use machine learning. This is a newer area, and there isn't a most common way of doing this yet. However, one technique is built on a library called [Dedupe](https://github.com/dedupeio/dedupe).

This approach takes some records and asks you, the user, whether they are the same. After you have told the computer about a few records than do and don't match manually, it uses the power of machine learning to extrapolate out whether there are any other matches across the entire rest of your data.

Let's return to one of our earlier questions to see what results we can get with a machine learning approach: which names from the CIA world leaders list are on the White House visitors list? This command should be starting to look quite familiar now:

    $ csvmatch \
	    cia-world-leaders.csv \
	    white-house-visitors.csv \
	    --fields1 leader_name \
	    --fields2 visitor_name \
	    --fuzzy bilenko \
	    > leaders-visiting-trump-3.csv

After running that it should start asking you questions! Answer them with `y` for yes, `n` for no. The more you answer of these, the better the match will be. However you should aim to get 10-15 of both yes and no answers. When you've done that or just fed up, press `f` to finish.
