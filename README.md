Snippets
==============

This is a fork of Craig Silverstein's 
[Snippets](https://github.com/Khan/snippets) project, with various UI 
tweaks. 

Original Overview
-------------------------

This server supports writing and reading weekly snippets -- status
updates -- for a group of people.

When I joined Khan Academy, my first project was to write a version of
the weekly-snippet server I had worked with [at
Google](http://blog.idonethis.com/google-snippets-internal-tool/).
Years later, with the help of many other intrepid Khan Academy
employees, it's ready for the world!

While there are [many](https://weekdone.com/)
[snippet](https://www.workingon.co/)
[systems](https://www.teamsnippets.com/) out there, this one is
optimized for simplicity (also, free-ness).  For instance, it prefers
single webpages with lots of info over paging, queries, or fancy
javascript.  Filling out a snippet involves writing into a textbox: no
fields or text editors or other barriers to productivity.  (Markdown
is available for those who want nice formatting.)  This makes it easy
to learn and easy to program with.


What are weekly snippets?
-------------------------

A weekly snippet is an (ideally) brief description of what you did the
last week.  To give an idea of 'brief': the snippet-entry textbox is
sized for 4 bullet-point entries, each 80 characters or less.

Your snippets are visible to everyone else on your email domain.  (So
my snippets are visible to everyone who logs in to KA snippet server
with a `@khanacademy.org` email address.)  Depending on your
configuration options, they may also be visible to everyone else on
your server.


Why have snippets?
------------------

Different people might have different purposes for weekly snippets:

* Instead of a weekly standup or other meeting where everyone shares
  what they've done in the last week, they can just read (and write)
  snippets.
* Managers can read snippets of their direct reports to make better
  use of 1-on-1 meetings.
* You can look over your own snippets when writing a self-evaluation
  or applying for a promotion, or when you have any other need to remind
  yourself what you've worked on.

I've found this last reason is particularly compelling.  I also use
snippets as a simple "time and motion" study: when I have too many
things to put into snippets one week, I know I'm being spread too
thin!

Another benefit of snippets is serendipidous helping: by reading
someone's snippet, you may discover a task or problem they're working
on that you can help with, that otherwise you would never have known
about.


What are snippets not good for?
-------------------------------

Some people go into a snippet system with unrealistic expectations and
are disappointed.

* Snippets do not work well for large groups, say **over 100
  people**.  If you have 1000 people using your snippet server, it is
  neither practical nor useful to read through everyone's snippets
  every week.

* Snippets are, by design, a low level tool: they show you trees but
  not the forest.  The snippet system does not support "rolling up"
  groups of snippets or having team-based snippets (though certain
  individuals could certainly choose to have their own snippets refer
  to a team's progress).

* Snippets do not provide context.  If you don't already know what
  someone is working on, their snippet may well be more confusing
  than enlightening.

At Khan Academy, the entire company uses one snippet server.  The
snippets are divided into various categories, some functional, some
project-based.  I like to skim over the snippets for people in
unrelated categories such as "facilities" or "recruiting."  I read
more closely the snippets in projects I'm interested in but not
working on, such as "mobile."  And I read most closely the snippets of
people in my own project or closely related projects.
