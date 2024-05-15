FROM node:22
ENV NODE_ENV development
WORKDIR /express-docker
COPY . .
CMD apk add yarn
RUN yarn
CMD [ "yarn", "start" ]
EXPOSE 3000
