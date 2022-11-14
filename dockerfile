FROM node:16-alpine

WORKDIR /src

COPY package.json /src
COPY tsconfig.build.json /src
COPY tsconfig.json /src

RUN npm install
RUN npm install pm2 -g

COPY dist/ /src/dist/

EXPOSE 8080
EXPOSE 80

CMD ["pm2-runtime", "dist/main.js"]