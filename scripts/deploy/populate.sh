#!/bin/bash

# ------------------------------------------------------------------------------
# Populate EE3
# ------------------------------------------------------------------------------
# Script para popular o banco de dados
# ------------------------------------------------------------------------------

# Arquivo de configuracao
source config.sh

# Funcao principal
populate() {

    echo ""
    echo "------------------------------------------------------------"
    echo "Populando Banco de Dados"
    echo "------------------------------------------------------------"
    echo ""

    cd ../populate/db

    echo "- location.regions"
    mongoimport -d location -c regions --file regions.json
    echo

    echo "- location.countries"
    mongoimport -d countries -c countries --file countries.json
    echo

    echo "- location.states"
    mongoimport -d location -c states --file states.json
    echo

    echo "- location.cities"
    mongoimport -d location -c cities --file cities.json

}

# Chamada da funcao
populate

