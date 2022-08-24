#!/bin/zsh -ex

ME=https://tracey.archive.org

(
  echo "
<link href='https://esm.archive.org/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet'>
<style>
  body { margin: 50px }
  a { text-decoration:none }
  img { max-width:100%; height:auto }
  small { float: right }
</style>


<h1>Tracey Jaquith slides from recent talks</h1>

<p>See also: <a href="$ME">$ME</a></p>
"

  (
    for i in $(/bin/ls -d */ |tr -d / |egrep -v '^images$'); do
      echo -n "<p><small><i>(last update: \t"
      git log -1 --format=%ci $i |cut -b1-7 |tr -d '\n'
      echo -n ")</i></small>"
      echo -n "<b><a href='https://traceypooh.github.io/slides/$i'>$i</a></b></p>"
      echo
    done
  ) |sort -r -k2,5000 -t '\t'
) >| index.html
