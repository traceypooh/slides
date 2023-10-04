
// Idea to extend reveal.js to allow for a single boilerplate line at the top of any .md file
// and have it do everything from there.
// This also very nicely allows the file to be served locally in a browser
// (avoids blocked AJAX attempt for an external .md file load, etc.)


// Utility - loads an external JS file and append it to the head, from:
// http://zcourts.com/2011/10/06/dynamically-requireinclude-a-javascript-file-into-a-page-and-be-notified-when-its-loaded
function req(file, callback) {
  const script = document.createElement('script')
  script.src = file
  script.type = 'text/javascript'
  script.onload = callback // real browsers
  document.getElementsByTagName('head')[0].appendChild(script)
}

// NOTE: this allows caller to override the default and include us remotely
if (!window.BASE) window.BASE = '../eveal.js/reveal.js/'

req(`${window.BASE}lib/js/head.min.js`, () => {
  // slurp the current body text (markdown) into a string,
  // then rebuild the body with the proper markup wrapping the markdown
  const body = document.getElementsByTagName('body')[0]
  const markdown = body.innerHTML

  body.innerHTML = `
    <div class="reveal">
      <div class="slides">
        <section data-markdown  data-separator="^---">
          <textarea data-template id="inject">
          </textarea>
        </section>
      </div>
    </div>`

  document.getElementById('inject').innerHTML = markdown


  const meta = document.createElement('meta')
  meta.name = 'viewport'
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
  document.getElementsByTagName('head')[0].appendChild(meta)


  // get the styles and theme in place
  const loads = [
    `${window.BASE}css/reveal.css`,       // main CSS
    `${window.BASE}${window.NIGHT ? '../night.css' : '../sky.css'}`, // desired theme
    `${window.BASE}lib/css/zenburn.css`,  // for syntax highlighting of code
    (window.location.search.match(/print-pdf/gi) ? // printing and PDF exports
      `${window.BASE}css/print/pdf.css` :
      `${window.BASE}css/print/paper.css`),
  ]

  // eslint-disable-next-line guard-for-in
  for (const idx in loads) {
    const link = document.createElement('link')
    link.href = loads[idx]
    link.rel = 'stylesheet'
    link.type = 'text/css'
    document.getElementsByTagName('head')[0].appendChild(link)
  }


  req(`${window.BASE}js/reveal.js`, () => {
    // More info about config & dependencies:
    // - https://github.com/hakimel/reveal.js#configuration
    // - https://github.com/hakimel/reveal.js#dependencies
    window.Reveal.initialize({
      controls: true,
      progress: false,
      history: true,
      center: true,
      margin: 0.1,
      // width: 1920, height: 1080, // ?print-pdf => 16:9
      dependencies: [
        { src: `${window.BASE}plugin/markdown/marked.js` },
        { src: `${window.BASE}plugin/markdown/markdown.js` },
        { src: `${window.BASE}plugin/notes/notes.js`, async: true },
        {
          src: `${window.BASE}plugin/highlight/highlight.js`,
          async: true,
          callback: () => {
            window.hljs.configure({tabReplace: '  '})
            window.hljs.initHighlightingOnLoad()
          },
        },
      ],
    })

    // window.Reveal.configure({ pdfSeparateFragments: true });
  })
})
