<h2 align="center">
Proffy - Plataforma de estudos online
<br/>

</h2>

<blockquote align="center">
  Projeto realizado durante a Next Level Week #02 da Rocketseat
</blockquote>

<hr/>

## :ballot_box_with_check: Objetivos:

Eu desenvolvi esse projeto durante a Next Level Week #02 da Rocketseat, com o intuito de reforçar meus conhecimentos na stack React, React Native e NodeJS.

## :book: Sobre:

A parte do back-end é responsável por fazer toda a regra de negócio da aplicação, ou seja, ela faz com que as funcionalidades presentes no front-web aconteçam, fornecendo e gravando os dados no banco. Atualmente é divida em dois controllers que são responsáveis por manipular os dados das conexões e das aulas. 

Nas conexões, temos uma rota que salva uma conexão no banco de dados (toda vez que o usuário entra em contato com o professor pelo whatsapp) e outra que traz o número total de conexões já realizadas na aplicação.

Já nas aulas, temos uma rota de criação quando o professor envia o formulário no front-end com todas as informações necessárias e outra rota que traz todos os professores com suas aulas através de um filtro fornecido com as informações de matéria, dia da semana e horário.

## 🎓 Aplicação de conhecimentos:

- Reforço de conhecimentos sobre o NodeJS
- Uso do TypeScript
- Criação de api seguindo as melhores práticas
- Utilização do banco SQLite3
- Uso do Knex.js para manipulação do banco de dados


## 🚀 Tecnologias:

- NodeJS
- TypeScript

## 🖥️ Como executar:

Clone o repositório com:

```bash
git clone https://github.com/guihRovetta/proffy-server.git
```

Para baixar as dependências e instalar, utilize o comando na raiz do projeto:

```bash
yarn
```

Execute o comado para realizar a migrate no banco:
```bash
yarn knex:migrate
```

Execute o comado para dar o rollback no banco:
```bash
yarn knex:migrate:rollback
```

Para rodar o projeto, execute:

```bash
yarn start
```

Vale a pena notar também que nessa aplicação está sendo utilizada a porta <strong>3333</strong> do <strong>locahost</strong>.

## :new: Novas funcionalidades:

- [ ] Autenticação de usuários
- [ ] Recuperação de senhas
- [ ] Exibição e edição de perfil do professor
- [ ] Paginação na listagem de professores
- [ ] Salvar professores favoritos
- [ ] Deploy da aplicação

---

<h3 align="center">
Autor: <a alt="Guilherme Rovetta" href="https://github.com/guihRovetta">Guilherme Rovetta</a>
</h3>

<p align="center">

  <a alt="Guilherme de Almeida Rovetta Linkedin" href="https://www.linkedin.com/in/guilherme-rovetta-381a89b0">
  <img src="https://img.shields.io/badge/LinkedIn-Guilherme%20Rovetta-blue?logo=linkedin"/></a>
  <a alt="Guilherme de Almeida Rovetta GitHub" href="https://github.com/guihRovetta">
  <img src="https://img.shields.io/badge/GitHub-guihRovetta-lightgrey?logo=github"/></a>

</p>