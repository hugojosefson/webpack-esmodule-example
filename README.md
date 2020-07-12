# webpack-esmodule-example

Using webpack for both modern and legacy browsers, at the same time.

This is an example webapp, where modern browsers will load an esmodule
`<script type="module" src="..."/>` while older browsers will load the
default `<script async nomodule src="..."/>`.

## Build

To build for production:

```bash
yarn
yarn build
```

The resulting production webapp is in `target/prod/`. It can be served
with:

```bash
yarn start
```

It will serve the website on
[http://localhost:5000](http://localhost:5000).

## Dev

To start two file-watching development servers:

```bash
yarn
yarn dev
```

The *modern* one will be available on
[http://localhost:1234](http://localhost:1234).

The *legacy* one will be available on
[http://localhost:1234](http://localhost:1235).

