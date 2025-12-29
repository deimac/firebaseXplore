{ pkgs, ... }: {
  channel = "unstable";

  # A version of Node.js is updated to ensure compatibility with Vite.
  packages = [
    pkgs.nodejs_22
    pkgs.firebase-tools
  ];

  idx.extensions = [
    "dbaeumer.vscode-eslint"
    "esbenp.prettier-vscode"
  ];

  idx.workspace = {
    onCreate = {
      npm-install = "npm install";
    };
    onStart = {
      # This command initializes both the backend and frontend servers
      # in parallel, using the configuration defined in package.json.
      dev = "npm run dev";
    };
  };

  idx.previews = {
    enable = true;
    previews = {
      # The web preview needs to run both the backend and the frontend.
      # The "dev" script does this using 'concurrently'.
      # The frontend (Vite) will automatically listen on the port defined by the $PORT environment variable.
      web = {
        command = ["npm" "run" "dev"];
        manager = "web";
      };
    };
  };
}
