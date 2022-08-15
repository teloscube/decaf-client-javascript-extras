with import (fetchTarball https://github.com/NixOS/nixpkgs/archive/22.05.tar.gz) { };

stdenv.mkDerivation {
  name = "decaf-client-javascript-extras";

  buildInputs = with pkgs; [
    git
    nodejs-16_x
    yarn

    figlet
    lolcat
  ];

  shellHook = ''
    ## Greet:
    figlet -w 999 -f standard "DECAF CLIENT EXTRAS DEV SHELL" | lolcat -S 179
  '';

  DECAF_JS_SKIP_POSTINSTALL = "TRUE";
}
