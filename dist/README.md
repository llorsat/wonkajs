# Requirements

To run wonkajs you must have installed node.js.

# Install

Install wonkajs as global node module on your shell with the install command:

```
$ sudo npm install -g wonkajs
```

# Getting started

## Create a project

To create new project, run command:

```
$ wonkajs project demo
```

## Run server

To run wonkajs server and verify that's working, just must run inside the project folder:

```
$ wonkajs server
```

## First application

To create an app, is necessary be on the project folder and run the app command:

```
$ wonkajs app appdemo
```

## Internacionalization (i18n)

To generate language files:

```
$ wonkajs i18n
```

This command will find string on html and javascript file to localize.

To get this works, you must declare your string on javascript files with function **__**, for example:

```
var message = __('String to locale');
```

Or if you want to locale any string on any template, just use the handlebars helper:

```
<p>{{ __ "String to locale" }}</p>
```

## Deploy

To deploy your project, we recommend compress the project and upload to a server ready to display static content.

To deploy your project, just need to run:

```
$ wonkajs deploy
```

With this commando, will be created a **deploy** folder, that will has the files:

* index.html
* main.css
* main.js
* images
* icons
* languages

Upload this folder to your server, target to your web server and ready, your application will works.

