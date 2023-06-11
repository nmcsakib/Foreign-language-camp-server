const express = require('express');
const app = express();
const cors = require('cors');


const instructorRouter = require('./routers/Instructors');
const classesRouter = require('./routers/classes');
const selectedClassRouter = require('./routers/selectedClasses');
const jwtRouter = require('./routers/jwt');
const paymentRouter = require('./routers/payments');
const userRouter = require('./routers/users');



const port = process.env.PORT || 5000;

// Middleware
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json());
app.use('/jwt', jwtRouter)
app.use('/users', userRouter)
app.use('/instructors', instructorRouter)
app.use('/classes', classesRouter)
app.use('/selected-classes', selectedClassRouter)
app.use('/payments', paymentRouter)

app.get('/', (req, res) => {
  res.send('App is listening..')
})

app.listen(port, () => {
  console.log(`Foreign language camp is listening ${port}`);
})


