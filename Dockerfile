FROM node:latest

WORKDIR . .
COPY . .
RUN npm install

EXPOSE ${PORT}
CMD ["npm","start"]
