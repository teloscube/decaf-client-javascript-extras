{ ... }:

let
  ## Set the name:
  name = "decaf-client-javascript-extras";

  ## Repository root:
  root = ../.;

  ## Import sources:
  sources = import ./sources.nix;

  ## Import telosnix:
  telosnix = import sources.telosnix { };

  ## Import nixpkgs:
  pkgs = import telosnix.pkgs-sources.stable { };

  ## Get the devshell:
  devshell = telosnix.tools.devshell {
    name = "${name}-devshell";
    src = ./.;
    quickstart = ../README.md;
    guide = [
      { name = "readme"; title = "Introduction"; path = ../README.md; }
    ];
    extensions = { };
  };

  ## Declare dependencies for our shell:
  deps = [
    pkgs.git
    pkgs.nodejs
    pkgs.yarn

    devshell
  ];

  ## Define our shell:
  shell = pkgs.mkShell {
    buildInputs = deps;

    shellHook = ''
      ## Greet:
      devsh welcome
    '';

    DEVSHELL_ROOT = "${toString root}";
    DECAF_JS_SKIP_POSTINSTALL = "1";
  };

in
{
  name = name;
  pkgs = pkgs;
  sources = sources;
  telosnix = telosnix;
  shell = shell;
}
