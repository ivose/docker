const mongoose = require('mongoose');
const postRoutes = require('./routes/postRouts');
const userRoutes = require('./routes/userRoutes');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');
const session = require('express-session');
const cors = require('cors');
const redis = require('redis');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})

require('dotenv').config();

const express = require('express');
const app = express();
app.enable("trust proxy");
app.use(cors());
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        //maxAge: 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60
    }
}));
app.use(express.json());
//app.use(express.urlencoded({ extended: true }))

const connectWithRetry = () => {
    //"mongodb://sanjeev:mypassword@mongo:27017/?authSource=admin"
    //"mongodb://sanjeev:mypassword@172.21.0.2:27017/?authSource=admin"
    //docker logs docker_node-app_1 -f
    const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useFindAndModify: false // ei tööta, errorid https://stackoverflow.com/questions/68958221/mongoparseerror-options-usecreateindex-usefindandmodify-are-not-supported
    })
        .then(() => console.log("Connected succesfully"))
        .catch(e => {
            console.log(e);
            setTimeout(connectWithRetry, 5000);
        });
    //või then(..).catch(..) asemel 3. argumendiks err => {
    //    if (err) throw err;
    //    console.log('Connected to MongoDB!!!')
    //}
}
connectWithRetry();


app.get('/api/v1', (req, res) => {
    //res.json({ name: 'API', 'msg': 'Hello World' });
    res.send('<h1>Terekest!</h1>');
    console.log('It is running..');
})


app.use('/api/v1/posts', postRoutes); // http://localhost:3000/api/v1/posts
app.use('/api/v1/users', userRoutes);
//app.use()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("listening on port " + PORT));
/**
 *
#EXPOSE 3000 k2sureas -p3000:3000
#CMD ["node", "index.js"]
## -d detachhed run container in backround
## docker build -t node-app-image .
## docker run -p 3000:3000 -d --name node-app node-app-image
##### arenduse kiirendamiseks automaatselt failide siit kopeerimine konteinerisse
## docker run -v pathtofolderonlocation:pathtofolderoncontainer -p 3000:3000 -d --name node-app node-app-image
## docker run -v C:\ivo\fullstack\docker\:/app -p 3000:3000 -d --name node-app node-app-image
## docker run -v %cd%:/app -p 3000:3000 -d --name node-app node-app-image ???
## docker run -v ${pwd}:/app -p 3000:3000 -d --name node-app node-app-image
## docker exec -it node-app bash
## docker rm node-app -f
## docker rm node-app -fv ##kustutab koos volumega
## docker logs node-app ## loeb locali node_modules sisu, mitte konteineri oma
## docker run -v ${pwd}:/app -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image
### readonly
## docker run -v ${pwd}:/app:ro -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image
### -e == --env
## docker run -v ${pwd}:/app:ro -v /app/node_modules --env PORT=3000 -p 3000:3000 -d --name node-app node-app-image
## /app# printenv
## peab olema .env fail
## docker run -v ${pwd}:/app:ro -v /app/node_modules --env-file ./.env -p 3000:3000 -d --name node-app node-app-image
## docker volume prune ## kustutab kõik mittevajalikud volumed
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build -V

 *
 */


/*
https://get.docker.com/
https://docs.docker.com/compose/install/

DigitalOceani serveris
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

*/