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
        npm update
        echo "-- criando config.js"
        if [ ! -f config.js ];
        then
            cp config.js.default config.js
            echo "--- ok"
        else
            echo "--- config.js já existe"
            CONFIGJS_MODDATE=$(stat -c %Y config.js)
            CONFIGJSDEFAULT_MODDATE=$(stat -c %Y config.js.default)
            if [ ${CONFIGJSDEFAULT_MODDATE} -gt ${CONFIGJS_MODDATE} ]
            then
                echo "----- config.js.default está mais atual"
            fi
        fi

        echo ""
        cd ..
    done
}

# Chamada da funcao
installAll

