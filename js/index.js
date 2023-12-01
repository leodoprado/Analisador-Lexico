var tokens = [];
var valuesGlobal = 0;
var valueInteration = [0];
var table = [];
var values = [[]];

$(document).ready(function(){
  montarTabela();
  $('#validarToken').keyup(function(e){
    if(table.length > 0){ validarToken(e); }
  });
});

$('#token').keyup(function(e){
  if (e.keyCode === 13) {
    adicionarToken();
  }
});

// Função responsável por montar a tabela de Tokens
function montarTabela(){
  values = [[]];
  valuesGlobal = 0;
  valueInteration = [0];
  table = [];
  montarEstados();
  table = gerarLinhasTabela();
  gerarTabela(table);
}

// Função responsável por montar os estados dos Tokens adicionados
function montarEstados(){
  // Itera sobre todos os Tokens da tabela
  for (var i = 0; i < tokens.length; i++) {
    var actualState = 0;
    var word = tokens[i];
    // Itera sobre os caracteres do Token
    for(var j = 0; j < word.length; j++){
      if(typeof values[actualState][word[j]] === 'undefined'){
        var nextState = valuesGlobal + 1;
        values[actualState][word[j]] = nextState;
        values[nextState] = [];
        valuesGlobal = actualState = nextState;
      } else {
        actualState = values[actualState][word[j]];
      }
      if(j == word.length - 1){
        values[actualState]['final'] = true;
      }
    }
  }
}

// Função responsável por gerar as linhas da tabela contendo os estados necessários
function gerarLinhasTabela(){
  var vectorvalues = [];
  for (var i = 0; i < values.length; i++) {
    var aux = [];
    aux['estado'] = i;
    var first = 'a';
    var last = 'z';
    for (var j = first.charCodeAt(0); j <= last.charCodeAt(0); j++) {
      var letter = String.fromCharCode(j);
      if(typeof values[i][letter] === 'undefined'){
        aux[letter] = '-'
      } else {
        aux[letter] = values[i][letter]
      }
    }
    if(typeof values[i]['final'] !== 'undefined'){
      aux['final'] = true;
    }
    vectorvalues.push(aux);
  };
  return vectorvalues;
}

// Função responsável por criar a tabela
function gerarTabela(vectorvalues){
  var tableFront = $('#tabelaTokens');
  tableFront.html('');
  var tr = $(document.createElement('tr'));
  var th = $(document.createElement('th'));
  th.html('');
  tr.append(th);
  var first = 'a';
  var last = 'z';
  for (var j = first.charCodeAt(0); j <= last.charCodeAt(0); j++) {
    var th = $( document.createElement('th') );
    th.html(String.fromCharCode(j));
    tr.append(th);
  }
  tableFront.append(tr);
  
  for(var i = 0; i < vectorvalues.length; i++){
    var tr = $(document.createElement('tr'));
    var td = $(document.createElement('td'));
    if(vectorvalues[i]['final']){
      td.html('q' + vectorvalues[i]['estado'] + '*');
    } else {
      td.html('q' + vectorvalues[i]['estado']);
    }
    tr.append(td);
    tr.addClass('state_'+vectorvalues[i]['estado']);
    var first = 'a';
    var last = 'z';
    for (var j = first.charCodeAt(0); j <= last.charCodeAt(0); j++) {
      var letter = String.fromCharCode(j);
      var td = $( document.createElement('td') );
      td.addClass('letter_'+letter);
      if(vectorvalues[i][letter] != '-'){
        td.html('q' + vectorvalues[i][letter]);
      } else {
        td.html('-');
      }
      tr.append(td);
    }
    tableFront.append(tr);
  }
}

// Função responsável por adicionar um novo Token
function adicionarToken() {
  var value = $("#token").val().toLowerCase();  
  if(value === ""){
    $('#token').addClass('errado');
    setTimeout(function(){
      $('#token').removeClass('errado');
    }, 2000);
  } else {
    var addNext = true;
      // Verifica se no Token a ser adicionado tem algum caractere que nao seja de (a-z)
      for (var i = 0; i < value.length; i++) {
        if(!((value[i] >= 'a' && value[i] <= 'z') || value[i] === ' ')){
          alert('Caractere inválido ' + value[i]);
          addNext = false;
          break;
        }
      }
      // Somente letras de (a-z)
      if (addNext) {
        value = value.split(" ");
        var number = tokens.length;
        // Adiciona Tokens
        if(value.length > 1){
          for (i = 0; i < value.length; i++) {
            var exists = false;
            number = tokens.length;
            if(value[i] !== ""){
              // Verifica se o Token não é vazio ou se já foi adicionado
              for (j = 0; j < tokens.length; j++) {
                if(value[i] === tokens[j]){
                  exists = true;
                }
              }
            }
          }
        } else {
          var exists = false;
          for (j = 0; j < tokens.length; j++) {
            if(value[0] === tokens[j]){
              exists = true;
            }
          }
          // Adiciona na lista de Tokens caso não exista
          if(!exists){
            var $newToken = $('<td class="list-group-item" id="word' + number + '">' + value[0] + '</td>');

            $newToken.addClass('list-group-item');

            $('#listaTokens').append($newToken);
              tokens.push(value[0]);
            }
        }
        // Limpa o campo de Adicionar Tokens
        $("#token").val("");
      }
    }
    $('#tabelaTokens').empty();
    $('#validarToken').val("");
    $('#validarToken').removeClass('certo');
    $('#validarToken').removeClass('errado');
    montarTabela();
}

// Função responsável por remover lista de Tokens
function removerTokens (e) {
  $('#token').val("");
  $('#validarToken').val("");
  $('#validarToken').removeClass('certo');
  $('#validarToken').removeClass('errado');
  tokens = [];
  $('#listaTokens').empty();
  $('#tabelaTokens').empty();
  montarTabela();
}

// Função responsável por validar os estados dos Tokens adicionados
function validarToken(event){
  var tokens = $('#validarToken').val().toLowerCase();
  var estado = 0;
  if(tokens.length == 0){
      $('#validarToken').removeClass('certo');
      $('#validarToken').removeClass('errado');
      $('#tabelaTokens tr').removeClass('selecionaEstadoCerto');
      $('#tabelaTokens td').removeClass('selecionaCampoCerto');
      $('#tabelaTokens .state_' + estado).removeClass('selecionaEstadoErrado');
      $('#tabelaTokens .letter_' + tokens[i]).removeClass('selecionaCampoErrado');
  }
  for (var i = 0; i < tokens.length; i++) {
      if(tokens[i] >= 'a' && tokens[i] <= 'z'){
      $('#tabelaTokens tr').removeClass('selecionaEstadoCerto');
      $('#tabelaTokens td').removeClass('selecionaCampoCerto');
      $('#tabelaTokens .state_' + estado).addClass('selecionaEstadoCerto');
      $('#tabelaTokens .letter_' + tokens[i]).addClass('selecionaCampoCerto');
      if(table[estado][tokens[i]] != '-'){
          $('#tabelaTokens .state_' + estado).addClass('selecionaEstadoCerto');
          $('#tabelaTokens .letter_' + tokens[i]).addClass('selecionaCampoCerto');
          estado = table[estado][tokens[i]];
          $('#validarToken').addClass('certo');
          $('#validarToken').removeClass('errado');
          $('#tabelaTokens .state_' + estado).removeClass('selecionaEstadoErrado');
          $('#tabelaTokens .letter_' + tokens[i]).removeClass('selecionaCampoErrado');
          $('#tabelaTokens .state_' + estado).removeClass('tokenFinalCorreto');
      } else {
          $('#validarToken').keyup(function(e){
              if(e.keyCode == 8){
                  $('#tabelaTokens .state_' + estado).removeClass('selecionaEstadoErrado');
                  $('#tabelaTokens .letter_' + tokens[i]).removeClass('selecionaCampoErrado');
                  $('#tabelaTokens .state_' + estado).removeClass('selecionaEstadoCerto');
                  $('#tabelaTokens .letter_' + tokens[i]).removeClass('selecionaCampoCerto');
              }
          });  
          $('#tabelaTokens .state_' + estado).addClass('selecionaEstadoErrado');
          $('#tabelaTokens .letter_' + tokens[i]).addClass('selecionaCampoErrado');
          $('#validarToken').removeClass('certo');
          $('#validarToken').addClass('errado');
          break;
      }
      } else if(tokens[i] == ' ') {
      $('#tabelaTokens tr').removeClass('selecionaEstadoCerto');
      $('#tabelaTokens td').removeClass('selecionaCampoCerto');
      $('#tabelaTokens .state_' + estado).addClass('tokenFinalCorreto');
      if(table[estado]['final']){
          estado = 0;
      } else {
          $('#tabelaTokens .state_' + estado).removeClass('tokenFinalCorreto');
          $('#validarToken').removeClass('certo');
          $('#validarToken').addClass('errado');
          break;
      }
      } else {
      $('#validarToken').removeClass('certo');
      $('#validarToken').addClass('errado');
      alert('Caractere inválido: ' + tokens[i]);
      break;
      }
  };
  }