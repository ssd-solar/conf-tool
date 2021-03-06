{ config, lib, pkgs, ... }:

# This is the nixOS configuration for your system
# It's managed with conf-tool, but you can play arround in ./user.nix
# You can also synchronise this configuration by tracking it in git, for example

# For more details about the options see: https://nixos.org/nixos/manual.html and https://nixos.org/nixos/options.html
# The conf-tool documentation can be found at https://os.ssd-solar.dev/docs/conf-tool

with lib;

{
  imports = [
    <solaros/config> # managed by the solaros team, applies branding
    ./hardware-configuration.nix # managed by nixOS, contains the configuration for your hardware
    ./boot.nix # created by the installer, contains the boot configuration
    ./conf-tool # managed by conf-tool, contains your settings
    ./user.nix # managed by YOU alone :)
  ];
}
