# crosslang_samp

[![sampctl](https://img.shields.io/badge/goseventh-crosslang_samp-2f2f2f.svg?style=for-the-badge)](https://github.com/real_davidwilson/crosslang_samp)

#### Sobre
Este repositório foi criado para com que você possa usar 

## Iniciando o projeto

Para o usar o pacote é necessário ter sampctl e nodejs em sua máquina, você precisa instalar as depedências e transpilar o código typescript presente em `js/src`.

Instale as dependências do SA-MP utilizando o comando abaixo:
`sampctl p ensure`

Instale as dependências do javascript:
`yarn install` ou `npm i`

Transpile o código typescript com o tsc:
`yarn build` ou `npm run build`

## Instruções de uso

Este pacote trabalha usando samp_node e pode se comunicar com outras linguagens usando a conexão udp, siga as instruções abaixo e seja feliz programando uma gm com sua linguagem de preferência.

#### `Conectar-se com o node`:

Para se conectar com o node é bem simples, basta você instanciar o pacote que lida com conexão udp em sua linguagem, e então você deve se conectar na porta **3302**, caso queira você pode trocar a porta em [js/src/socket.ts](\js\src\socket.ts).

#### `Trabalhando com callbacks do samp`:

###### Registrar callback

Para registrar callbacks você deve enviar um json para o server udp do node, na abaixo tabela você verá todos os parametros necessários, as informações de cada variável e por fim o exemplo.

|Chave|Tipo|Obrigatório|
|:-----:|:--:|:----------:|
|`type`|string|sim|
|`eventName`|string|sim|
|`defaultReturn`|qualquer|não|

`type` deve ser o nome do tipo de operação que você deseja, nesse caso o valor dessa variável deve ser `"callEvent"`.

`eventName` deve ser o nome do evento que você deseja ouvir, você deve passar o nome de um evento existente para que não haja problemas.

`defaultReturn` nesa variável você deve passar o valor de retorno padrão para a callback, assim o node retornará esse valor para as chamadas do samp.

`json exemplar`:
~~~json
{
    "type": "listenEvent",
    "eventName": "OnPlayerConnect",
    "defaultReturn": 0
}
~~~

###### Respostas de eventos

Ao registrar uma callback o node irá ouvi-la e quando a chamada for feita ele enviará para o seu client udp qual callback foi chamada e os parametros,
quando isso ocorrer você receberá um json como este:
~~~json
{
    "type": "onEvent",
    "eventName": "OnPlayerConnect",
    "params": [0]
}
~~~

`type` nesse caso, serve para você diferenciar qual tipo de resposta está vindo do node.

`eventName` será o nome do evento que você pediu para o node escutar inicialmente.

`params` será um array com todos os parametros da callback.

#### `Chamando funções do samp`

###### Fazendo chamada

Para chamar uma função do samp pelo udp você precisa enviar um json com os parametros especificados abaixo.

|Chave|Tipo|Obrigatório|
|:-----:|:--:|:----------:|
|`type`|string|sim|
|`functionName`|string|sim|
|`awaitReturn`|boolean|não|
|`paramsType`|string|não|
|`params`|array|não|
|`uid`|string <br> number|não|

`type` deve ser o nome do tipo de operação que você deseja, nesse caso o valor dessa variável deve ser `"callFunction"`.

`functionName` deve ser o nome exato da função que você deseja chamar, pois o nome da função é **case sensitive**, você deve passar o nome de uma função existente para que não haja erros.

`awaitReturn` deve ser um booleano **true** ou **false**, caso seja `true` o node chamará a função e lhe devolverá o retorno da função em uma chamada udp, caso você não envie essa variável no json ele será definido como `true` por padrão, para performance você deve deixar `"awaitReturn": false` quando vai usar uma função `set`.

`paramsType` serve para você informar ao node os tipos de cada parametro que será passado para a função, paramsType deve ser no formato string, cada tipo deve ser alinhado com o array `params` e o protótipo dos parametros da função que você queira executar, você poderá ver um json exemplar logo mais abaixo. 

Definições de tipos de parametros.
`i` ou `d` para inteiros e booleanos, `s` para string, `f` para float.
em alguns você terá que passar esses tipos em maiúsculo, isso ocorre quando o parametro que você vai passar recebe um ponteiro de memória da variável que foi passada, ao passar em maiúsculo o samp_node vai ignorar o parametro e passar para o próximo, pois a variável vai retornar os valores ao invés de mudar na memória, mais abaixo isso será esclarecido. 

`params` deve ser um array com os parametros da função, você deve passar os valores na sequência correta e deve ser conforme o `paramsType`.

`params` deve ser um array com os parametros da função, você deve passar os valores na sequência correta e deve ser conforme o `paramsType`.

`uid` não é obrigatório, mas será muito útil para você identificar a de qual chamada é a resposta da função, você pode passar o valor que deseja, sendo string ou número.

json exemplar:
~~~json
{
    "type": "callFunction",
    "name": "GetPlayerName",
    "params": [0, 24],
    "paramsType": "iSi",
    "uid": "321msd22msk1_213sz",
}
~~~

Note que neste caso o `paramsType` tem um tipo em maiúsculo, pois na função nativa `GetPlayerName` não retorna uma string, a função recebe o ponteiro e atribui o novo valor, passando o `S` o samp_node vai ignorar a leitura daquele parametro, pois será retornado na chamada.

A função original em pawn recebe três parametros `GetPlayerName(playerid, const name[], len)` em `params` estamos somente passando dois deles, sendo o primeiro índice do array **playerid** e o segundo é o **tamanho da string**, que nesse caso é o `MAX_PLAYER_NAME` ou `24`.

###### Recebendo resposta

<!-- 
interface SendFunctionData {
	type: "functionReturn";
	name: string;
	data: any[] | any;
	uid?: string;
}
 -->

Logo após a chamada da função o node responderá a função retornando um json com os parametros abaixo:
~~~json
{
    "type": "functionReturn",
    "functionName": "GetPlayerName",
    "data": "john_doe",
    "uid": "321msd22msk1_213sz",
}
~~~

`type` serve para você diferenciar qual tipo de resposta está vindo do node como foi explicado mais acima.

`functionName` é o nome da função que foi executada pelo samp_node.

`data` é o dado de retorno da função que você chamou, esse dado pode ser um **array**, **string**, **number** ou **booleano**.

`uid` é o id que foi passado logo na chamada da função, como mostrado no json acima.
