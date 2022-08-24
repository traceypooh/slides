#!/bin/zsh -e
mydir=${0:a:h}
cd $mydir


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
      set -x
      echo -n "<b><a href='https://traceypooh.github.io/slides/$i'>$i</a></b></p>"
      set +x
      echo
    done
  ) |sort -r -k2,5000 -t '\t'
) >| index.html



# copy out public OK slide decks and formatting from another repo
echo "
<link href='https://esm.archive.org/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet'>
<style>
  body { margin: 50px }
  a { text-decoration:none }
  img { max-width:100%; height:auto }
  small { float: right }
</style>

<h1>🚂 DevOps Training</h1>

" >| devops/index.html


for i in  2021-02-03  2021-02-17  2021-02-24  2021-03-10  2021-03-31  2021-04-07  2021-05-12; do
  rsync -Pav  ../TechDocs/devops/$i.md  devops/$i/index.html
  echo "<p><a href='$i/index.html'>$i</a></p>" >> devops/index.html
done

rsync -Pav ../TechDocs/eveal.js/ devops/eveal.js/
