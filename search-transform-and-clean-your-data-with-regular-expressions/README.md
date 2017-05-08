Search, transform, and clean your data with regular expressions
===============================================================

In this tutorial we are going to learn how to use *regular expressions*.

***Regular expressions***: Also known as regex or regexp, regular expressions are a mini language that's just for finding patterns in text.

They can be used to:

* Find text
* Extract text
* Replace text with some other text

A pattern can be anything that follows a regular format -- that includes email addresses, phone numbers, hashtags, passport numbers, and so on. A pattern could also be something more general, such as words that have been capitalised or put in quotes. Regular expressions are a way of writing down these formats, and finding things that match.

They are useful when you need to search for a pattern in your data rather than for something specific. For example, the ICIJ [used regular expressions](https://source.opennews.org/articles/people-and-tech-behind-panama-papers) to look for passport numbers in the Panama Papers. We can also use them to extract all the text that matches a pattern, allowing us to create new structured data, such as a list or a spreadsheet, out of a perhaps unstructured source, such as the contents of a webpage. For this reason they are often used when scraping data from websites. Perhaps most usefully, however, they can be used to power-clean your data by removing or rearranging problematic parts.

Support for regular expessions can be found all over the place. We are mostly going to be using them inside a code editor, but every mainstream programming language has support for working with them too. Sadly the specific syntax can vary from place to place, but the core -- what we will cover here -- is the same.


Getting set up
--------------

You will need to download and install a code editor such as [Atom](https://atom.io/) or [Sublime Text](https://www.sublimetext.com/).


Your first regular expression
-----------------------------

Before we start working with some real data in your code editor we need to understand the basic structure of a regular expression. First go to [the full text of the Queen's speech at the 2016 state opening of parliament](https://www.gov.uk/government/speeches/queens-speech-2016). Copy all of the text.

Now, go to [Regex101.com](https://regex101.com/) and paste the text we just copied into the large box.

Into the small box at the top, we are going to write our first regular expression:

```regex
legislation
```

You should see the explanation box on the right saying our regular expression simply matches those characters exactly. There should be a list of all the matches underneath. Matches in the text are highlighted in blue. Note that where we see the word starting with a capital letter it has not been matched.

This regex only has one component -- `legislation`, which is a literal in regex terminology.

***Literal***: A single letter or number that will match exactly what they are.

Notice that the small top box where we entered our regular expression has a `/` at the start and and another `/` at the end followed by a `g`. The `/` characters indicate the start and end of a regular expression. The `g` is a *flag* -- an extra option that determines how our regular expression should be understood. The `g` stands for global, and is by far the most common flag. It indicates that it shouldn't just find the first match (which is the default here), but look through everything and give us back all the matches.

So the simplest regular expression we could write is to search for exactly what we are looking for. But didn't we want to find patterns?


A better regular expression
---------------------------

Lets search for something more interesting. Replace `legislation` with this more complex regex:

```regex
[A-Z][a-z]+
```

We should see all words starting with a capital letter in the match information box on the right. You should also see the explanation box on the right with a bit more information in it this time. Let's break down what's happening here. The regex we just wrote has three components:

`[A-Z]` and `[a-z]` are *character classes*. The `+` is a *quantifier*.

***Character class***: Matches *one* of anything within the square brackets. Can be either the specific characters you want to match (eg. `[aeiou]` to match any vowel) or using a `-` to give a range (eg. `[a-z]` or `[0-9]`). These are case-sensitive, so if you want to match either capital or lowercase letters you would have to write `[A-Za-Z]`. This also shows how these components can be combined within the same class, so `[a-z@ ]` would match any lowercase letter, an @ symbol, or a space.

***Quantifier***: Indicates how many times the previous thing can be repeated. `+` means match one-or-more times. There is also `*`, meaning match zero-or-more times. A `?` means match zero-or-one times. We can also specify exactly how many times using curly braces -- `{3}` means match exactly three times. Again, you can give a range, though this time with a `,` -- so `{1,3}` means match once, twice, or three times. If you leave out the second number, that means infinity.

So, to break down what the expression we just wrote means: we match a capital letter, followed by one-or-more lowercase letters. Go back and look at the regular expression we just wrote and check that it makes sense to you.

Note here that we have been using characters like square braces, `+`, `*`, and `?`. What happens if we actually want to match those characters? Or to put it another way, what if we wanted our regular expression to treat them as literals? To do this we need to *escape* those characters.

***Escaping***: Asking the following character to be treated as a literal. For example, if we wanted to match words that are followed by a question mark we could use `[a-z]+\?`. You might be thinking, but what about if we wanted to match a literal `\`? Well we just use `\\`.

You might have seen by now how regular expressions can end up looking like long inscrutable series of characters. But the components that make them up are simple -- it's just a matter of breaking down what each part does then putting it back together in your mind. You might also be thinking that it's hard to remember all this, and it certainly will be at first, so you might want to keep a [cheat sheet](https://www.debuggex.com/cheatsheet/regex/pcre) handy whilst you're writing regular expressions.

**Check your understanding:** Write a regular expression to match all the acronyms used -- ie. all the all-capital words longer than one letter.


Finding a pattern
-----------------

Now we have a rough of idea of how regular expressions work we can move into doing things within our code editor.

We're going to look at some text from [Hansard](https://en.wikipedia.org/wiki/Hansard), the verbatim report of everything said in parliament. [Find the last Wednesday when the Commons sat](https://hansard.parliament.uk/commons), then look for *'oral answers to questions'*, then *'prime minister'*. Once you've found a page in the top right there should be a 'text only' link that lets you download a plain text file. Open that file in your code editor.

Now:

* **Atom:** Go to Find, then Find in Buffer. You will need to then turn on regex mode by clicking the `.*` button on the right next to the search field. You will also need to turn on case sensitivity using the `Aa` button.
* **Sublime Text:** Go to `Find`, then `Find...`. You will need to then turn on regex mode by clicking the `.*` button on the left next to the search field. You will also need to turn on case sensitivity using the `Aa` button.
* **Any other editor:** Normally when you search there is a way to turn on regular expressions. You may need to turn on case sensitivity too as some editors use case-insensitive regular expressions by default.

Looking through the text we can see that each of the questions being asked to the PM are given with a letter Q, followed by a number, followed by a full stop. We can write an expression to look for that pattern:

```regex
Q[0-9]{1,2}\.
```

Note we gave a quantifier for the question number so we catch all questions if there's more than nine. We have also escaped the full stop. That's because otherwise `.` is used for matching one of any character at all -- letters, numbers, punctuation, anything.

You can also see in the text that people speaking have a three-letter abreviation of their party given in brackets after their name. Using this we can write an expression to look just for questions asked by Conservative members:

```regex
\(Con\)\nQ[0-9]{1,2}\.
```

There's a couple of things in here we haven't covered yet.

You will have noticed by now that writing common classes for matching letters and numbers can be a bit of a hassle. Most places where regular expressions are supported, including Atom and Sublime Text, give us shortcuts for writing these:

* `\w`, which stands for word characters, is short for `[A-Za-z_]`.
* `\W`, which stands for non-word characters -- ie. anything other than the above.
* `\d`, which stands for digit, is short for `[0-9]`.

There are also shortcuts for things that can't be typed:

* `\n`, which represents a new line normally. For files created on Windows, this is a bit different: `\r\n`.
* `\b`, which represents the start or end of a word.

It turns out that some of these files published by Parliament are Windows-formatted, but others aren't. So if you're not seeing any matches try replacing `\n` with `\r\n`. Also note we have escaped the parenthesis -- that's because they have a special meaning we will come on to later.

**Check your understanding:** Can you find all the questions in the text? That is, sentences ending in a question mark. Remember you will need to escape the question mark itself!

If we wanted to find all the words that don't use constanants we could write:

```regex
\b[^aeiouAEIOU\W ]+\b
```

This uses a *negated* character class, which is done by putting a `^` character at the start of a class, and indicates that we are looking for any character other than what we have given in the class. We are also using a couple of shortcuts from the list above.

**Check your understanding:** Find all the words that don't include the letter *e*.

Let's say we wanted to go through each time either the prime minister or Jeremy Corbyn was speaking. Sometimes their names are used in speech by other people, but given that when someone speaks their name is given on a line of its own we can write:

```regex
^The Prime Minister$|^Jeremy Corbyn$
```

This uses the 'pipe' character, `|`, to indicate we want one thing or another. A transatlantic example might be `courgette|zucchini` to find either. It need not just be two though -- you can have any number. The `^` indicates the start of a new line, and the `$` indicates the end of a line.

**Check your understanding:** Write a expression to find every time anyone says any the words: strong, stronger, or stable.

Finally, note that as well as searching through single files, most code editors, including Atom and Sublime Text, give us ways to search through multiple files using regular expressions.


Extracting a pattern
--------------------

Now we have got a feel of how to match things let's look at extracting our matches. This is often a useful way to create structured data out of some unstructured text.

We are going to look at what and who Donald Trump has been tweeting about. Firstly we need some of his tweets -- to get them go to [his profile](https://twitter.com/realDonaldTrump). This page auto loads in his tweets as you scroll to the bottom, so go down to the bottom a few times so we have a good amount of tweets on the page. Now select everything by going Edit, then Select All. Then copy. This copies everything on the page, including the list of things trending across all of Twitter -- we will remove this in a moment.

Create a new file in your code editor and paste in the contents. It will look a bit jumbled up, but it's still good enough for our purposes. The first thing we will need to do, however, is remove that trending list -- they should be fairly near the top. Find them in the text and remove them.

Now, let's find all the hashtags he has used:

```regex
#\w+
```

Press `Alt-Enter` to select everything that matches our regex, then copy it. Create a new file in your code editor and paste it in -- you should see all of our matches, each on a new line. At this point we could use a pivot table to quickly find out which hashtags have been used the most. (This list will include retweets, we're not going to worry about them.)

**Check your understanding:** Write another regex to extract out all the `@` usernames that Trump has mentioned. You will also pick up his own username for every tweet, but let's not worry about that.

You might have thought earlier that the problem with *or* (`|`) is that it applies to the whole expression. So if we wanted to match either the US or UK spelling of the word *organise* we would have to write `organise|organize` -- a lot of duplication given that it's only one letter different, and this only gets worse for more complicated regexes. We can use *groups* to solve this problem.

***Groups***: Indicated by parenthesis, can be thought of as a sub-regex. The scope of an `or` only applies within the group.

For example, we could also write that regular expression as `organi(s|z)e` using a group. One superpower that groups give us is that quantifiers will apply to the whole group.

**Check your understanding:** Trump often tweets times that he will be speaking somewhere. Write an expression to find all the times. Note that sometimes he includes am/pm and sometimes not. Don't worry if your expression isn't perfect, but you should be able to get most of them.


Challenge: Replacing a pattern with something else
--------------------------------------------------

We can also use regular expressions to replace something we have matched with something else. This can be useful for data cleaning.

In programming languages regular expressions are often written with both the matching component and the replacement all-together, with a `/` in between. For example, `/David/Theresa/g` would replace all mentions of `David` with `Theresa`.

In Atom there should already be box for a replacement under the search box. In Sublime Text you will need to go `Find` then `Replace...` to make it appear.

Tthis uses another power of groups. Anything we put inside a group can be brought out in the replacement. You do this using a `$` followed by the number of the group. (Your first group is number 1.) For example, we could match email addresses with the regex:

```regex
[a-zA-Z]+@([a-zA-Z.]+)
```

Note that the bit after the `@` is in a group. Say we wanted to anonymise these email addresses, but keep the domain. We could make our replacement:

```regex
redacted@$1
```

To check this works how we expect create a new file and write down some email addresses. You will need to click the 'Replace All' button this time for it to run.

If you're interested in doing more data cleaning with regular expressions [there's a tutorial here](https://docs.google.com/document/d/1DvAM4lnGJLefo9skD8GgM-_9S1BEhpjJfV86yhJavI0/edit#) to follow. The start is things we have already covered, but go down to 'Splitting Socrata addresses' for the main tutorial.


Challenge: A regex crossword
----------------------------

Got this far? See how you get on with this [Regex crossword](https://regexcrossword.com/).
