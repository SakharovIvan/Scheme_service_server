FROM node:latest

WORKDIR . .
RUN locale-gen en_US.UTF-8
RUN update-locale LANG=en_US.UTF-8 LC_MESSAGES=POSIX
COPY . .
RUN npm install

ENV PORT=3003
ENV APP_URL=http://77.105.172.224:3003

EXPOSE 3003
CMD ["npm","start"]
