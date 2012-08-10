#!/bin/bash

# ------------------------------------------------------------------------------
# Deploy EE3
# ------------------------------------------------------------------------------
# Script para atualizar o ambiente de producao em nodejs quando houver
# alteracoes no codigo dos serviços.
#
# Exemplos de crontab:
#
#     A cada 10 minutos
#     */10 * * * * cd /path/to/deploy/folder/; bash deploy.sh;
# ------------------------------------------------------------------------------

# Arquivo de configuracao
source config.sh
source services.sh

# Funcao principal
deploy() {
    
    echo ""
    echo "------------------------------------------------------------"
    echo "Iniciando deploy"
    echo "------------------------------------------------------------"
    echo ""

    cd $CONFIG_PROJECT_FOLDER
    echo "- Puxando alteracoes..."
    git fetch

    echo ""
    echo "- Verificando alteracoes..."
    GIT_UPDATES_TOTAL=$(git diff $CONFIG_GIT_REPOSITORY/$CONFIG_GIT_BRANCH | grep -c a/) 
    echo "-- $GIT_UPDATES_TOTAL atualizacoes encontradas."

    echo ""
    echo "- Calculando atualizacoes por servico..."
    GIT_SERVICES_UPDATES=()

    COUNT=0
    GIT_SERVICES_UPDATES_NUMBER=0
    for SERVICE in ${SERVICES_NAMES[@]}
    do
        GIT_SERVICES_UPDATES[$COUNT]=$(git diff $CONFIG_GIT_REPOSITORY/$CONFIG_GIT_BRANCH | grep -c a/$SERVICE)
        if [ ${GIT_SERVICES_UPDATES[$COUNT]} != 0 ]
        then 
            echo "-- ${GIT_SERVICES_UPDATES[$COUNT]} atualizacoes do $SERVICE"
            (( GIT_SERVICES_UPDATES_NUMBER++ ))
        else
            echo "-- Nenhuma atualizacao para $SERVICE"
        fi

        (( COUNT++ ))
    done

    echo ""
    echo "------------------------------------------------------------"
    echo "Reiniciando servicos"
    echo "------------------------------------------------------------"
    echo ""

    if [ $GIT_UPDATES_TOTAL != 0 ] 
    then
        echo "- Atualizando codigo..."
        git pull
        echo "-- atualizado!"

        echo ""
        if [ $GIT_SERVICES_UPDATES_NUMBER != 0 ]
        then
            echo "- $GIT_SERVICES_UPDATES_NUMBER servicos para atualizar"
            COUNT=0
            for SERVICE in ${SERVICES_NAMES[@]}
            do
                if [ ${GIT_SERVICES_UPDATES[$COUNT]} != 0 ]
                then
                    echo ""
                    cd $SERVICE
                    echo "- Reiniciando $SERVICE"
                    echo "-- parando ${SERVICE,,}.js"
                    forever stop ${SERVICE,,}.js
                    echo "--- ok"
                    echo "-- atualizando modulos usados em ${SERVICE,,}.js"
                    npm install
                    echo "--- ok"
                    echo "-- iniciando ${SERVICE,,}.js"
                    forever start ${SERVICE,,}.js
                    echo "--- ok"
                    cd ..
                fi
            done
        else
            echo "- Nenhum servico para atualizar"
        fi
    else
        echo "- Nenhuma alteracao para atualizar"
    fi
    
    echo ""
    echo "------------------------------------------------------------"
    echo "Deploy finalizado"
    echo "------------------------------------------------------------"
    echo ""
}

# Chamada da funcao
deploy

