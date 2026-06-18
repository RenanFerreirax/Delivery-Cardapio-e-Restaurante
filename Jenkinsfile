pipeline {
    agent any

    stages {

        stage('Fetch Secrets') {
            steps {
                sh 'npx -y @infisical/cli export --env="prod" --path="/" --token="st.st.df83fe53-4aa8-459c-a902-e318c8be7cef.a730694c013a57640ea2417f82693f24.8be2b43fe241881935e18aa1fbbe9f40" > .env'
            }
        }

        stage('Instalar Dependências') {
            steps {
                sh '''
                    rm -rf node_modules
                    npm install
                    npx prisma generate
                '''
            }
        }

        stage('Build Docker') {
            steps {
                sh 'docker compose build --no-cache'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker compose down
                    docker compose up -d
                '''
            }
        }

        stage('Verificar Containers') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Deploy do Restaurante/Cardápio realizado com sucesso!'
        }
        failure {
            echo 'Houve um erro durante o deploy do Restaurante/Cardápio.'
        }
        always {
            sh 'docker image prune -f || true'
        }
    }
}
