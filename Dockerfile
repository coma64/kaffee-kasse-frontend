FROM node:current-slim AS builder

WORKDIR /app
COPY . .

RUN npm install
ENV PATH /app/node_modules/.bin:$PATH
RUN ng build

FROM nginx:1.21.0

WORKDIR /app
COPY --from=builder /app/dist/kaffee-kasse-frontend /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
