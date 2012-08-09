#!/bin/bash

# ------------------------------------------------------------------------------
# Restart EE3
# ------------------------------------------------------------------------------
# Script reiniciar um serviço do ee3
# exemplo de uso:
#     $ bash restart.sh Companies
# ------------------------------------------------------------------------------

# Arquivo de configuracao
source config.sh
source services.sh

# Funcao principal
restart() {
    
    SERVICE=$1
    
    echo ""
    echo "------------------------------------------------------------"
    echo "Reiniciando serviço $SERVICE"
    echo "------------------------------------------------------------"
    echo ""

    cd $CONFIG_PROJECT_FOLDER

    cd $SERVICE
    echo "- Reiniciando $SERVICE"
    forever stop ${SERVICE,,}.js
    forever start ${SERVICE,,}.js
}

# Chamada da funcao
restart $1

