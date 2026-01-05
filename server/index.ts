/**
 * Server entrypoint for Firebase App Hosting.
 * This file imports the configured Express app from the '_core' directory
 * and starts the server.
 */
import { app } from './_core/index.js';

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
