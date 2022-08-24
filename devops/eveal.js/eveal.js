
// Idea to extend reveal.js to allow for a single boilerplate line at the top of any .md file
// and have it do everything from there.
// This also very nicely allows the file to be served locally in a browser
// (avoids blocked AJAX attempt for an external .md file load, etc.)


// Utility - loads an external JS file and append it to the head, from:
// http://zcourts.com/2011/10/06/dynamically-requireinclude-a-javascript-file-into-a-page-and-be-notified-when-its-loaded
function require(file, callback){
  var script = document.createElement('script');
  script.src = file;
  script.type = 'text/javascript';
  script.onload = callback; // real browsers
  script.onreadystatechange = function() { if (_this.readyState == 'complete') callback() }; //MSIE
  document.getElementsByTagName('head')[0].appendChild(script);
}


var BASE = '../eveal.js/reveal.js/'
require(BASE + 'lib/js/head.min.js', function() {

  // slurp the current body text (markdown) into a string,
  // then rebuild the body with the proper markup wrapping the markdown
  var body = document.getElementsByTagName('body')[0];
  var markdown = body.innerHTML;

  // ugh
  markdown = (markdown
    // handle code blocks w/ lead SPACE chars - faked with '__' for now, but visually remove
    .replace(/\n____/g, '\n&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/\n__/g, '\n&nbsp;&nbsp;')
    // for bulleted lists..
    // handle 'soft tabs' of TAB getting turned into 2 SPACE chars
    .replace(/\n  \- /g, '\n\t- ')
    .replace(/\n    \- /g, '\n\t\t- ')
    .replace(/\n      \- /g, '\n\t\t\t- ')
    .replace(/\n        \- /g, '\n\t\t\t\t- '))


  body.innerHTML = ('\n\
    <div class="reveal">\n\
    	<div class="slides">\n\
    		<section data-markdown  data-separator="^---">\n\
    			<textarea data-template id="inject">\n\
          </textarea>\n\
  			</section>\n\
  		</div>\n\
  	</div>\n\
  ');

  document.getElementById('inject').innerHTML = markdown;


  var meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.getElementsByTagName('head')[0].appendChild(meta);


  // get the styles and theme in place
  var loads = [
    BASE + 'css/reveal.css',       // main CSS
    BASE + '../sky.css',           // desired theme
    BASE + 'lib/css/zenburn.css',  // for syntax highlighting of code
    (window.location.search.match( /print-pdf/gi ) ? // printing and PDF exports
      BASE + 'css/print/pdf.css' :
      BASE + 'css/print/paper.css')
  ];
  for (var idx in loads) {
		var link = document.createElement('link');
		link.href = loads[idx];
		link.rel = 'stylesheet';
		link.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(link);
  }


  require(BASE + 'js/reveal.js', function(){
    // More info about config & dependencies:
    // - https://github.com/hakimel/reveal.js#configuration
    // - https://github.com/hakimel/reveal.js#dependencies
    Reveal.initialize({controls: true,  progress: false,  history: true,  center: true,  margin: 0.1,
      dependencies: [
        { src: BASE + 'plugin/markdown/marked.js' },
        { src: BASE + 'plugin/markdown/markdown.js' },
        { src: BASE + 'plugin/notes/notes.js', async: true },
        { src: BASE + 'plugin/highlight/highlight.js', async: true, callback: function() {
          // hljs.configure({tabReplace: '  '})
          hljs.initHighlightingOnLoad()
        } }
      ]
    });
  });
});
