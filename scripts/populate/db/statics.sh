#!/bin/bash

# ------------------------------------------------------------------------------
# Populate EE3
# ------------------------------------------------------------------------------
# Script para popular o banco de dados
# ------------------------------------------------------------------------------


# Funcao principal
populate() {

    echo ""
    echo "------------------------------------------------------------"
    echo "Populando Banco de Dados"
    echo "------------------------------------------------------------"
    echo ""

    cd statics

    echo
    echo "- location"

    echo "-- regions"
    mongoimport -d location -c regions --file location/regions.json

    echo "-- countries"
    mongoimport -d countries -c countries --file location/countries.json

    echo "-- states"
    mongoimport -d location -c states --file location/states.json

    echo "-- cities"
    mongoimport -d location -c cities --file location/cities.json

}

# Chamada da funcao
populate

