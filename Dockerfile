FROM docker.io/library/node:16 as builder
WORKDIR /app

# Cache dependencies
COPY package.json yarn.lock ./
RUN yarn install --ignore-scripts

# Copy all files, except Dockerfile, README.md
COPY .*config  ./
COPY .*ignore  ./
COPY .*rc  ./

COPY webpack ./webpack
COPY public ./public
COPY generate-config ./generate-config
COPY test ./test
COPY src ./src

# Re-run with any scripts enabled
RUN yarn install

# Test
RUN yarn test

# Build for production
RUN yarn build

#######################################################################################################################
FROM docker.io/library/node:16 as runtime

WORKDIR /app

## Use tini for init process. Forwards and uses signals correctly, supporting graceful shutdown.
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /
RUN chmod +rx /tini
ENTRYPOINT ["/tini", "--"]

# Runtime dependencies
RUN npm install -g \
  @hugojosefson/merge-html \
  sponge \
  serve

COPY generate-config /generate-config/
RUN cd /generate-config && yarn install

# Get all the production files from the build
COPY --from=builder /app/target/production/* /app/
COPY --from=builder /app/target/index-without-config.html /

# When starting, include config from env in index.html
CMD bash -xc 'merge-html <(/generate-config/generate-config-html.mjs) /index-without-config.html | sponge /app/index.html \
 && serve --no-clipboard --listen "tcp://0.0.0.0:${PORT}"'
