// crud operations for api/messages

// message queue

const PORT = 8080;
const NODE_ENV = process.env.NODE_ENV || "DEV";
// logging for dev
if (NODE_ENV === "DEV") {
  app.use((req, res, next) => {
    console.log(`[DEV] ${req.method} ${req.originalUrl}`);
    next();
  });
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`);
  });
}
