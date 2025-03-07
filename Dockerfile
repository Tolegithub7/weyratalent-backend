FROM node:22-alpine3.19 AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm uninstall bcrypt
RUN npm install bcrypt
RUN npm run build

FROM node:22-alpine3.19 AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
RUN npm install bcrypt
RUN npm run build
COPY --from=development /usr/src/app/dist ./dist
COPY ./nginx/nginx.conf ./nginx.conf
COPY ./migrations /usr/migrations
CMD [ "node", "dist/server.js" ]
