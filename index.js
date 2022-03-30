const express = require("express");
const cors = require("cors");

const app = express();
const port = 3306;

app.use(cors());
app.get("/users", function (req, res) {
res.send("This resource access is open!");
});
// start server
app.listen(port, function () {
console.log(`app running on localhost:${port}`);
});

const basicAuth = require("basic-auth");
// function auth 
app.get("/secured", auth, function (req, res) {
res.send("This resource access is authenticated!");
});

function auth (req, res, next) {
    var user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.sendStatus(401);
    return;
    }
    if (user.name === "basicUser" && user.pass === "basicPassword") {
    next();
    } else {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.sendStatus(401);
    return;
    }
};

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
//const swaggerDefinition = 




const swaggerDefinition = {
    openapi: "3.0.0", 
    info: {
        title: "BasicAuthentication_01",
        version: "1.0.0",
        description: "Example 01 for Basic Authentication",
        contact: { name: "Your name" },
    },
    servers: [ {url: "http://localhost:" + port,},],
    components: {
        securitySchemes: {
            basicAuth: { type: "http", scheme: "basic", },
        },
    },
    security: [{ basicAuth: [] }],
};

const options = {
    swaggerDefinition, apis: ["./docs/**/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
