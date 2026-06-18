pipeline {
    agent any

    environment {
        IMAGE_NAME = "delivery-restaurante-cardapio"
        CONTAINER_NAME = "delivery-restaurante-cardapio"
        APP_PORT = "9521"

        // Infisical
        INFISICAL_CLIENT_ID = "3183000a-2235-4e3a-84e8-ba3a76199375"
        INFISICAL_CLIENT_SECRET = "f1611fd23ab5c4b1c0ed53c4ba723a379592b36a1bdd3e5e12ef7062d6525d17"
        INFISICAL_PROJECT_ID = "75293cd1-53c5-4a7c-860e-c515f97de341"
        INFISICAL_ENV = "prod"
        INFISICAL_SECRET_PATH = "/pasta"
    }

    stages {
        stage('Clean Up') {
            steps {
                script {
                    echo '🧹 Limpando containers e imagens antigas...'
                    sh '''#!/bin/bash
                        set +e
                        docker stop ${CONTAINER_NAME} 2>/dev/null
                        docker rm ${CONTAINER_NAME} 2>/dev/null
                        docker rmi ${IMAGE_NAME}:latest 2>/dev/null
                        set -e
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Instalando dependências...'
                sh '''#!/bin/bash
                    npm install
                    npm install --no-save @infisical/cli
                '''
            }
        }

        stage('Generate Prisma Client with Infisical') {
            steps {
                echo '🔐 Gerando cliente Prisma com variáveis do Infisical...'
                sh '''#!/bin/bash
                    set +x
                    
                    # Fazer login no Infisical
                    export INFISICAL_TOKEN=$(./node_modules/.bin/infisical login \
                        --method=universal-auth \
                        --client-id="$INFISICAL_CLIENT_ID" \
                        --client-secret="$INFISICAL_CLIENT_SECRET" \
                        --silent \
                        --plain)
                    
                    if [ -z "$INFISICAL_TOKEN" ]; then
                        echo "❌ Falha ao fazer login no Infisical"
                        exit 1
                    fi
                    
                    # Gerar Prisma Client
                    ./node_modules/.bin/infisical run \
                        --projectId="$INFISICAL_PROJECT_ID" \
                        --env="$INFISICAL_ENV" \
                        -- npx prisma generate
                    
                    set -x
                    echo "✅ Prisma Client gerado com sucesso"
                '''
            }
        }

        stage('Docker Build') {
            steps {
                echo '🐳 Construindo imagem Docker..'
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Docker Run with Infisical Env') {
            steps {
                echo '🚀 Iniciando container com variáveis do Infisical...'
                sh '''#!/bin/bash
                    set +x
                    
                    # Fazer login no Infisical
                    export INFISICAL_TOKEN=$(./node_modules/.bin/infisical login \
                        --method=universal-auth \
                        --client-id="$INFISICAL_CLIENT_ID" \
                        --client-secret="$INFISICAL_CLIENT_SECRET" \
                        --silent \
                        --plain)
                    
                    if [ -z "$INFISICAL_TOKEN" ]; then
                        echo "❌ Falha ao fazer login no Infisical"
                        exit 1
                    fi
                    
                    # Exportar variáveis do Infisical para arquivo .env
                    ./node_modules/.bin/infisical export \
                        --projectId="$INFISICAL_PROJECT_ID" \
                        --env="$INFISICAL_ENV" \
                        --format=dotenv > /tmp/.env
                    
                    set -x
                    
                    # Iniciar container com as variáveis
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --env-file /tmp/.env \
                        -p ${APP_PORT}:${APP_PORT} \
                        ${IMAGE_NAME}:latest
                    
                    # Aguardar container ficar pronto
                    sleep 5
                    
                    # Verificar se container está rodando
                    if docker ps | grep -q ${CONTAINER_NAME}; then
                        echo "✅ Container iniciado com sucesso"
                        docker logs ${CONTAINER_NAME} | head -20
                    else
                        echo "❌ Falha ao iniciar container"
                        docker logs ${CONTAINER_NAME}
                        exit 1
                    fi
                    
                    # Limpar arquivo temporário
                    rm -f /tmp/.env
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline executado com sucesso! O serviço está rodando.'
        }
        failure {
            echo '❌ Erro no pipeline.'
            sh '''#!/bin/bash
                echo "--- Logs do Container ---"
                docker logs ${CONTAINER_NAME} 2>/dev/null || echo "Container não encontrado"
                echo "--- Containers Rodando ---"
                docker ps
                echo "--- Imagens Disponíveis ---"
                docker images | grep ${IMAGE_NAME}
            '''
        }
        always {
            sh 'rm -f /tmp/.env'
        }
    }
}
