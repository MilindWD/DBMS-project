const express = require('express');
const userRouter = require('./routers/user');
require('./db/mongoose');


const app = express();
app.use(express.json());
app.use(userRouter);

app.listen(process.env.PORT, () => {
    console.log('server started on: http://localhost:'+process.env.port);
});