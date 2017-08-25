Working with geographical data
==============================

In this tutorial we are going to take a dataset containing the outlines of all the boroughs of London, and combine it with data showing average income. We will then use our combined dataset to build an interactive heatmap showing how income varies across London.

We are going to use a number of tools mostly built by [Mike Bostock](https://twitter.com/mbostock), who also wrote [the tutorial this is based on](https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c).


Getting set up
--------------

### Mac

If you don't already have Homebrew, follow the instructions [on its website](http://brew.sh/) to get it installed first.

Next, from the terminal install Node:

    $ brew install node

(You don't include the `$` at the start, that just indicates it's a terminal prompt.)

If you get an error saying Node is already installed run `brew upgrade node` instead so you are running the latest version. If you are already on the latest version you will see an error saying Node is already installed.

### Windows

If you don't already have Chocolatey, find PowerShell from the Start menu, then right-click and click 'Run as administrator'. Press Yes to the dialog that appears. When PowerShell loads we need to give it permission to run things:

    > Set-ExecutionPolicy Unrestricted -Force -Scope Process

(You don't include the `>` at the start, that just indicates it's a PowerShell prompt.)

Then follow the instructions [on its website](https://chocolatey.org/install) to get it installed.

From PowerShell you can then install Cygwin, Node, Make, Curl, and Unzip:

    > choco install cygwin nodejs make curl unzip

You'll have to press `Y` to confirm a few times. Next, close PowerShell and open Cygwin from the Start menu. Lastly, we need to set Cygwin to use your Windows home directory:

    $ echo 'db_home: windows' >> /etc/nsswitch.conf

Then close and reopen Cygwin. This is the terminal we will be using for the rest of the tutorial.

### Linux

On a Debian-based Linux distribution, we can install things with Apt.

From the terminal install Node:

    $ sudo apt-get install nodejs

<hr>

We are not actually going to be using Node in this tutorial, however Node comes with NPM, which is used for installing command-line tools written in Javascript. Let's install the tools we're going to be using here:

    $ npm install -g shapefile reproject d3-geo-projection d3-dsv ndjson-cli topojson

You will also need a code editor such as [Sublime Text](https://www.sublimetext.com/) or [Atom](https://atom.io/).

You should also create a directory for this project, named something like `working-with-geo-data`. Storing all the files used in this tutorial will help you keep track of what you're working on.


Keeping track of your steps
---------------------------

This tutorial has a lot of steps, and at the end of each step, you'll have a new file. Each step builds that new file based on running commands on the file produced in the previous step. But what happens when, at the end, you realise you wanted to do something differently in step two? You've got a lot of commands to run again.

One way to avoid this is to use a tool called Make. This lets us create what are known as *rules* -- which are made up of a *target*, which is name of the file (or directory) that will be produced, the dependencies, which are the names of zero or more files required for the rule to run, and finally a list of commands required to transform the dependencies into the target.

Make is smart enough to work out intermediate steps. So say we have one rule, which depends on another, which depends on a third. Even if we have nothing made yet, we can make the first rule, which then makes that rule's dependencies, which in turn makes the dependencies of those rules, and so on.

This means that if we want to make a change in any one of the steps, we can simply delete all our data, and make the last rule -- all the intermediate files will be made too. Another benefit of structuring our work in this way is that it means we will have a log of exactly everything we did to produce a given file. Effectively we are documenting our process as we work.

To start, create a new file in your code editor and save it with the name `Makefile` to your project directory.


Getting the geometry
--------------------

To start with, we need the source geometry for the London borough boundaries. The [Greater London Authority](https://www.london.gov.uk/) publishes exactly this [on the London Datastore](https://data.london.gov.uk/dataset/statistical-gis-boundary-files-london).

Although we could download the data manually, we're going to do it using our first Make rule. Add the following to your Makefile:

```make
source:
	mkdir source
	curl -O https://files.datapress.com/london/dataset/statistical-gis-boundary-files-london/2016-10-03T13:52:28/statistical-gis-boundaries-london.zip
	unzip -j statistical-gis-boundaries-london.zip -d source
	rm statistical-gis-boundaries-london.zip
```

Lets break down what's happening here.

The first line describes the name of the target, which is a directory named `source`. This rule has no dependencies, but if it did, those would be specified after the colon. Underneath we have the commands required to build the source, which are indented by a tab. We first make a new directory. Next, we download the Zip file from the London Datastore. We then unzip that into our source directory, and remove the Zip file.

**Note:** One thing Make is funny about is it forces you to use tabs inside Makefiles -- and if you don't it will give you the cryptic error saying that there is a *missing separator*. For added confusion, Github converts tabs to spaces. So if you're copy-pasting from this tutorial, you will need to replace your spaces with tabs as you go along.

To run this in the terminal, first navigate to your project directory where you created the Makefile, then:

    $ make source

You should see text scrolling by as each of the commands you specified in the rule is executed.

Once it has finished, you should have a new directory named `source` with a whole load of files inside it. We can list them all:

    $ ls source

What we are seeing here are a number of datasets in the [Shapefile format](https://en.wikipedia.org/wiki/Shapefile), which is commonly used by governments and other agencies to distribute geographical data. The main Shapefiles containing geometry have the `shp` extension, and the other files that have the same name but different extensions  (`shx`, `dbf`, etc) are other linked bits of data -- we will come back to these later.

We are interested in the dataset named `London_Borough_Excluding_MHW`, which gives us the geometry for each of the boroughs, excluding the MHW, or mean high water. This is an average of high tides taken over a period of years which has then been removed from the borough geometries. This is handy, as although technically the London boroughs that border the Thames extend out into the middle of the river we normally expect to see an empty void where the Thames runs when we look at a map of London. This dataset also includes geometry for the City of London, despite it [technically not being a London borough](https://en.wikipedia.org/wiki/City_of_London).

We can preview the Shapefile to see what we have by opening the `shp` file on [MapShaper](http://mapshaper.org/).


Converting to GeoJson
---------------------

*(Step 1)*

Though Shapefiles are commonly used for publishing data, it isn't a very easy format to work with. So we're going to convert it to *GeoJson*, which is far better for reading, manipulating, and doing things like building interactives.

***GeoJson:*** A format using *Json* specifically for storing geographical data.

***Json:*** A format for storing and transmitting structured data of all types.

Add a new rule to your Makefile to do this conversion:

```make
london-1.geo.json: source
	shp2json \
		source/London_Borough_Excluding_MHW.shp \
		> london-1.geo.json
```

This will create a new target, `london-1.geo.json`, which depends on the `source` rule we just created. Inside, it calls `shp2json`, part of the `shapefile` package we installed with NPM earlier, that converts Shapefiles to GeoJson. This tool also reads from some of the other files that came with the `shp` file, so as well as the geometries the resulting GeoJson file also contains data on each of the boroughs, including a unique ID for each, which will become useful later on.

The `\` character allows us to move onto a new line for the next part of the command, which makes reading things a bit clearer.

The `>` character allows us to redirect the output from `shp2json` to a new file, our `london-1.geo.json`. This is known as *output redirection*. Using `>` to redirect output can be done for anything in the terminal. For example, if you ran `ls > listing.txt` it would redirect the normal output of `ls` to a new file named `listing.txt`.

Now, run the new target:

    $ make london-1.geo.json

After it has finished, you should see the new `london-1.geo.json` file in your project directory.


Leaving the British National Grid
---------------------------------

*(Step 2)*

Our data, like almost all official geographical data in the UK, was originally produced by [Ordnance Survey](https://os.uk/), the Government-owned national mapping agency for Great Britain. (Northern Ireland is separately mapped by [Ordnance Survey Ireland](https://www.osi.ie/), who cover the whole island.) Ordnance Survey data uses a coordinate system known as the British National Grid, or BNG.

Before we go any further, we're going to need to learn a little about coordinate systems.

All coordinates have to be given in a reference system, and there is no one true system to rule them all -- there are thousands, not only because different systems are more accurate for different regions of the world, but also because new ones are continuously being created that more accurately describe the exact shape of the earth as a whole. (It's sort-of satsuma-shaped.) New systems also take into account changes in sea levels, movement in tectonic plates, and so on.

There are two types of coordinate reference system:

***Geographical coordinate reference systems:*** Coordinates given as locations on a sphere (called latitudes and longitudes).

***Projected coordinate reference systems:*** Coordinates given as locations on a flat surface (called X and Y). Can be thought of as the combination of a geographical system and a *projection*.

***Projection:*** Converts a location on a sphere to a location on a flat surface. All geographical data must be projected before it can be displayed on a flat surface such as a screen. Accurately doing this is mathmatically impossible, so different projections exist which make different trade-offs about how to display the data.

So whilst BNG, a projected coordinate reference system, is particulary good at representing Great Britain, it is useless for anywhere else in the world. Most tools expect data to use a different system, a geographical coordinate reference system called WGS84, or the World Geodetic System. (So-named because the latest version is based on measurements of the Earth taken in 1984.) This system works well for locations across the globe.

**Aside:** Given that BNG is a projected coordinate reference system, you might be wondering what it is based on. It uses a geographical coordinate reference system called OSGB36, along with the [transverse mercator projection](https://en.wikipedia.org/wiki/Transverse_Mercator_projection).

So we know that our data uses BNG, and we need to convert it to WGS84. Let's create a new rule to do that:

```make
london-2.geo.json: london-1.geo.json
	reproject \
		--use-spatialreference \
		--from 'EPSG:27700' \
		--to 'EPSG:4326' \
		london-1.geo.json \
		> london-2.geo.json
```

This will create another target, this time named `london-2.geo.json`, which depends on the file we created in the previous rule. Inside, it calls the `reproject` tool we installed with NPM earier, that converts from one projection to another. To do this, we need to pass it *flags* giving the *EPSG numbers* for each of the two systems. We also pass the `--use-spatialreference` flag, which tells it to look up more unusual projections that it doesn't already know about using an online reference -- such as BNG.

***EPSG numbers:*** named after the European Petroleum Survey Group who manage them, EPSG numbers are widely used by tools to identify the different coordinate reference systems. We can use [EPSG.io](https://epsg.io/) to look up which numbers refer to which systems.

***Flag:*** These are how we tell a command line tool what we want it to do. They can be mandatory (like `--from` and `--to` here), without which the program would have no idea what to do, however they are more often optional (like `--use-spatialreference`). They can also be *long* or *short*. These ones are long, which means they have more than one letter, and start with two dashes at the start. However, more commonly used flags are normally given in short format, which is with a single letter, such as `-g`. Unlike long flags these can be combined -- so saying `-gh` is the same as saying `-g -h`. Many programs give long and short flags that do the same thing, so you have the choice.

Now, let's run this target:

    $ make london-2.geo.json


Preparing for presentation
--------------------------

*(Step 3)*

Now our data is in WGS84, we need to apply a projection to it before we can display it on a screen. Many news organisations have a house projection they use in their graphics. One of the more common is [Robinson](https://en.wikipedia.org/wiki/Robinson_projection), which is what we are going to use here.

We are also going to resize our map to fit into a 1000×800 pixel square. By scaling our map to a nice round number we will make things easier for ourselves later on when we come to scaling the map up and down based on the size of the browser. It is also the rough dimensions of London, which is wider than it is tall. Though this operation is not technically anything do do with projections in the geographical sense, you can think of this as a similar kind of transformation.

Add another rule to your Makefile to do this projection:

```make
london-3.geo.json: london-2.geo.json
	geoproject 'd3.geoRobinson().fitSize([1000, 800], d)' \
		london-2.geo.json \
		> london-3.geo.json
```

This will create  `london-3.geo.json`, again depending on the file we created in the previous step. Inside, it is calling `geoproject` which came with the `d3-geo-projection` set of tools we installed at the start.

This tool is part of D3, the library for building data-driven visualisations that we will be using later when it comes to displaying our data. It assumes the input data will be in WGS84, which we converted to in the previous step. Unusually, we tell it how we want it to output our data through a string of Javascript, which has D3 already included. In that string we use [D3's projection library](https://github.com/d3/d3-geo-projection/blob/master/README.md) to create the function we need to transform our data. We apply that function to our data, which is given the one-letter name `d` here.

Remember to run that target before moving on to the next step.


Seeing what we've got
---------------------

Earlier in the tutorial we saw that the Shapefile came with other files containing other information. But what information do we have exactly?

Let's have a look to see what's in our file:

    $ cat london-3.geo.json

***Cat:*** Prints a file out into the terminal. So-called because it is actually short for concatinate -- if you give it two or more file names it will print all their respective contents out together.

Eek. So there's a lot of numbers in it. Not too helpful. However, it's in a form of Json, a structured format. This means we can display it in a more human-readable way. To do this, you will need to install [JQ](https://stedolan.github.io/jq/):

* **Mac:** If you have Homebrew installed, run `brew install jq`.
* **Windows:** If you have Homebrew installed, run `choco install jq`.
* **Linux:** Run `sudo apt-get install jq`

We should now be able to *pipe* our GeoJson file through JQ, and then into *Less*:

    $ cat london-3.geo.json | jq . | less

***Pipe:*** The `|` character lets us pipe the output of one program into the input of another. Here `cat` is outputing our GeoJson file, except that is then piped into `jq` (we have to give JQ the `.` character, which tells it to print everything out), and then the output of that is finally piped into `less`.

***Less:*** A file viewer. Useful for viewing large files as it displays the start of the file, and then lets you move around. You'll know you're inside Less because you can see a colon at the bottom left of the screen. Pressing the up and down arrows lets you move around the file. To move down by a whole screen press `Ctrl-V`, and to move back up press `Alt-V`. To quit press `q`.

We can now see the structure of our data. At the top level we have a `FeatureCollection`, which contains an array of `Feature`. In our data each *feature* is a London borough, starting with Kingston upon Thames. If you scroll down -- you'll have to go *way* down -- you will see similar data for every borough. Each contains some properties, and then a long list of the coordinates for the exact geometry for the outline of that borough. The properties section shows us that each borough has a `NAME`, `GSS_CODE`, `HECTARES`, and some other information.

***Feature:*** A geographical term, generally describing something that you want to display on a map. This can be anything from a river, a road, or the boundary of an electoral ward.

The key thing here are the *GSS codes*. These are nine-character unique numbers which are given to all administrative areas in the UK by the [ONS](https://ons.gov.uk/). As these identifiers are widely used across government and other organisations, they provide the key to linking our geographical data to other data sets.


Converting to ND-Json
---------------------

*(Step 4)*

At this point, we could skip straight to visualising our geometry as it is.

However, often the geographical data isn't the full story, and we need to either modify it, filter it down to specific parts, or combine it with another dataset. One way to do this type of work is by using the `ndjson-cli` suite of tools. These tools are based on the ND-Json format.

***ND-Json:*** A format made up of Json objects, each on a separate line. This means tools can simply loop through each line, modifying, filtering or joining as they go along.

Note that the ND-Json standard itself isn't anything specific to geographical data. Though in our case the Json objects on each line are the GeoJson features representing London boroughs that we saw in the previous step.

First, let's create a new rule to convert our data to ND-Json:

```make
london-4.ndjson: london-3.geo.json
	ndjson-split 'd.features' \
		< london-3.geo.json \
		> london-4.ndjson
```

This will create `london-4.ndjson`. To do this it calls `ndjson-split`. This splits apart the array named `features` inside the `FeatureCollection` we saw in the previous step. This simply takes each feature from that array and puts it on a new line.

The `<` character is the opposite of output redirection (the `>`) that we first saw earlier -- called *input redirection*, it takes a file and routes it into the program we are running. It's much rarer as most programs take a file name as part of their input, but the `ndjson-cli` tools don't for some reason.

Make this new target, remembering that the extension is now `.ndjson`.

To check this has worked correctly, run:

    $ cat london-4.ndjson | less -S

You should see the Json for each feature we saw before, with one borough on each line.

**Aside:** Passing `-S` to Less means it won't wrap the text, which makes things a bit clearer in this case. You can use the right and left arrow keys to navigate from side to side.


Joining together
----------------

*(Step 5)*

We're going to join our geometry with a dataset published by HMRC giving [the average income of tax-payers in each London borough](https://data.london.gov.uk/dataset/average-income-tax-payers-borough/resource/b3bb3f43-ec44-4971-8f46-2ef2a5e68d0a).

Download the data from the terminal:

    $ curl -O https://files.datapress.com/london/dataset/average-income-tax-payers-borough/2016-04-05T08:55:06/income-of-tax-payers.csv

We can use the `csv2json` tool from the `d3-dsv` suite of tools we installed at the start to convert our CSV file to Json:

    $ csv2json \
        --input-encoding 'windows-1252' \
        income-of-tax-payers.csv \
        > income-of-tax-payers.json

We also pass the `--input-encoding` flag which tells it that the input file is Windows encoded. If we didn't do this some characters (such as £ signs) would come out as question marks or other gobbledygook -- a common problem when dealing with data. By doing this `csv2json` knows to convert the file to Unicode, the modern standard for file encoding which is used everywhere except on Windows.

We can then split the Json apart into ND-Json with the same method we used previously:

    $ ndjson-split 'd' \
        < income-of-tax-payers.json \
        > income-of-tax-payers.ndjson

Check the file by using the same method we used in the previous step. You should see a list showing every London borough, each including a `Code` field -- which is the same as the nine-character GSS codes in our London data.

Now we can initially join the two sets of data together:

```make
london-5.ndjson: london-4.ndjson
	ndjson-join \
		'd.properties.GSS_CODE' \
		'd.Code' \
		london-4.ndjson \
		income-of-tax-payers.ndjson \
		> london-5.ndjson
```

This uses another `ndjson-cli` tool, `ndjson-join`, which merges our two files into one, based on the GSS codes. If we look at our file again we can see what it produced, though it might be a bit unclear at first. Each line now has a two-element array on it -- the first element is the geometry for a borough, the second is our income data.

However, that's not quite what we wanted -- we need to add our income data to be inside the `properties` section, which is the space GeoJson gives us to put our own data not related to the geometry.

*(Step 6)*

So lets do that transformation:

```make
london-6.ndjson: london-5.ndjson
	ndjson-map \
		'd[0].properties = { code: d[0].properties.GSS_CODE, name: d[0].properties.NAME, incomeMedian: d[1]["Median £ - 2013-14"] }, d[0]' \
		< london-5.ndjson \
		> london-6.ndjson
```

This uses `ndjson-map` to transform each line of our data. The expression we give it gives us access to `d[0]` and `d[1]`, which are our two datasets. It then sets the properties of the first dataset to include the GSS code from our geometries (which is given the name `code`), the name of the borough (`name`), and the 2013-14 medians from our income data (`incomeMedian`). It then returns the modified `d[0]`.

Remember to make `london-6.ndjson` before you move on. If you didn't make `london-5.ndjson` before you should see Make automatically work out that it needs to make that too.


Converting to TopoJson
----------------------

*(Step 7)*

One important concern when displaying geographical data on the web is the size of it -- especially important when we think of people using their mobile data to look at your map. Let's find out how big our data is:

    $ ls -lh

This tells `ls` to list all the files in your project folder in 'long' (`l`) format -- showing various bits of information about each file, including their size -- in human-readable (`h`) form -- which means using megabytes/kilobytes/etc instead of just showing the number of bytes.

If we look at `london-6.ndjson` it should be about 1.8 megabytes. One way we can improve on this is by converting the data to TopoJson format, our third (and last) format of the tutorial!

***TopoJson:*** Like GeoJson, only files tend to be much smaller. This is because GeoJson stores the coordinates for every feature separately. TopoJson instead takes into account that features often have shared borders, which are only stored once.

To do the conversion:

```make
london-7.topo.json: london-6.ndjson
	geo2topo \
		--newline-delimited \
		'boroughs=london-6.ndjson' \
		> london-7.topo.json
```

This uses the `geo2topo` from the `topojson` suite of tools installed at the start to convert our data from ND-Json (hence the `--newline-delimited` flag) into TopoJson.


Reducing file size
------------------

*(Step 8)*

We can save further space by simplifying our geometries. This means discarding some of the fine detail of our data that will be too small to be meaningful.

One of the other advantages of converting to TopoJson in the previous step was that we can now simplify borders without ending up with either gaps between boroughs, or boroughs overlapping each other.

To do that simplification:

```make
london-8.topo.json: london-7.topo.json
	toposimplify \
		--planar-area 2 \
		london-7.topo.json \
		> london-8.topo.json
```

This uses `toposimplify`, again from the `topojson` tools. We pass it the argument `--planar-area 2`, which indicates the amount we want our map simplified -- bigger numbers mean more simplification, so smaler files, but less precise geometry.

List the files in your project folder, so we can see how much that has reduced the size of our data.

*(Step 9)*

But we can go further in our quest to reduce the size of our data. Our last step is to quantize it, which reduces the accuracy of the coordinates used in our geometries:

```make
london-9.topo.json: london-8.topo.json
	topoquantize 1e3 \
		london-8.topo.json \
		> london-9.topo.json
```

This uses another `topojson` tool, `topoquantize`. Again, `1e3` is a number, this time written using exponential notation, which is a way of writing huge numbers -- in this case it's 1,000, or a 1 followed by 3 zeroes. Picking a number is another tradeoff between accuracy and file size. The only real way to work out the right number for any given dataset is by trial-and-error.


Building an interactive map
---------------------------

Next we're going to use the data-visualisation library [D3](https://d3js.org/) to build a simple interactive visualisation showing our map, including our income data.

First we need to create a basic HTML page where our map is going to sit. From your code editor, create a new file like so:

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Working with geographical data</title>
        <link rel="stylesheet" href="map.css"/>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.5.0/d3.min.js" defer></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/2.2.0/topojson.min.js" defer></script>
        <script src="map.js" defer></script>
    </head>
    <body>
        <h1>Hello, London</h1>
        <h2></h2>
        <main></main>
    </body>
</html>
```

Then save it as `map.html` in your project directory. This is pretty much the simplest HTML document we can write. In the `<head>` we link to a `map.css` file, which we're going to create in a moment. We also bring Javascript libraries for D3 and TopoJson, as well as a `map.js`, which is where our code will sit. In the `<body>` we have a main title, an empty subtitle, which is where our income data will appear, and another empty `<main>` element, which is the space we will render our map into.

Create another file in the same location, this time named `map.js`:

```javascript
function visualise() {
    d3.json('london-9.topo.json', (error, data) => {
        if (error) return console.error(error)
        var target = 'main'
        var sizeRatio = 0.8 // approximate ratio for London
        var scaleRatio = 0.001
        var width = parseInt(d3.select(target).style('width'))
        var height = Math.round(width * sizeRatio)
        var scaledWidth = width * scaleRatio
        var scaledHeight = height * scaleRatio
        d3.select(target).select('svg').remove()
        var graphic = d3
            .select(target)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
        var boroughs = topojson.feature(data, data.objects.boroughs).features
        graphic
            .append('g')
            .attr('transform', 'scale(' + scaledWidth + '),translate(' + (scaledWidth / 2) + ',' + (scaledHeight / 2) + ')')
            .selectAll('borough')
            .data(boroughs)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .on('mouseover', (borough, i, elements) => {
                d3.select(elements[i]).classed('selected', true)
            })
            .on('mouseout', (borough, i, elements) => {
                d3.select(elements[i]).classed('selected', false)
            })
            .on('click', borough => {
                var text = borough.properties.name + ': £' + parseInt(borough.properties.incomeMedian).toLocaleString()
                document.querySelector('h2').innerHTML = text
            })
    })
}

window.addEventListener('load', visualise)
window.addEventListener('resize', visualise)
```

Let's break down what's going on here. D3 is just a set of tools for creating *SVG* graphics.

***SVG:*** Scalable Vector Graphics. A format similar to HTML, but for producing vector graphics instead of web pages. You can also create SVG inside HTML.

***Vector:*** Graphics drawn using points and lines instead of pixels. This means they can be scaled up or down to any size and still look great. Images based on pixels are called *raster* graphics.

First, we're creating a new function called `visualise()`, and then, right at the bottom of the file we add two event listeners -- these tell the browser to call our function when the page first loads and whenever it's resized. Inside the function, we render the map. Firstly, we load in `london-9.topo.json`, the last file we created.

Then we define a couple of variables. Our `target` points at that empty `<main>` element in our HTML file. The `sizeRatio` reflects the rough ratio of London that we defined in step three -- that London is not quite as tall as it is wide. We also scaled our map up, so we need to scale it down again here, which is what the `scaleRatio` specifies. We then find the width of our target (that's the `<main>` element), and compute the height based on the width and the `scaleRatio`. We also use the `scaleRatio` to compute a `scaledWidth` and `scaledHeight` for our graphic. These numbers will allow us to modify the fixed size of the graphic (1000×800) based on the actual size of the browser (the `width` and `height` variables).

We then see if there's any `<svg>` element already inside our target. We have to do this because this function is called every time the browser is resized, so without it we would end up just adding more and more maps to the page. If this is the first time the function has run this line does nothing at all.

We then create the `<svg>` for our graphic given the variables we have already computed.

Next, we need to deal with our data. Though we converted it to TopoJson to get a smaller file, D3 only understands GeoJson, so we convert it at this point.

Finally we append a new group, or `<g>` element, to the `<svg>`, and we tell it how it should be transformed based on the variables we calculated. We then create new `<path>` elements, which will contain the geometries for each of our boroughs. For each path we add three listeners. The first, when the mouse moves over a borough, adds a new 'selected' class, the second removes that class when the mouse moves out of that borough. The third is triggered when you click on a borough -- that extracts the name and income median value from our data, and then inserts them into the empty `<h2>` element in our HTML.

Now we need to serve up these files so we can see them in our browser. There are lots of ways of doing this, but we're going to use Python:

    $ python3 -m http.server 8000

(If you're using Windows you will need to run `choco install python3` first.)

Open your browser to `localhost:8000/map.html`, and let's see what it looks like. You should see a map of London! Click on a borough, you should see the name of that borough, and the median income figure appear below the title. Resize your browser, and the map should resize too.

It's a bit ugly though? Create a `map.css` file, and let's add some style:


```css
main {
    margin: 0 15%;
}

path {
    fill: gray;
    stroke: white;
    stroke-width: 1px;
    cursor: pointer;
}

path.selected {
    fill: maroon;
}
```
