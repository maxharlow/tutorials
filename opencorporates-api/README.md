Using the Opencorporates API
============================

In this tutorial we're going to cover what an API is, and how we can use the Opencorporates API as part of a data-driven investigation.

*[Opencorporates] (https://opencorporates.com/)*: An independent company who has scraped many of the various company registries like the UK's [Companies House] (https://beta.companieshouse.gov.uk/) into a single easily-searchable database. For example, [this] (https://opencorporates.com/companies/gb/00445790) is the entry for Tesco Plc.

*API*: Stands for Application Programming Interface. If normal HTML websites are human interfaces, these are the interfaces for machines. Unlike a HTML webpage they have no colours or care for how they look. Instead of HTML APIs normally return Json. They do however make it very easy to extract information without having to resort to scraping. In this case we will be using Opencorporates' API to automate looking up companies using their site.

*Json*: A standard format for storing and transmitting data. Older APIs sometimes return XML instead which achieves much the same thing as Json. Many APIs support both formats.


Our first request
-----------------

We can make our first request to the Opencorporates API by going here in your browser: https://api.opencorporates.com/companies/gb/00445790. That is Json. If you look closely you can see much of the same data that was available on the web page above, though it is perhaps not as readable.

Lets pause for a moment and understand what has happened here.

When you went to that URL your browser made a HTTP `GET` request and recieved a `200 OK` response. What does that mean?

*HTTP*: Those four letters at the start of every URL. This is the technology responsible for transmitting information between clients such as us and servers. There are different types of HTTP request for getting information.

*GET request*: The most common type of HTTP request. Simply says you want to 'get' the information the URL relates to. We normally write `GET` all uppercase, though the letters don't stand for anything. There are other HTTP verbs for creating, updating, and deleting pages, but we won't be using those here.

*`200 OK` response*: After making a HTTP request you recieve a response from the server. HTTP responses always include a three-digit code indicating whether your request was successful or not. Requests that start with a `2` indicate that everything is fine, with a `4` indicate that you made a mistake, or with a `5` indicate that something has gone wrong on the server. You probably have come across a `404 Not Found` or perhaps a `503 Service Unavailable` response on the web before, but a `200 OK` is the normal response to a successful request. Wikipedia has [a full list] (https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) of all the possible codes, though most are quite rare.


Automatic lookups
-----------------

We are now going to use Python to automatically make hundreds of HTTP requests, and extract information from the Json in each response into a spreadsheet.

Firstly you will need to [install Python] (https://www.python.org/downloads/) if you do not have it already. You will also need a code editor such as [Sublime Text] (https://www.sublimetext.com/) or [Atom] (https://atom.io/).

This tutorial presumes you are using a Mac or Linux, which have access to the terminal. The `$` symbol indicates the start of a terminal command -- you don't type that though. If you look at your terminal there should be a `$` at the start of each line already. If you are using Windows everything is different and much more difficult.

Python comes with a tool called Pip for installing extra libraries. To start with we are going to install the `requests` library, which we will use for making HTTP requests:

    $ pip install requests

Back in your code editor start a new file and import `requests` as well as the `sys`, `csv`, and `json` libraries which come with Python:

```python
import sys
import csv
import json
import requests
```

Underneath that lets write a `lookup` function to call the Opencorporates API with a jurisdiction and company number and return the results:

```python
def lookup(jurisdiction, number):
    url = 'http://api.opencorporates.com/companies/' + jurisdiction + '/' + number
    response = requests.get(url)
    if response.status_code == 200:
        data = json.loads(response.content)
        company = data['results']['company']
        return {
            'name': company['name'],
            'type': company['company_type'],
            'incorporated': company['incorporation_date'],
            'address': company['registered_address_in_full']
        }
    else:
        print('Error: ' + response.status_code)
```

This function creates a URL for a given jurisdiction code and company number and makes a HTTP request. If it recieves anything but a `200 OK` response it prints out an error message. Otherwise it pulls out a few key fields from the API response and returns those.

How did we know that this is the URL we need? APIs typically have a documentation site. Reading through the [Opencorporates API documentation] (https://api.opencorporates.com/documentation/API-Reference) tells us the different types of request that Opencorporates accepts and what response you should expect.

In this case we are looking up a company using their jurisdiction and company number. The jurisdiction is a a two-letter code for each of the different bits of the world which has its own company registry -- in most cases countries, but sometimes states or cities. Since each registry has its own way of numbering companies we need both bits of information to accurately look up a specific company.

To check that everything works so far lets add some code so we can just call our `lookup` function:

```python
print(lookup(sys.argv[1], sys.argv[2]))
```

This calls the `lookup` function with the first two arguments from the terminal, and prints the result.

Now to try running the first part of our program. Create a new folder somewhere for your work. Inside your code editor save the file as `oclookup.py` to that folder. In the terminal navigate to your folder by running something like:

    $ cd ~/Documents/journocoders

If you now list all the files in the folder:

    $ ls

You should see `oclookup.py` listed.

Now we'll run our file and pass it the details for Tesco Plc again:

    $ python oclookup.py gb 00445790

You should see some information on the company printed out to the terminal. This is good!


Putting it on loop
------------------

Now lets modify our program to look up a whole list of companies instead of one.

Beneath the `lookup` function create a new function called `batch`:

```python
def batch(filename):
    results = []
    with open(filename, 'rb') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            result = lookup(row['jurisdiction'], row['number'])
            results.append(result)
    return results
```

This function expects a CSV file with two columns, `jurisdiction` and `number`. It opens the file and calls the `lookup` function with the information from each row. After each lookup it adds the result to a list. When all rows have been looked up the results are returned.

*CSV*: A simple spreadsheet format.

Remove the last line of the file that we added before. Replace it with:

```python
print(batch(sys.argv[1]))
```

Now lets try running our program again, but this time with a file as input. Download [this list of companies] (https://raw.githubusercontent.com/maxharlow/tutorials/master/opencorporates-api/companies.csv) and move it into your project folder.

Then run:

    $ python oclookup.py companies.csv

You should see information for each of the companies listed in `companies.csv` printed out to the terminal.
