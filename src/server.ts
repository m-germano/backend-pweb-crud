import app from './app'

const port = process.env.PORT ? Number(process.env.PORT) : 3333;

app.listen(port, '0.0.0.0', () => {
  console.log(`API on http://0.0.0.0:${port}`);
});