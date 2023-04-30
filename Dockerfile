FROM node:lts-alpine as base
# set for base and all layer that inherit from it

RUN mkdir /app

WORKDIR /app

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app

ADD package.json yarn.lock ./
ADD . .
RUN yarn install --ignore-engines

# Finally, build the production image with minimal footprint
FROM base as builder

WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN SESSION_SECRET=temporary yarn build

# Finally, build the production image with minimal footprint
FROM base as runner

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.keystone /app/.keystone
ADD . .

ARG PORT=80
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD yarn start
