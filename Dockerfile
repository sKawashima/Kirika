FROM node:12.16.1-buster
ADD package.json /
RUN npm i

ADD src/ src/
EXPOSE 80
CMD PORT=80 npm start
