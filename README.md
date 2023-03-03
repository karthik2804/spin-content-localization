## Spin content Localization Example

This repository showcases serving localized content based on `accept-langugage` headers using spin.

### Building and Running the Examples

Use the following commands to build and run the example

```shell
$ npm install
$ spin build
$ spin up
```

Currently, by default, the examples support only English, German and Spanish with English as the default.

To test the application for various localization using curl, use the following commands:

```shell
# For the English version
$ curl -i -H 'Accept-Language: en'  localhost:3000
# For the German version
$ curl -i -H 'Accept-Language: de'  localhost:3000
# For the Spanish version
$ curl -i -H 'Accept-Language: es'  localhost:3000
```

### Modifying the Content

The default version of the content should be added to the `html_content` folder and any localization data for that specific html file must be added to a file of the same name and path inside `localization_data` folder (eg) If a new a page is to be added and will be served at `http://localhost:3000/about/me`, the following files need to be added:

- A `me.html` should be added to `html_content/about/`
- If localization is required, then a `me.json` is added to `localization_data/about/`

The tags of the `html` that need localization support must contain the attribute `data-i18n-key`. This key is then used in the corresponding localization datafile for different languages to provide language specific content.


> DISCLAIMER: The translations are done using google translate and it might not be accurate.