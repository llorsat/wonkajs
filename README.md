# Install

Primero debes clonar este proyecto, como sigue:

```
$ git clone https://bitbucket.org/amllorden/wonkajs
```

Posteriormente debes instalar wonkajs como global, solo basta con colocarte en el directorio que contiene la carpeta wonkajs que acabas de clonar y ejecutar el siguiente comando:

```
$ sudo npm install -g wonkajs
```

# Primeros pasos

## Crear un proyecto

Para crear un proyecto nuevo, solo basta con hacer:

```
$ wonkajs project demo
```

## Correr servidor

Para correr el servidor de wonkajs y verificar que esta funcionando, solo basta con hacer:

```
$ wonkajs server
```

Dentro de la carpeta del proyecto

## Crear una aplicación

Para crear una aplicación es necesario colocarse en la raíz del proyecto y ejecutar el siguiente comando:

```
$ wonkajs app appdemo
```

## Internacionalizacion

Para generar archivos de idioma, solo basta con ejecutar el comando:

```
$ wonkajs i18n
```

Este comando ira a buscar cadenas en los archivos html y js para localizar.

Para que ello suceda debes de definir en tus javascript, las cadenas para localizar con la funcion **__**, por ejemplo:

```
var message = __('Cadena a localizar');
```

O si quieres localizar una cadena en alguna plantilla solo bastará con hacer:

```
<p>{{ __ "Cadena a localizar" }}</p>
```

## Producción

Para poner tu proyecto en producción, te recomendamos comprimir todo el proyecto y levantar un servidor de contenido estatico, para que devuelva tu proyecto. Para comprimir tu proyecto solo bastará con hacer:

```
$ wonkajs deploy
```

Con esto se generará una carpeta **deploy** dentro de tu carpeta, que tendra el siguiente contenido:

* index.html
* main.css
* main.js
* images
* icons
* languages

Esa carpeta subela a tu servidor, apunta a ella y listo. Tu aplicacion estará funcionando.


** Aun estan pendientes algunas validaciones para los comandos sé noble.**</p>
