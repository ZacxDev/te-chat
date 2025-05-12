{
  description = "A development shell including go-static-site";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      go-static-site = pkgs.buildGoModule rec {
        pname = "go-static-site";
        version = "0.11.0";

        src = pkgs.fetchFromGitHub {
          owner = "ZacxDev";
          repo = pname;
          rev = "v${version}";
          sha256 = "sha256-L/PUy0D7qjfTSLZHWoBSoqm6lqOfIMNiNZFDANM9A6c=";
        };

        vendorHash = null;
      };
    in {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          go-static-site
        ];
      };
    };
}
