const express = require('express');
const userRouter = require('./routers/user');
const donorRouter = require('./routers/donor');
require('./db/mongoose');


const app = express();
app.use(express.json());
app.use(userRouter);
app.use(donorRouter);


app.listen(process.env.PORT, () => {
    console.log('server started on: http://localhost:'+process.env.port);
});