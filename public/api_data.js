define({ "api": [
  {
    "type": "post",
    "url": "/api/authentication",
    "title": "Authentication",
    "permission": [
      {
        "name": "none",
        "title": "Default token",
        "description": "<p>Just use default <code>token</code>.</p>"
      }
    ],
    "group": "Public",
    "description": "<p>This is a start point for ther restful API.</p> <p>To use any application service, a token must be passed in the request header.</p> <p>In case of a public service, the user must use the default <code>token</code>, otherwise he should obtain a token by logging in to the following service, <code>/api/authentication</code>.</p> <p>The default token defined so far is defaulttoken, and the session <code>token</code> obtained upon login expires in 30 minutes since the last time the user used an API service.</p> <p>Para usar qualquer serviço da aplicação, deve ser passado um token no header da requisição.</p> <p>Em caso de um serviço público, o usuário deverá utilizar o <code>token</code> padrão, do contrário ele deverá obter um token efetuando o login utilizando para o seguinte serviço, <code>/api/authentication</code>.</p> <p>O token padrão definido até o momento é defaulttoken, e o <code>token</code> de sessão obtido ao efetuar o login expira em 30 min desde a ultima vez que o usuário utilizou um serviço da API.</p> <p>You can use this script in mongod shell to add a user:</p> <pre><code>  var user = { <br>      login: 'user',<br>      name: 'User Name',<br>      password: '12345678',<br>      status: true,<br>      createAt: new Date(),<br>      dateLastAccess: new Date(),<br>      type: 'ADMIN',<br>      token: 't'<br> } </pre></code> <pre><code>   db.users.save(user);  </pre></code> <p>To generate this documentation I used <a href='http://apidocjs.com/'>APIDOC</a>, and these lines code in the project path:</p> <pre><code>   <b style=\"color: #65B042;\">/node-blank-project$</b> apidoc -i app/ -o public/  </pre></code> <br> <h3>Codes and messages returned by the API:<h3>         <table>             <tr><th>code</th>  <th>message</th></tr>             <tr><td>000</td>   <td>Success</td></tr>             <tr><td>001</td>   <td>User not found</td></tr>             <tr><td>002</td>   <td>Wrong password</td></tr>             <tr><td>003</td>   <td>Invalid token</td></tr>             <tr><td>004</td>   <td>User without authorization for this service</td></tr>             <tr><td>005</td>   <td>Expired token</td></tr>         </table> <br>",
    "parameter": {
      "examples": [
        {
          "title": "Requisition:",
          "content": "HTTP/1.1 200 OK\n{\n    \"login\": \"user\",\n    \"password\": \"12345678\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"code\": \"000\",\n    \"message\": \"Success\",\n    \"name\": \"USER NAME\",\n    \"type\": \"ADMIN\",\n    \"token\": \"HASH TOKEN\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/api/auth.js",
    "groupTitle": "Public",
    "name": "PostApiAuthentication"
  }
] });
