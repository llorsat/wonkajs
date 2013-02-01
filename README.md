# Requirements

To run wonkajs you must have installed node.js and npm:

[Follow the instructions](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)

# Install

Install wonka.js as global node module, on your shell type the command:

```
$ sudo npm install -g wonkajs
```

# Getting started

## Create a project

First step is create a new project:

```
$ wonkajs project demo
```

This will create a project template that you can use as base for many kinds of web applications.

## Run server

To run wonkajs server and verify that's working, just must run inside the project folder:

```
$ wonkajs server
```

With this command we launch a server on port 9300 by default, but you can change it:

```
$ wonkajs server 9700
```

Visit your project on:

```
http://localhost:9300
```

or in their case:

```
http://localhost:9700
```

## First application

To create an app, is necessary be on the project folder and run the app command:

```
$ wonkajs app books
```

When this command run, a router links the Main view on application with a url.

The nomenclature is similar to:

```
/#books -> books.views.Main
```

When the app is more complex than one level you can create it typing:

```
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

For more information [read our documentation](https://github.com/llorsat/wonkajs/wiki).
