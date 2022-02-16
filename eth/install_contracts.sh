#!/bin/bash

dir="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"

cp "${dir}"/solidity/build/contracts/PoktWorkshop.json "${dir}"/react/src/contracts/
cp "${dir}"/solidity/build/contracts/PoktWorkshop.json "${dir}"/python/contracts/
