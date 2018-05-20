# A markdown live editor and renderer with math formulas

Allow to live edit markdown with math
(rendered by [katex](https://khan.github.io/KaTeX/)) and to render
external markdown page containing math formulas.

## Live editor and renderer

There is no common solution to manage math in markdown. [Several options
are available](https://github.com/cben/mathdown/wiki/math-in-markdown)
but none of them offer the elegance, practicality and ease of use
that `mathdown` allows.

### Markdown

`mathdown` use [marked]() for generating HTML from markdown. Thus `mathdown`
supports CommonMark and Github flavored markdown.

### Math

Additionally, `mathdown` support mathematic formulas using katex.
Inline and math mode are supported.

Inline mode:
```
Let's define the matrix `$A$`.
```

Math mode:
````
The projection then is:
```math
$$p=A\hat x$$
```
````

The advantage of this solution is that if the markdown engine does not
support math rendering, your equations remain readable as text enclosed in
`<code>` blocks.

## Run the server

Download the package through npm:
```
npm install mathdown
```
or through git
```
git clone https://github.com/jdmichaud/mathdown
cd mathdown
npm install
```

Create a config file:
```
cat > config.yml << EOF
static_path: static/
port: 8000
template: static/template.mustache
EOF
```

* `static_path` points to the static file path.
* `port` is the web server port.
* `template` is the template used to render external markdown.
A sample is provided in the `static` folder.

Launch the server:
```
node index.js -c config.yml
```

## Use `mathdown`

### As an editor

Go to the root page of your serveur, and a basic live editor can be used
to test markdown with math.

### As a renderer

Once you markdown file is hosted somewhere (github, gist, bitbucket, etc),
you can render it by passing a url to `mathdown`:
```
http://mathdown.com/toHtml?url=http://your.markdown/url
```
