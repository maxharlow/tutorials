Building a website with HTML and Git
====================================

In this tutorial we are going to learn how to use *HTML* to build a simple website, *CSS* to style it, and *Git* to share and collaborate with others.

***HTML***: The language webpages are written in, which describes the struture of a document -- which text is a title or subheading? Where does a paragraph start and end? This also includes sidebars, links, etc. Stands for hypertext markup language. But what's hypertext? Essentially it's text with hyperlinks in it.

***CSS***: A language for setting how different parts of our HTML document should look -- colours, fonts, where things are positioned, etc. Stands for cascading stylesheet.

***Git***: A tool for tracking changes in files and coordinating work on those files between different people.


Getting set up
--------------

We first need a text editor.

* [What is a text editor and where do I get one?](https://github.com/maxharlow/tutorials/tree/master/getting-started#a-text-editor)

We also need to install Git and Node from the terminal.

* [What and where is the terminal?](https://github.com/maxharlow/tutorials/tree/master/getting-started#the-terminal)
* [How should I install things?](https://github.com/maxharlow/tutorials/tree/master/getting-started#installing-things)

### Mac

In the terminal, use `brew` to install Git and Node:

    $ brew install git
    $ brew install node

### Windows

If you are using the terminal the Windows 10 way via Bash on Windows you can use `apt-get` to install Git and Node:

    $ apt-get install git
    $ apt-get install nodejs

If you have a another version of Windows and you are using Cygwin as your terminal can use `apt-cyg` to install Git and Node:

    $ apt-cyg install git
    $ apt-cyg install nodejs

### Linux

In the terminal, use `apt-get` to install Git and Node:

    $ sudo apt-get install git
    $ sudo apt-get install nodejs

<hr>

We are not actually going to be using Node in this tutorial, however Node comes with NPM, which is a tool for installing things written in Javascript. We're going to be using Live Server, which lets us serve a website from our local machine, and helpfully automatically reloads a webpage when we make a change.

    $ npm install -g live-server

You should also create a new project directory for the files we are going to be creating in this tutorial.

* [How do I use the terminal?](https://github.com/maxharlow/tutorials/tree/master/getting-started#essentials-of-the-terminal)
* [How should I organise my files?](https://github.com/maxharlow/tutorials/tree/master/getting-started#organising-your-files)

From the terminal, make sure you are in your projects directory. Then run:

    $ mkdir learning-html-and-git
    $ cd learning-html-and-git


Your first web page
-------------------

Open your text editor and let's write our first bit of HTML:

```html
<!doctype html>
<html>
    <head>
        <title>My first web page</title>
    </head>
    <body>
        <h1>Hello, world</h1>
        <p>This is an example...</p>
    </body>
</html>
```

Save the file in the project directory you just created with the name `index.html`.

Back in the terminal we need to set up a local server to see our page:

    $ live-server

Your browser should open to the special web address `http://127.0.0.1:8080/` and you should see our page.

Let's back up a little and understand what's going on here.

The first line is the *doctype* -- this tells our browser that we're writing modern HTML. We could have omitted or given a different doctype but some browsers might then interpret some parts of our document differently. Below, our real document begins.

HTML is made up of *tags*.

***Tag***: A section of a HTML document, eg. `<p>` (for a paragraph). Most have a opening tag for the start of that section followed by a closing tag at the end which has a `/` at the start, eg. `</p>`. Tags can contain either text or other tags, which allows us to build up the structure of our document. We normally indent tags with the tab key to make it easier to read this hierarchy. The contents along with the opening and closing tags together are called an *element*.

Next, we have the `<html>` tag, which has two tags inside -- `<head>` and `<body>`. All HTML documents have this structure. The `<head>` is for metadata about our document -- in this case that's just the `<title>`, which you should see in your browser tab. The `<body>` is what actually gets rendered onto the page.

In this case our body has two elements, `<h1>` for a level 1 heading (there's also `<h2>` through `<h6>` for subheadings) and `<p>`, for a paragraph.

We have used Live Server to serve up our page. This tool is not all that different from what's running on a server somewhere serving up any given website, although the site can only be accessed by you.

**Check your understanding:** Add a new paragraph to the page.


Keeping track of changes
------------------------

At this point we're going to look at how we can use Git to manage a project such as this one. First, open a new tab in the terminal, and make sure you are in the same location as the `index.html` file you just created. To get started we need to create a new Git *repository*:

    $ git init

***Repository***: Often shortened to *repo*. This is simply a directory where files inside can have their changes tracked.

At this point Git realises that this is the first time you've used Git, and asks you to tell it your name and email address:

    $ git config --global user.name 'John Doe'
    $ git config --global user.email johndoe@example.com

(It will not ask if you've done this before -- you only ever have to set these once.)

Now, let's see what the state is of our repository:

    $ git status

Under the heading 'untracked files' you should see our `index.html`. It might be coloured red. If there are any other files in the directory they will also be listed there. These are all the files that could be tracked by Git, but aren't. We want our page to be tracked, so let's add it:

    $ git add index.html

Now, check the status again -- you should see that `index.html` is now under the 'changes to be committed' heading, and possibly coloured green. We now need to *commit* our new file so Git remembers this point in time:

    $ git commit -m 'First page'

This commits our change (ie. the adding of a new file) to Git, giving a message (that's what the `m` stands for) to describe what we did at this point in time. The message will be useful if we want to come back to this point later. Check the status again -- you should just see a message saying 'nothing to commit, working directory clean'.


Making a change
---------------

Now, to see this all working, let's make a change to our `index.html`. Return to your text editor and change the `<h1>` to be your name.

Back in the terminal, check the status again. Under the 'changes not staged for commit' heading you should see `index.html` marked as modified. It knows we've made a change! Let's see exactly what that change was:

    $ git diff

You should see a few lines of your `index.html` showing the difference between what we committed last and what we have now. It should look something like this:

```diff
diff --git a/index.html b/index.html
index 1234567..abcdefg 100644
--- a/index.html
+++ b/index.html
@@ -1,7 +1,7 @@
 <!doctype html>
     <html>
         <head>
-            <title>My first web page</title>
+            <title>Max's web page</title>
         </head>
         <body>
             <h1>Hello, world</h1>
```

Git doesn't understand changes *per se*, but it sees things as being either added or removed. So for our change Git sees the line as it was before as having been removed -- in red with a minus sign at the start -- and the line as it is now has been added underneath -- in green with a plus sign.

Now perhaps if this was a change we didn't intend to make we could identify exactly what was different since our last commit and remove those changes. In this case we want to keep our new title, so we need to make another commit. This is the same process as when we added `index.html` in the previous step:

    $ git add index.html
    $ git commit -m 'Updated title'

After that run `git status` again and check it's back to saying there's nothing to commit.


Adding some style
-----------------

Now let's add some style to our page with CSS. Every HTML element has a default appearence, which is what we see at the moment -- it's quite plain, and probably not what we want. In your text editor create a new file:


```css
body {
    background: yellow;
}
```

Save the file in the same location as your `index.html`, and name it `style.css`.

Back in `index.html` we need to add a tag to our `<head>` telling the document to use the CSS file we just created:

```html
<link rel="stylesheet" href="style.css"/>
```

This is a little different to the tags we have seen so far in a couple of ways. Firstly, it's a *self-closing* tag, one that doesn't open and close, but just sits alone. Such tags are written with a `/` at the end. It also has *attributes* -- extra bits of information attached to the tag. In this case we have `rel`, short for relation, that indicates that what we're linking to is a stylesheet; and `href`, short for hyperlink reference, which is just the name of our file in this case, but it could be any web address that contains a stylesheet.

Now, go back to your browser and you should see your page now has a glorious yellow background.

Before you move on, add `style.css` to Git, and commit the change.


Styling text
------------

Now we have a stylesheet set up, let's look at how it actually works. CSS is made up of *rules* which describe how a specific part of our page should be styled. At the moment we have one rule which styles the `<body>` element. Inside the curly brackets our rule has one *declaration* made up of a *property* (the background) and a *value* (yellow).

**Aside:** What is the cascading element of cascading stylesheets? It's describing the fact that you can have multiple rules styling the same element, so there needs to be a way of deciding which declarations take priority. One simple one looks at the order rules were defined -- rules defined later are seen as more important. More important rules cascade over the top of lesser ones.

The simplest type of rule is just a tag name, as we have given here. This quickly becomes unusable when you have multiple tags of the same type you want styled in different ways. The most typical type of rule is one using classes. A class is a name you give to a HTML tag. You can then use a CSS rule to style all tags that have that class. Let's add a class attribute to our first paragraph in our HTML file by changing the start tag `<p>` to:

```html
<p class="first">
```

Then, in our CSS create a new rule:

```css
.first {
    font-weight: bold;
    font-style: italic;
}
```

In your browser you should see the first paragraph in bold italics, but the second one look as it did before. In CSS if you are targetting a class the class name needs to be preceded by a `.`. Here we've called our class `first`, but you could call it anything that makes sense for your site. We've also seen another CSS declaration, `font-style`, which mostly used for making text italic.

One thing to keep in mind when writing CSS is that some properties are *inherited*. This means that applying them to a parent element will also apply them to children. For example, we often want to set the font to be used on the whole page. Since this is an inherited element, we can just set it on the `body` and it will be applied to every other element, instead of having to individually set this for everything on our page. However, you would probably not want the margin given to a specific element to be inheritied, and it isn't. For the most part which properties are inheritied and which aren't is fairly intuitive, though it might require some trial-and-error when you're getting started.

There are far more properties than can be listed here, but [this page](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Fundamentals) has a fairly comprehensive list of the key ones for styling text.

**Aside:** In the past, if you wanted to use a font on the web the font file had to be on everyone's machine, which meant a pretty limited set. Nowadays we have webfonts, which gives us far more choice. [Google Fonts](https://fonts.google.com/) hosts hundreds of fonts which can be imported and used on your page.

**Check your understanding:** Add a new rule changing the colour of your `<h1>` element.


More tags!
----------

Now let's add a few more elements to our HTML.

All HTML tags in the body are either *block-level* or *inline*. Block elements are ones that, by default, stand alone, such as a title or a paragraph. This is as opposed to inline elements, which do not interrupt the flow of text, such as tags making text italic.

First, add a link to your favourite site. Hyperlinks are created with the `<a>` tag, short for anchor. It's an inline element. The location you want to link to is given in the `href` attribute:

```html
<a href="http://www.theguardian.com/">The Guardian</a>
```

Next add your favourite gif from [Giphy](https://giphy.com/). You'll need to go to 'Copy link' then use the 'Gif link' for a URL that goes direct to the image file. Images are created with the `<img>` tag, which is a self-closing inline element. The location of the image file is given in the `src` attribute:

```html
<img src="https://media.giphy.com/media/3Z0XdseX163wQ/giphy.gif"/>
```

Now make some of the text inside one of your paragraphs bold. Bold text is created with the inline `<strong>` tag, so called because, although by default text within this tag is rendered as bold, with CSS you can make it look anyway you want, and not necessarily be bold:

```html
<strong>This text is bold.</strong>
```

And some italics. Italic text is created with the inline `<em>` tag, short for emphasis:

```html
<em>This text is italic.</em>
```

Now create a list of things you would like to learn. Bullet-pointed lists are created with block-level element `<ul>`, short for 'unordered list'. Inside, each item in the list must be enclosed within `<li>` tags:

```html
<ul>
    <li>One thing</li>
    <li>Another one</li>
</ul>
```

You could also create a numbered list. These are the same as bullet-pointed lists, only using `<ol>` instead, short for 'ordered list':

```html
<ol>
    <li>First thing</li>
    <li>Second thing</li>
</ol>
```

All these elements have default styling, but sometimes you just want a completely plain container to then style as you want. A plain block-level box can be created with `<div>`, short for 'division':

```html
<div>
Some content
</div>
```

A plain inline box can be created with `<span>`:

```html
<span>Something important</span>
```

When working with HTML and CSS perhaps the most useful tool you have is the inspector in your browser. To open it, right click anywhere on a web page and click 'Inspect' or 'Inspect Element' (depending on which browser you're using). You should see it open along the bottom of the page. Click the 'Elements' tab if it's not already selected. You should be able to navigate through the tags of the page, and, on the right, see the styles that have been applied to each element. If you want to work out why something is not looking the way you expect it to, or you want to copy the appearence of something from another site, this is the place to come.

We can also *embed* elements from other sites. This is simply some HTML you can copy-paste onto your page that displays some content from that site.

Find a Youtube video, click 'Share', then 'Embed' to get the embed code. Add that to your page.

Now find a tweet you like, click the down-arrow in the top right, then 'Embed Tweet' for the embed code here. Add that to your page too.


Styling boxes
-------------

Let's return to CSS. Earlier we looked at styling text, now let's look at other types of style. The first thing to realise is that every element is effectively a box. Boxes can have padding, borders, and margin. Together we call this the box model, which looks something like this:

```
....................................
:              MARGIN              :
:    ┏━━━━━━━━ BORDER ━━━━━━━━┓    :
:    ┃         PADDING        ┃    :
:    ┃     actual content     ┃    :
:    ┃                        ┃    :
:    ┗━━━━━━━━━━━━━━━━━━━━━━━━┛    :
:                                  :
:...................................
```

Let's use some of these properties to create some social media buttons on our page. In the `<head>` our HTML, we are going to add a link to another stylesheet:

```html
<link rel="stylesheet" href="https://unpkg.com/font-awesome@4.7.0/css/font-awesome.css"/>
```

This is [FontAwesome](https://fontawesome.io/icons/), which is a set of free icons for various online services. We are going to use this for icons we need.

Then at the end of your body let's create links for our icons:

```html
<div class="contact">
    <a class="social fa fa-envelope" href="mailto:test@example.com"></a>
    <a class="social fa fa-twitter" href="https://twitter.com/journocoders"></a>
</div>
```

Read through those lines to check you understand what's happening. We're creating a `<div>`, with the `contact` class, containing two hyperlinks. Each has three classes, separated by a space. The hyperlinks are empty, as we are going to style them in CSS. Update the links to your own contact details. Note the email link starts with `mailto:` -- this is how you create a link that will open up the default email program on your computer.

The `fa` class tells FontAwesome that we are going to be using an image from that library. The `fa-envelope` and `fa-twitter` classes are classes that come with FontAwesome containing the logos of those services. The other classes are for our own use.

Then, in your CSS:

```css
.contact {
    text-align: center;
}

.social {
    border-radius: 50%;
    padding: 12px;
    color: white;
    font-size: 18px;
    text-decoration: none;
}

.fa-envelope {
    background: grey;
}

.fa-twitter {
    background: #4099ff;
}
```

The first two rules here should be fairly easy to read now, even though we haven't seen all these properties yet. Note that `color` uses the US spelling. The last two are adding extra properties to the `fa-envelope` and `fa-twitter` classes, which were defined by FontAwesome -- this takes advantage of the cascading nature of CSS, which means the properties defined here are applied over the top of the properties defined in the FontAwesome CSS, adding a background colour.

Another couple of things are new -- font sizes and padding are measured in `px` -- that's short for pixels. And our Twitter background colour? Whilst we can use names of simple colours, to describe a specific colour. For that we can use the hex code of a colour, which here is the precise blue Twitter uses. [There's a colour picker here that gives hex codes for whatever shade you desire.](http://htmlcolorcodes.com/color-picker)

**Check your understanding:** Try customising the CSS to make your icons bigger and aligned to the right of the page.


Hosting our site
----------------

Now let's get our site online so other people can access it. Firstly, you will need a [Github](https://github.com/) account, so sign up now if you don't already have one. Github lets us host our Git repositories online so we can share and collaborate with other people. Public repos are free. One useful thing about Github is that it has a useful feature called Github Pages that lets us host simple websites like ours for free.

First, we need to make sure Git knows about all the changes we have made so far -- run `git status` to see what we have changed since our last commit. Then add both files and commit the changes.

To get started, click on 'New repository' to create a new repo on Github. Make the repository name `yourusername.github.io`, replacing `yourusername` with your Github account username. This special name lets us take advantage of Github Pages to host our site at http://yourusername.github.io/.

Now we have created our repository we need to push our repository up to Github. You can follow the instructions on the page under the 'or push an existing repository from the command line' section, which should say something like:

    $ git remote add origin git@github.com:yourusername/yourusername.github.io.git
    $ git push -u origin master

This does two things. Firstly we add our Github repository as a remote location (named `origin` by convention) that our files can be sent to and received from. The second line pushes all our files from our machine up to Github.

You might be asked for your password, which is your computer password, not your Github password.

If you refresh the page you should see your files on Github.

Now, to enable Github Pages for this repository, click 'Settings' along the top. Scroll down to the Github Pages section, and under 'Source' select 'master branch' and press 'Save'.

If you now go to http://yourusername.github.io/ you should see your page! You might need to refresh a few times as it takes a few moments to work.

One thing to note here is that `index.html` is a special name for the homepage of your site. If we created another HTML file we would have to access it at something like http://yourusername.github.io/anotherfile.html.

Github pages is pretty popular for people creating personal or portfolio sites, and if you want to use it for that you might want to connect it up to a domain name you own. [There's a guide to doing that here.](https://help.github.com/articles/using-a-custom-domain-with-github-pages)

Now, let's make a quick update to our site. Change some of the text on your page, add the changes and commit them to Git. To push those changes up to Github use:

    $ git push origin master

(Unlike before you don't need the `-u`, that's just for setting up the site initially.)


Collaborating with Git
----------------------

Another thing to note is that Git isn't just for HTML! In fact it mostly isn't -- it's most typically used for collaborating on code by different people. Let's try suggesting a change to someone else's site. Get a link to someone else's Github repository. In the top right click 'Fork'. A *fork* is a copy of someone else's repository in your account, so we can make changes. Once that's finished click the green 'Clone or download' button in the top right, and copy the address in the text box.

Now, back in the command line, move back to your projects folder:

    $ cd ..

We are now going to create a clone of that other person's site, which will be something like this, replacing the address here with the one you just copied:

    $ git clone git@github.com:someoneelse/someoneelse.github.io.git

After that's done you should have a new folder, named something like `someoneelse.github.io`. Move into that folder, and let's see their files:

    $ cd someoneelse.github.io
    $ ls

Now, back in your editor, open up their `index.html` file, and add a new element to it. Then add your change, and commit it to Git. Then push your change up to your fork.

Now go back to Github, to your fork of their site. On the top left there's a 'New pull request' button. A pull request is a request for someone to pull in your suggested changes into their repository. Click the green 'Create pull request'. They should get an email, and if they click the link, the option to accept or reject your suggestion. If they accept your changes are merged into their repository on Github.

Now if that person accepts those changes and wants to bring them down to their local machine they need to:

    $ git pull

This pulls down those changes from the Github copy of their repository onto your local machine. This is the process people use to collaborate with Git!
