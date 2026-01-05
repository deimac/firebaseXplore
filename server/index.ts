/**
 * Server entrypoint for Firebase App Hosting.
 * This file imports the configured Express app and ENV variables from the '_core' directory
 * and starts the server.
 */
import { app } from './_core/index.js';
import { ENV } from './_core/env.js';

// Use the port from the central ENV configuration
const port = ENV.port || 8080;

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
