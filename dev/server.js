const express = require('express');

const port = 3000;
const app = express();

app.use(express.static('app'));
app.listen(port, () => console.log(`App listening on port ${port}.`));
