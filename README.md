Prism Syntax Highlighting for Ghost
==================

~~Demo: http://ghost.flweb.it/ghost-syntax-highlighting-with-prismjs/~~ (offline)

Ghost is work-in-progress, especially the plugin API, so this is just an experiment, installation/updates are not super smooth, but I'm sure it will improve with time.

## Installation
**Tested with:** Ghost 0.3.2 

The installation requires patching a couple of lines in core, when updating Ghost it will break, but it would break anyway for the API changes, so check for new version/instructions when updating Ghost.

- Download the plugin in contents/plugins/prism, e.g with git from ghost root `git clone https://github.com/francescolaffi/ghost-prism-plugin.git content/plugins/prism`
- Patch some core files, from ghost root run `patch -p1 < content/plugins/prism/patch/0.3.2.diff`
- edit your config.js adding activePlugins and prism plugin settings for your environment, example:

```js
config = {
    // ### Development **(default)**
    development: {
        activePlugins: ['prism'],
        prism: {
            theme: 'default',
            plugins: ['line-numbers'],
            langs: ['markup', 'javascript', 'css', 'css-extras', 'php', 'php-extras', 'ruby', 'bash']
        }
```

- Restart Ghost

It will compile the selected prism theme, plugins and langs together in a js and a css file when starting ghost, so config changes need ghost restart.

## Usage
Prism syntax highlighting integrate nicely with the html ghost generates from markdown.
You can use the triple backticks in markdown to generate`<pre><code>` html, adding the prism specific classes after the opening backticks.

examples:

    ```lang-javascript
    alert('hello world');
    ```

    ```lang-ruby line-numbers
    puts 'Hello world'
    ```

Or manually enter the html with the prism syntax. You can find info on prism and available themes, plugins and languages at http://prismjs.com/.

## Drawbacks
- only highligh syntax on frontend, not admin
- using the line-numbers prism plugin the line numbers alignment is a bit off
