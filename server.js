const express = require('express');

const app = express();

app.use(express.json());
app.use('/api/', require('./routes'));

const PORT = process.env.PORT || 13000;

app.listen(PORT, ()=> console.log(`Server started on localhost:${PORT}`));