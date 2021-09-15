FROM node:15
WORKDIR /app
COPY package.json .
#RUN npm install

#composes NODE_ENV: development
ARG NODE_ENV
# [, ] ja = ymbritsetud tyhikutega
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi

COPY . ./
ENV PORT 3000
EXPOSE ${PORT}
CMD ["node", "index.js"]
#CMD ["npm", "run", "dev"]




