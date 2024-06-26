# flake.nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
    foundry.url = "github:shazow/foundry.nix";
  };

  outputs = { self, nixpkgs, utils, foundry }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ foundry.overlay ];
        };
      in {

        devShell = with pkgs; mkShell {
          buildInputs = [
            # From the foundry overlay
            # Note: Can also be referenced without overlaying as: foundry.defaultPackage.${system}
            foundry-bin

            # ... any other dependencies we need
            solc-select
            deno
            nodejs-slim_20
            nodePackages_latest.npm
          ];

          # Decorative prompt override so we know when we're in a dev shell
          #shellHook = ''
          #  export PS1="[dev]$PS1"
          #'';
        };
      });
}