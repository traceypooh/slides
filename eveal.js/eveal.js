
// Idea to extend reveal.js to allow for a single boilerplate line at the top of any .md file
// and have it do everything from there.
// This also very nicely allows the file to be served locally in a browser
// (avoids blocked AJAX attempt for an external .md file load, etc.)

/* CUSTOMIZATION SETTINGS:
window.NIGHT
window.REMOTE
window.BASE
*/


// Utility - loads an external JS file and append it to the head
function req(file, callback) {
  const script = document.createElement('script')
  script.src = file
  script.type = 'text/javascript'
  script.onload = callback // real browsers
  document.getElementsByTagName('head')[0].appendChild(script)
}

// NOTE: these allow caller to override the default (2 different ways) and include us remotely.
// NOTE: the `../eveal.js/` redundancy is for legacy setup
if (window.REMOTE)
  window.BASE = 'https://archive.org/~tracey/slides/eveal.js/reveal.js/'
const BASE = window.BASE ?? '../eveal.js/reveal.js/'

req(`${BASE}lib/js/head.min.js`, () => {
  // slurp the current body text (markdown) into a string,
  // then rebuild the body with the proper markup wrapping the markdown
  const body = document.getElementsByTagName('body')[0]

  // `replace()` for bulleted lists..
  // handle 'soft tabs' of TAB getting turned into 2 SPACE chars
  const markdown = body.innerHTML
    .replace(/\n {2}- /g, '\n\t- ')
    .replace(/\n {4}- /g, '\n\t\t- ')
    .replace(/\n {6}- /g, '\n\t\t\t- ')
    .replace(/\n {8}- /g, '\n\t\t\t\t- ')

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
    `${BASE}css/reveal.css`,       // main CSS
    `${BASE}${window.NIGHT ? '../night.css' : '../sky.css'}`, // desired theme
    `${BASE}lib/css/zenburn.css`,  // for syntax highlighting of code
    (window.location.search.match(/print-pdf/gi) ? // printing and PDF exports
      `${BASE}css/print/pdf.css` :
      `${BASE}css/print/paper.css`),
  ]

  // eslint-disable-next-line guard-for-in
  for (const idx in loads) {
    const link = document.createElement('link')
    link.href = loads[idx]
    link.rel = 'stylesheet'
    link.type = 'text/css'
    document.getElementsByTagName('head')[0].appendChild(link)
  }


  req(`${BASE}js/reveal.js`, () => {
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
        { src: `${BASE}plugin/markdown/marked.js` },
        { src: `${BASE}plugin/markdown/markdown.js` },
        { src: `${BASE}plugin/notes/notes.js`, async: true },
        {
          src: `${BASE}plugin/highlight/highlight.js`,
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
