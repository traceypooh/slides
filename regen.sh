#!/bin/zsh -ex

(
  echo '# Slides'
  echo '## Slides and decks from recent Talks and gatherings'
  echo
  echo 'See also: <a href="https://tracey.archive.org/">https://tracey.archive.org</a>'
  ( for i in $(/bin/ls -d */ |tr -d / |egrep -v '^images$'); do
      echo -n "[$i](https://traceypooh.github.io/slides/$i)\t"
      echo -n "<small><i>(last update: "
      git log -1 --format=%ci $i |cut -b1-7 |tr -d '\n'
      echo ")</i></small><br>"
    done
  ) |sort -r -k2,5000 ) >| README.md
