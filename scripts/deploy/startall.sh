#!/bin/bash

# ------------------------------------------------------------------------------
# Start All EE3
# ------------------------------------------------------------------------------
# Script iniciar todos os serviços do EE3
# ------------------------------------------------------------------------------

# Arquivo de configuracao
source config.sh
source services.sh

# Funcao principal
startAll() {
    
    echo ""
    echo "------------------------------------------------------------"
    echo "Iniciando serviços"
    echo "------------------------------------------------------------"
    echo ""

    cd $CONFIG_PROJECT_FOLDER

    for SERVICE in ${SERVICES_NAMES[@]}
    do
        cd $SERVICE
        echo "- Iniciando $SERVICE"
        forever start ${SERVICE,,}.js &
        cd ..
    done
}

# Chamada da funcao
startAll

