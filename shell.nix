with import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/24.05.tar.gz") { };

stdenv.mkDerivation {
  name = "decaf-client-javascript-extras";

  buildInputs = with pkgs; [
    nodejs_18
  ];

  NODE_OPTIONS = "--max-old-space-size=4096";
}
