# Wonka.js

Wonka.js is a javascript client-side framework MVC like, built to enhance the frontend development, prioring team work and clean code.

## Install and configure

### Requirements

To run wonka.js you must have installed node.js.

[Install node](http://nodejs.org)

Also you'll need to install [git](http://git-scm.com).

### Install

Install wonka.js as global node module, on your shell type the command:

```sh
$ sudo npm install -g wonkajs
```

At the end, verify that wonka has been installed successfuly:

```sh
$ wonkajs --version
```

This command must return the version number 1.6.0.

## Getting started

### Create a project

First step is create a new project:

```sh
$ wonkajs project demo
```

This will create a project template that you can use as base for many kinds of web applications.

### Run server

To run wonka.js server and verify that is working, just must run inside the project folder:

```sh
$ wonkajs server
```

With this command we launch a server on port 9300 by default, but you can change it:

```sh
$ wonkajs server 9700
```

Visit your project on:

```
http://localhost:9300
```

or in their case on:

```
http://localhost:9700
```

### First application

To create an app, is necessary be on the project folder and run the app command:

```sh
$ wonkajs app books
```

When this command run, a router links the Main view on application with a url.

The nomenclature is similar to:

```sh
/#books -> books.views.Main
```

When the app is more complex than one level you can create it typing:

```sh
$ wonkajs app books science
```

And the router will build:


```
/#books/science -> books.science.views.Main
```

So finally you can visit your new application on:

```
http://localhost:9300/#books
```

Or in their case:

```
http://localhost:9300/#books/science
```

### Deploy

To deploy your project, we recommend compress the project and upload to a server ready to display static content.

To deploy your project, just need to run:

```sh
$ wonkajs deploy
```

With this command, will be created a deploy folder, that will has the files:

* index.html
* main.css
* main.js
* package.json
* manifest.webapp
* icons

Upload this folder to any server path, and points your web server to this path and your application will works.

For more information [read the docs](https://github.com/llorsat/wonkajs/wiki).
