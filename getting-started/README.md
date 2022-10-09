Getting started
===============

*But where do I type all this stuff in?*


Text editors
------------

To write code you will need a 'text editor' -- which is a bit of a misnomer because we'll be using it to write code. I recommend [Visual Studio Code](https://code.visualstudio.com/). Alternatively  [Sublime Text](https://www.sublimetext.com/) is also a good option. They both run on Mac and Windows. Download and install one from their respective websites.

Though we call them text editors, these are tools really specialised for writing code, not text, and they have many features built-in to make this easier. One important one is *syntax highlighting*, which colours different parts of your code to make it easier to read. The reason they are called text editors is that the files they produce are *plain-text* files, without any formatting -- fonts, margins, etc -- that you would get in something like Word.


The terminal
------------

Also known as the command line.

### Mac

Open up the Finder, then go into Applications on the left. Find the Utilities folder -- the Terminal app is inside. You might want to drag it onto your Dock for quicker access.

### Windows

Search for 'Windows Terminal' from the taskbar. For some tasks you will need to right-click it, then click 'run as administrator'. If you can't find it, [install it from the Microsoft Store](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701). However, you now have two options for how to proceed.

One option is to use the Windows Terminal as it is -- known as Command Prompt. This is not commonly used, and most tutorials you come across won't mention it -- so most of the specific commands you need to type are a bit different. So your first option, and the quickest, is just to learn those commands instead.

If you have Windows 10 or later, a better option -- though one that takes longer to set up -- is to install something called Windows Subsystem for Linux, or WSL. To do this make sure you have opened Windows Terminal as an administrator, then run:

    $ wsl --install

This will start the installation process, which takes a while. You will need to restart your computer mid-way.

Once that has completed, open Windows Terminal, click the down-arrow to open the settings, then in the startup section change the default profile to the WSL option. Now, when you open the Windows Terminal it will use WSL.


Essentials of the terminal
--------------------------

The terminal is a text-based interface that lets you navigate through your files and folders (aka. directories) and run terminal-based tools.

The `$` symbol indicates this is a terminal command -- you don't type that though. If you look at your terminal there is typically a `$` at the start of each line.

#### Where am I currently?

    $ pwd

Stands for 'print working directory'.

#### What files and folders are in this location?

    $ ls

Short for 'list'.

#### Move to another directory

    $ cd <directory name>

Stands for 'change directory'. The directory name you are moving to is case-sensitive, eg:

    $ cd Desktop

To move to the parent directory of the one you are currently in use:

    $ cd ..

You will often be able to auto-complete some terminal commands by pressing tab. Try it by typing `cd`, followed by a space, then tab. It will display all the directories you can navigate into from here.

Often commands will be given with *flags*, which enable extra options. These start with a hyphen followed by a single letter. For example, `ls` has the `-l` 'long' flag to print out extra details about each file:

    $ ls -l

Multiple flags can be grouped together. So, to use the `-l` and the `-a` flags, you could type either `ls -l -a` or just `ls -la` for short. Flags can also be given in long format, starting with two hyphens, but these can't be grouped together.


Organising your files
---------------------

One common way to keep your work organised do this is create a new directory in your home directory named `Projects`. Every time you start a new project or tutorial create a new directory inside here for that piece of work. Keep everything relevant to that project inside here, and not on the desktop or anywhere else.

Name your directory and files in lowercase and with hyphens instead of spaces. This makes it quicker to navigate to them in the terminal, as dealing with spaces can be fiddly.

You can also do this from the terminal. First, make sure you are inside your projects directory. Then run:

    $ mkdir an-example

Which stands for 'make directory'.


Installing things
-----------------

For most things it is easiest to do this from the terminal:

### Mac

The easiest way is to first install Homebrew, a tool that makes it easier to install other things. Follow [the instructions on its website](https://brew.sh/) to get it set up. You then use it with the `brew` command. For example:

    $ brew install ruby

### Windows

If you are using the default Windows terminal without WSL and have a recent version of Windows you can try installing things with the `winget` command: For example:

    $ winget install ruby

This won't work with older versions of Windows. [There are further instructions here.](https://learn.microsoft.com/en-us/windows/package-manager/winget/).

If you are using WSL you can install things with the `apt` command. For example:

    $ apt install ruby

<hr>

Different programming languages also come with similar tools for installing things written in that language. For example, Python comes with Pip, Node comes with NPM, and Ruby comes with Gem. Often the things we need can only be installed using that language-specific tool.
