# 💻 API Intranet

---

### 📝 Descrição do Projeto

Esta API é o _backend_ da aplicação de uma Intranet. Ela é responsável por gerenciar os dados de usuários, departamentos, notícias internas e outros recursos essenciais, fornecendo os _endpoints_ necessários para o _frontend_ e outras integrações internas. A parte do projeto referente ao frontend você encontra em [Repositório APP Intranet](https://github.com/VicenteAlef/APP-Intranet).
Obs: Ainda em desenvolvimento. Algunas funcionalidades podem ainda não terem sido implementadas.

**Principais Funcionalidades:**

- Gerenciamento de **Usuários** (CRUD).
- Autenticação e Autorização (JWT/OAuth).
- Publicação e consulta de **Notícias** internas.
- Consulta de **Departamentos** e informações de contato.

---

### 🚀 Começando

Estas instruções guiarão você na obtenção de uma cópia do projeto em execução na sua máquina local para fins de desenvolvimento e teste.

#### 📋 Pré-requisitos

Você precisará ter instalado na sua máquina:

- **Node.js**
- **NPM**
- **MySQL Server**
- **Docker e Docker Compose** (Opcional, mas recomendado para o ambiente)

#### ⚙️ Instalação e Execução

Siga os passos abaixo para configurar o ambiente:

1.  **Clone o Repositório:**

    ```bash
    git clone https://github.com/VicenteAlef/API-Intranet.git
    cd API-Intranet
    ```

2.  **Instale as Dependências:**

    ```bash
    npm install
    ```

3.  **Configuração de Ambiente:**

    - Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`.
    - Preencha as variáveis de ambiente, especialmente as de conexão com o Banco de Dados.

    > **Exemplo (Apenas ilustrativo):**
    >
    > ```
    > DB_HOST=localhost
    > DB_NAME=intranet_db
    > DB_USER=[seu_usuario]
    > DB_PASS=[sua_senha]
    > JWT_SECRET=[sua_chave_secreta]
    > PORT=3000
    > ```

4.  **Inicie a Aplicação:**
    ```bash
    node src/index.js
    ```
    A API estará rodando em `http://localhost:3000`.

---

### 🗺️ Documentação da API (Endpoints)

Abaixo estão alguns dos principais _endpoints_:

| Método | Endpoint           | Descrição                                    | Requer Autenticação |
| :----: | :----------------- | :------------------------------------------- | :-----------------: |
| `POST` | `/api/auth/login`  | Autentica um usuário e retorna um token JWT. |         Não         |
| `GET`  | `/api/users`       | Retorna uma lista de todos os usuários.      |         Sim         |
| `GET`  | `/api/news/{id}`   | Retorna uma notícia específica pelo ID.      |         Não         |
| `POST` | `/api/news`        | Cria uma nova notícia.                       |     Sim (Admin)     |
| `GET`  | `/api/departments` | Lista todos os departamentos.                |         Não         |

---

### 🧪 Usuário Padrão

Por questões de segurança, a aplicação não possui um endpoint de auto cadastro de usuários, sendo necessário cadastrar usuarios internamente como um usuario admin. Por este motivo ao inciar a aplicação é gerado um uruário padrão de email: admin@suaempresa.com.br e senha:admin123. Você pode testar o endpoint de login (http://localhost:3000/api/auth/login - POST) com o json abaixo :

```bash
{
    "email": "admin@suaempresa.com.br",
    "senha": "admin123"
}
```

Após o primeiro acesso com o usuario padrão, deve ser criado um novo usuário admin e inativado o usuario padrão, por segurança.
