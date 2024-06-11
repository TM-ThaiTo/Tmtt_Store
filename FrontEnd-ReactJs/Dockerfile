FROM node:14 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm rebuild node-sass
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]