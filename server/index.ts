/**
 * Entrypoint for Firebase Functions.
 *
 * This file imports the configured Express app from the '_core' directory
 * and exports it as a Firebase Cloud Function named 'api'.
 * All application logic and server configuration is contained within the _core directory.
 */
import { api } from './_core/index.js';

export { api };
