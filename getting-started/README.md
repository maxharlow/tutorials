Getting started
===============

*'But where do I type all this stuff in?'*


A text editor
-------------

To write code you will need a text editor such as [Atom](https://atom.io/) or [Sublime Text](https://www.sublimetext.com/). They both run on Mac, Windows, and Linux -- download and install from the website.

Though we call them text editors, these are tools really specialised for writing code, not text, and they have many features built-in to make this easier. One important one is *syntax highlighting*, which colours different parts of your code to make it easier to read. The reason they are called text editors is that the files they produce are *plain-text* files, without any formatting -- fonts, margins, etc -- that you would get in something like Word.


The terminal
------------

Also known as the command line.

### Mac

Open up the Finder, then go into Applications on the left. Find the Utilities folder -- the Terminal app is inside. You might want to drag it onto your Dock for quicker access.

### Windows

If you have Windows 10, you can use Bash on Windows which is much easier to get set up with. First, follow the [installation instructions](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide). To get to the terminal after it has been installed open Command Prompt from the Start menu then enter `bash`.

If you have another version of Windows, you will need to [download and install Cygwin](https://cygwin.com/install.html). To get to the terminal after it has been installed open Cygwin from the Start menu.

The first time you open it you should set Cygwin to use your Windows home directory:

    $ echo 'db_home: windows' >> /etc/nsswitch.conf

Then close and reopen Cygwin so the change takes effect.

### Linux

The terminal can be in different places depending on what Linux distribution you are running. On Ubuntu, open the Dash by clicking the Ubuntu icon in the top left, type 'terminal', and select the Terminal app from the results that appear.


Essentials of the terminal
--------------------------

The terminal is a text-based interface that lets you navigate through your files and folders (aka. directories) and run commands.

The `$` symbol indicates the start of a terminal command -- you don't type that though. If you look at your terminal there should be a `$` at the start of each line already.

#### Where am I currently?

    $ pwd

Stands for 'print working directory'.

#### What files and folders are in this location?

    $ ls

Short for 'list'.

#### Changing to another directory

    $ cd <directory name>

Stands for 'change directory'. The directory name you are moving to is case-sensitive, eg:

    $ cd Desktop

To move to the parent directory of the one you are currently in use:

    $ cd ..

You will often be able to auto-complete some terminal commands by pressing tab twice. Try it by typing `cd`, followed by a space, then tab tab. It will display all the directories you can navigate into from here.

Often commands will be given with *flags*, which enable extra options. These start with a hyphen followed by a single letter. For example, `ls` has the `-l` 'long' flag to print out extra details about each file:

    $ ls -l

Multiple flags can be grouped together. So, to use the `-l` and the `-a` flags, you could type either `ls -l -a` or just `ls -la` for short. Flags can also be given in long format, starting with two hyphens, but these can't be grouped together.


Organising your files
---------------------

One common way to keep your work organised do this is create a new directory in your home directory named `Projects`. Every time you start a new project or tutorial create a new directory inside here for that piece of work. Keep everything relevant to that project inside here, and not on the desktop or anywhere else.

Name your directory and files in lowercase and with hyphens instead of spaces. This makes it quicker to navigate to them in the terminal.

You can also do this from the terminal. First, make sure you are inside your projects directory. Then run:

    $ mkdir an-example

Which stands for 'make directory'.


Installing things
-----------------

For most things it is easiest to do this from the terminal:

### Mac

Get Homebrew by following [the instructions on its website](https://brew.sh/).

You can then install things using the `brew` command. For example:

    $ brew install python

### Windows

If you are using the terminal the Windows 10 way via Bash on Windows you can install things with the `apt-get` command. For example:

    $ apt-get install python

If you have a another version of Windows and you are using Cygwin as your terminal you need to get `apt-cyg` by following [the instructions on its website](https://github.com/transcode-open/apt-cyg#quick-start).

You can then install things using the `apt-cyg` command. For example:

    $ apt-cyg install python

### Linux

Most Linux distributions come with Apt for installing things, though some use other tools.

If yours has it, you can then install things with the `apt-get` command. For example:

    $ sudo apt-get install python

The `sudo` stands for 'super-user do', which is used when admin permissions are needed to do something. You will be asked for your user password.

<hr>

Different programming languages also come with similar tools for installing things written in that language. For example, Python comes with Pip, Node comes with NPM, and Ruby comes with Gem. Often the things we need can only be installed using that language-specific tool.
