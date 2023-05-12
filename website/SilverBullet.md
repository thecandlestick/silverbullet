SilverBullet is an extensible, [open source](https://github.com/silverbulletmd/silverbullet), **personal knowledge management** system. Indeed, that’s fancy talk for “a note-taking app with links.” However, SilverBullet goes a bit beyond _just_ that.

You’ve been told there is _no such thing_ as a [silver bullet](https://en.wikipedia.org/wiki/Silver_bullet). You were told wrong.

Before we get to the litty griddy, some _quick links_ for the impatient reader: [[Download]], [[Sync]], [[CHANGELOG]], [Roadmap](https://github.com/orgs/silverbulletmd/projects/2/views/1), [Issues](https://github.com/silverbulletmd/silverbullet/issues), [Discussions](https://github.com/silverbulletmd/silverbullet/discussions), [Mastodon](https://hachyderm.io/@silverbullet), [Discord](https://discord.gg/EvXbFucTxn), [Docker Hub](https://hub.docker.com/r/zefhemel/silverbullet).

Now that we got that out of the way, let’s have a look at some of SilverBullet’s features.

## Features
* Runs in any modern browser (including on mobile) when run as a [[Server]], but can also be run as a [[Desktop]] and [[Mobile]] app.
* Provides an enjoyable [[Markdown]] writing experience with a clean UI, rendering text using [[Live Preview|live preview]] further **reducing visual noise**, while still providing direct access to the underlying markdown syntax.
* Supports wiki-style **page linking** using the `[[page link]]` syntax, even keeping links up-to-date when pages are renamed.
* Optimized for **keyboard-based operation**:
  * Quickly navigate between pages using the **page switcher** (triggered with `Cmd-k` on Mac or `Ctrl-k` on Linux and Windows).
  * Run commands via their keyboard shortcuts, or the **command palette** (triggered with `Cmd-/` or `Ctrl-/` on Linux and Windows).
  * Use [[🔌 Core/Slash Commands|slash commands]] to perform common text editing operations.
* Provides a platform for [end-user programming](https://www.inkandswitch.com/end-user-programming/) through its support for annotating pages with [[Frontmatter]] and [[🔌 Directive|directives]] (such as [[🔌 Directive/Query|#query]]), making parts of pages _dynamic_.
* Experimental [[🔌 Collab|real-time collaboration support]].
* Robust extension mechanism using [[🔌 Plugs]].
* **Self-hosted**: you own your data. All content is stored as plain files in a folder on disk. Back up, sync, edit, publish, script with any additional tools you like.
* SilverBullet is [open source, MIT licensed](https://github.com/silverbulletmd/silverbullet) software.

To get a good feel of what SilverBullet is capable of, have a look at this introduction video.

```embed
url: https://youtu.be/VemS-cqAD5k
```

## Try it
Here’s the kicker:

==You are looking at a (more or less) operational copy of SilverBullet **right now**==.

That’s right, **this very website is powered by SilverBullet itself**. 🤯

On this site, everything is editable just none of it persists (the back-end is read-only). So, edit away, reload the page and everything resets.

Don’t just sit there, try it!

* Click on the page picker (book icon) icon at the top right, or hit `Cmd-k` (Mac) or `Ctrl-k` (Linux and Windows) to open the **page switcher**. Type the name of a non-existent page to create it (although it won’t save in this environment).
* Click on the terminal button (top right) or hit `Cmd-/` (Mac) or `Ctrl-/` (Linux and Windows) to open the **command palette** (note that not all commands will work in this mode).
* Select some text and hit `Alt-m` to ==highlight== it, or `Cmd-b` (Mac) or `Ctrl-b` (Windows/Linux) to make it **bold**, or `Cmd-i` (Mac) or `Ctrl-i` (Windows/Linux) to make it _italic_.
* Click a link somewhere on this page to navigate there.
* Start typing `[[` somewhere to insert a page link (with completion).
* [ ] Tap this box 👈 to mark this task as done.
* Start typing `:party` to trigger the emoji picker 🎉
* Type `/` somewhere in the text to invoke a **slash command**.
* Hit `Cmd-p` (Mac) or `Ctrl-p` (Windows, Linux) to show a live preview for the current page on the side, if your brain doesn’t speak native Markdown yet.
* Click this button {[Editor: Toggle Vim Mode]} to toggle Vim mode
* Open this site on your phone or tablet and... it just works!
* Are you using a browser with **PWA support** (e.g. any Chromium-based
  browser)? Click on that little icon to the right of your location bar that says “Install SilverBullet” to give SB its own window frame and desktop icon, like it is a stand-alone app (not particularly useful on silverbullet.md, but definitely do this once you install it yourself).

Oh yeah, and you can use fancy things like tables:

| Page | Comment |
|----------|----------|
| [[SilverBullet]] | Main product page |
| [[CHANGELOG]] | The latest updates |

or code snippets, like JavaScript:

```javascript
function helloWorld() {
   return "Hello there!"
}
```

or YAML:

```yaml
name: SilverBullet
rating: 5
```

There are a few features you don’t get to fully experience in this environment, because they rely on a working back-end, such as:

* Any edits you make and pages you add aren’t saved (kind of useful).
* [[🔌 Directive|Directives]] are disabled, although you will see them being used across this site (look for sections with subtle curved lines around them, if you move your cursor inside you’ll see where their content is generated from), they just don’t update their content dynamically.
* **Full-text search**.
* **Extending** and updating SB’s functionality by installing additional [[🔌 Plugs]] (SB parlance for plug-ins) and writing your own.

## Download SilverBullet
Has your mind been sufficiently blown to commit to an install? Took you long enough, alright then.

<!-- #include [[Download]] -->
You have three options to install and use SilverBullet. Pick your poison, as they say. Have a look at all three to decide what’s best for you:

1. [[Server]] — install SilverBullet as a web server on your local machine or network, and access it via any web browser. This is the best choice for nerds 🤓.
2. [[Desktop]] — install SilverBullet as a desktop application, editing a local folder of files. This is the best option for casual users.
3. [[Mobile]] — install SilverBullet as a “native” mobile application (native: as in — distributed via the app store, and with an icon on your home screen). This is the best option for people with phones. More specifically, people with phones that don’t want to access the [[Server]] via their mobile browser, or have anxiety around Internet connectivity.
<!-- /include -->

## Where to go from here
Click on the links below to explore various aspects of SilverBullet more in-depth:

* [[CHANGELOG]]: What’s new?
* [[🔌 Plugs]]: extensions available for, and as part of SilverBullet
* [[SETTINGS]]: What settings exist and how to change them
* [[Special Pages]]: a few page names in Silver Bullet have special meaning
* [[🔨 Development]]: how to start hacking on SilverBullet itself

## Support
If you (hypothetically) find bugs or have feature requests, post them in [our issue tracker](https://github.com/silverbulletmd/silverbullet/issues). Want to contribute? [Check out the code](https://github.com/silverbulletmd/silverbullet).

Want to chat with us? [Join our Discord](https://discord.gg/EvXbFucTxn)!
