Fetch and enrich data with APIs
===============================

In this tutorial we are going to cover what an API is, and how you can use the Opencorporates company data API to fetch particular sets of data you need, and to enrich your existing data with theirs.

***[Opencorporates](https://opencorporates.com/):*** An independent company who has scraped many of the world's company registries, such as the UK's [Companies House](https://beta.companieshouse.gov.uk/), into a single easily-searchable database. For example, [this is the entry for Tesco Plc](https://opencorporates.com/companies/gb/00445790).

***API:*** Stands for Application Programming Interface. If websites are human interfaces, APIs are the interfaces for machines. Instead of HTML, APIs normally return Json. Unlike an HTML webpage, APIs no have no colours or other styling. They do, however, make it very easy to extract information without resorting to scraping. In this case we will be using Opencorporates' API to automate looking up companies in their database.

***Json:*** A standard format for storing and transmitting data. Older APIs sometimes return data in XML format instead, which achieves much the same thing as Json. Many APIs support both formats.


Getting set up
--------------

We first need a text editor. There is more information on what that is and where to get one in this guide:

* [What is a text editor and where do I get one?](https://github.com/maxharlow/tutorials/tree/master/getting-started#a-text-editor)

We also need to install Python. There are details on how to install such tools in these two guides:

* [What and where is the terminal?](https://github.com/maxharlow/tutorials/tree/master/getting-started#the-terminal)
* [How should I install things?](https://github.com/maxharlow/tutorials/tree/master/getting-started#installing-things)

### Mac

In the terminal, use `brew` to install Python:

    $ brew install python3

### Windows

If you are using the terminal the Windows 10 way via Bash on Windows you can use `apt-get` to install Python:

    $ apt-get install python3

If you have a another version of Windows and you are using Cygwin as your terminal can use `apt-cyg` to install python:

    $ apt-cyg install python3

### Linux

In the terminal, use `apt-get` to install Python:

    $ sudo apt-get install python3

<hr>

You should also create a new project directory for the files we are going to be creating in this tutorial. If you've not done this before, try following these two guides:

* [How do I use the terminal?](https://github.com/maxharlow/tutorials/tree/master/getting-started#essentials-of-the-terminal)
* [How should I organise my files?](https://github.com/maxharlow/tutorials/tree/master/getting-started#organising-your-files)

From the terminal, make sure you are in your projects directory. Then run:

    $ mkdir learning-apis
    $ cd learning-apis


Your first request
------------------

You can make your first request to the Opencorporates API by going here in your browser:

https://api.opencorporates.com/companies/gb/00445790

That is Json. If you look closely you can see much of the same data that was available on the web page above, although in a less human-readable way. Lets pause for a moment and understand what has happened here.

When you went to that URL, your browser made a HTTP `GET` request and recieved a `200 OK` response. But what does that mean?

***HTTP:*** Those four letters at the start of every URL. This is the technology responsible for transmitting information between clients such as us and servers. There are different types of HTTP requests.

***GET request:*** The most common type of HTTP request. Simply says you want to 'get' the information the URL relates to. We normally write `GET` all uppercase, though the letters don't stand for anything. There are other HTTP verbs for creating, updating, and deleting pages, but we won't be using those here.

***`200 OK` response:*** After making an HTTP request, you will recieve a response from the server. HTTP responses always include a three-digit code indicating whether your request was successful or not. Requests that start with a `2` indicate that everything is fine, with a `4` indicate that you made a mistake, and with a `5` indicate that something has gone wrong on the server side. You probably have come across a `404 Not Found` or perhaps a `503 Service Unavailable` response on the web before, but a `200 OK` is the normal response to a successful request. Wikipedia has [a full list](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) of all the possible codes, though most are quite rare.


Automatic lookups
-----------------

We are now going to use Python to automatically make multiple HTTP requests, and extract information from the Json in each response into a spreadsheet.

Python comes with a tool called Pip for installing extra libraries. To start with we are going to install the `requests` library, which we will use for making HTTP requests:

    $ pip3 install requests

Back in your text editor, start a new file and import `requests` as well as the `sys`, `csv`, and `json` libraries that come with Python:

```python
import sys
import csv
import json
import requests
```

Underneath that, let's write a `lookup` function to call the Opencorporates API with a jurisdiction and company number and return the results. This function creates a URL for a given jurisdiction code and company number and makes an HTTP request. If it recieves anything but a `200 OK` response it prints out an error message. Otherwise it pulls out a few key fields from the API response and returns those:

```python
def lookup(jurisdiction, number):
    url = 'http://api.opencorporates.com/companies/' + jurisdiction + '/' + number
    response = requests.get(url)
    if response.status_code == 200:
        data = json.loads(response.text)
        company = data['results']['company']
        return {
            'name': company['name'],
            'type': company['company_type'],
            'incorporated': company['incorporation_date'],
            'address': company['registered_address_in_full']
        }
    else:
        print('Error: ' + str(response.status_code))
```

How did we know that this is the URL we need? APIs typically have a documentation site. Reading through the [Opencorporates API documentation](https://api.opencorporates.com/documentation/API-Reference) tells us the different types of request that Opencorporates accepts and what response you should expect.

In this case we are looking up a company using their jurisdiction and company number. The jurisdiction is a two-letter code for each of the different bits of the world that have their own company registry -- in most cases countries, but sometimes states or cities. Since each registry has its own numbering system, we need both bits of information to accurately look up a specific company.

To check that everything works so far lets add some code so we can call our `lookup` function. This calls the `lookup` function with the first two arguments from the terminal, and prints the result:

```python
print(lookup(sys.argv[1], sys.argv[2]))
```

Now to try running the first part of our program. Inside your text editor, save the file as `oclookup.py` to the project directory you created earlier.

Back in the terminal, navigate to your project directory.

* [How do I use the terminal?](https://github.com/maxharlow/tutorials/tree/master/getting-started#essentials-of-the-terminal)

If you now list all the files in the directory:

    $ ls

You should see `oclookup.py`.

Now run our file and pass it the details for Tesco Plc:

    $ python3 oclookup.py gb 00445790

You should see some information on the company printed out to the terminal. This is good!


Putting it on loop
------------------

Now let's modify our program to look up a whole list of companies instead of just one.

Beneath the `lookup` function create a new function called `from_file`. This function expects a CSV file with two columns, `jurisdiction` and `number`. It opens the file and calls the `lookup` function with the information from each row. After each lookup it adds the result to a list. When all rows have been looked up the results are returned:

```python
def from_file(filename):
    results = []
    with open(filename, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            result = lookup(row['jurisdiction'], row['number'])
            results.append(result)
    return results
```

Remove the last line of the file that we added before and replace it with:

```python
print(from_file(sys.argv[1]))
```

Now let's try running our program again, but this time with a file as the input. Download [this list of companies](https://raw.githubusercontent.com/maxharlow/tutorials/master/opencorporates-api/company-numbers.csv) and move it into your project directory. This is a list of all the companies who donated to the Vote Leave campaign during the EU referendum. But who were they?

To find out go back to the terminal and run:

    $ python3 oclookup.py company-numbers.csv

You should see information for each of the companies printed out to the terminal.


Dealing with rate limits
------------------------

At this point you might start to see `403` errors being printed out. We can avoid this by passing an API key with our requests. [Sign up for a Opencorporates API key.](https://opencorporates.com/api_accounts/new)

***Rate limit:*** Often used by APIs to say how many requests can be made by one person within a given period of time. For Opencorporates [we are limited to 500 requests a month](https://api.opencorporates.com/documentation/API-Reference#usage_limits) unless we use an API key.

***API key:*** A code sent with each request to let an API track how many requests you are making. Having a key is mandatory for many APIs.

To send your API key with each request we need to modify the `url` variable in the `lookup` function to be:

```python
key = 'YOUR-API-KEY-HERE'
url = 'http://api.opencorporates.com/companies/' + jurisdiction + '/' + number + '?api_token=' + key
```

If you run your program again it should run successfully without any `403` errors.


Getting a file back
-------------------

At this stage we are making our requests successfully, but it would be much better if the data went into a CSV file instead of being printed to the terminal.

Add a new `to_file` function beneath `from_file`:

```python
def to_file(results):
    with open('company-details.csv', 'w') as csvfile:
        header = results[0].keys()
        writer = csv.DictWriter(csvfile, header)
        writer.writeheader()
        writer.writerows(results)
```

Then change the last line of your program to call `to_file` instead of `print`:

```python
to_file(from_file(sys.argv[1]))
```

Run your program again:

    $ python3 oclookup.py company-numbers.csv

You should now see nothing printed out to the terminal this time. However there should be a new `company-details.csv` file in the same directory. Open it up and you should see details for each of the companies.


Challenge: Getting the officers
-------------------------------

One other bit of information Opencorporates holds is a list of officers for each company -- including their directors. Can you modify your program to create a list of all the officers of all the companies in `company-numbers.csv` instead? Can we find who the people were behind the companies who funded Vote Leave?

The [Opencorporates API documentation](https://api.opencorporates.com/documentation/API-Reference) may help if you get stuck.
