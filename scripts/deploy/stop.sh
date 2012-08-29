#!/bin/bash

# ------------------------------------------------------------------------------
# Stop All EE3
# ------------------------------------------------------------------------------
# Script parar todos os serviços do EE3
# ------------------------------------------------------------------------------

# Arquivo de configuracao
source config.sh
source services.sh

# Funcao principal
stopAll() {
    
    echo ""
    echo "------------------------------------------------------------"
    echo "Parando serviços"
    echo "------------------------------------------------------------"
    echo ""

    cd $CONFIG_PROJECT_FOLDER

    for SERVICE in ${SERVICES_NAMES[@]}
    do
        cd $SERVICE
        echo "- Parando $SERVICE"
        forever stop ${SERVICE,,}.js
        echo
        cd ..
    done
}

# Chamada da funcao
stopAll 

