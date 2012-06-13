# Gravy

Sweet sauce for your gravatars, in real-time.

It takes two images - mask and template and overlays them on your
original gravatar.This makes it easy, for example, to (1) make any-shape
gravatars (2) decorate with any wacky frame.

Especially useful in places when you can't adorn gravatars with CSS, with shapes that can't be expressed easily using CSS, and with user-uploaded custom shapes and adornments.

Technically, Gravy is designed to be used either between your internal systems,
or directly infront of users (you'll need good redundancy and CDN to be
effective).

If you like these kind of things, I've also have the
packcss/packjs/packimg family of services [living here](https://github.com/jondot/packs).


## Usage

See live link: [http://gravy-demo.herokuapp.com/grainysubhatch/7b..30?s=48](http://gravy-demo.herokuapp.com/grainysubhatch/7bab8ed9cad2d098076b61b7cc3b8030?s=48)

Or try it yourself:

    $ sudo apt-get install imagemagick # only if you don't already have it.
    $ git clone git://github.com/jondot/gravy.git
    $ cd gravy; npm install
    $ node gravy &
    $ curl http://localhost:4000/grainysubhatch/7bab8ed9cad2d098076b61b7cc3b8030?s=48 > gravytized.png

## Url Parameters

Here is a fully featured url layout:

     http://host/<template_name>/<gravatar_hash>?s=<gravatar_sz>&offset=<x,y>

* template: name of the folder that contain the template resources
* gravatar hash, see [here](https://en.gravatar.com/site/implement/hash/) how to compute from an email
* gravatar size
* original image (gravatar) offset


## Overlays

Overlaying is done by fetching the original gravatar using your hash,
cutting off unwanted content (shaping it) with the mask, and then
applying the template above it. Here's a small sketch:
                   
                  ,--- tmpl.png
                 /  ,--- mask.png
                '  /   ,--- original (from gravatar)
     you        |  :  I
        <)  --> |  :  I
                |  :  I
                |  :  I
                |  :  I
               `----'
                  \
                   `--- include these in /template/<name>/

## Scratch Your Own Itch

There's plenty of room for hacking. Configurable storage to S3, local caching
of gravatars, fine-tuning client-caching headers - I totally YAGNI'd it,
but if you need it - I'll be happy to accept pull requests.


# Contributing

Fork, implement, add tests, pull request, get my everlasting thanks and a respectable place here :).


# Copyright


Copyright (c) 2012 [Dotan Nahum](http://gplus.to/dotan) [@jondot](http://twitter.com/jondot). See MIT-LICENSE for further details.

