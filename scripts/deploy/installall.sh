#!/bin/bash

# ------------------------------------------------------------------------------
# Install All EE3
# ------------------------------------------------------------------------------
# Script para instalar os serviços do EE3
# ------------------------------------------------------------------------------

# Arquivo de configuracao
source config.sh
source services.sh

# Funcao principal
installAll() {
    
    echo ""
    echo "------------------------------------------------------------"
    echo "Iniciando serviços"
    echo "------------------------------------------------------------"
    echo ""

    cd $CONFIG_PROJECT_FOLDER

	
    echo "- Instalando forever"
    npm install -g forever
    echo ""

    for SERVICE in ${SERVICES_NAMES[@]}
    do
        cd $SERVICE
        echo "- Instalando $SERVICE"
        echo "-- instalando pacotes"
        npm install
        echo "-- criando config.js"
        if [ ! -f config.js ];
        then
        	cp config.js.default config.js
        	echo "--- ok"
        else 
        	echo "--- config.js já existe"
        fi
        echo ""
        cd ..
    done
}

# Chamada da funcao
installAll

