{ pkgs, ... }: {
  channel = "unstable";

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
      # Garante que a aplicação esteja sempre compilada ao iniciar.
      build = "npm run build";
    };
  };

  idx.previews = {
    enable = true;
    previews = {
      web = {
        # Executa o servidor já compilado, que serve o cliente.
        # A variável $PORT é injetada automaticamente pelo Studio.
        command = ["npm" "run" "start"];
        manager = "web";
      };
    };
  };
}
