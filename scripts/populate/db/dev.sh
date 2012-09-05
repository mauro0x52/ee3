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

    cd dev

    echo
    echo "- apps"

    echo "-- apps"
    mongoimport -d apps -c apps --file apps/apps.json

    echo "-- versions"
    mongoimport -d apps -c versions --file apps/versions.json

    echo "-- tools"
    mongoimport -d apps -c tools --file apps/tools.json


}

# Chamada da funcao
populate

