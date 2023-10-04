FROM node

LABEL name="my-docker"

WORKDIR /docker-test

COPY . /docker-test

RUN npm install

EXPOSE 5000

CMD ["node", "bin/server"]