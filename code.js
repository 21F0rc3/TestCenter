var IndexDeQuestoes = 0;
var arrayQuestoes;

var minutos = 5;
var segundos = 0;

var nrDeSelecionada = 0;

var score = 0;

var resposta;

var text;

function start() {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      arrayQuestoes = JSON.parse(this.responseText);
      fillQuestoes(arrayQuestoes);
    }
  };

  xmlhttp.open("GET", "Questoes.txt", true);
  xmlhttp.send();

  $("#start").css("display", "none");
  $("#Controlos").css("display", "flex");
  $("#prev").css("display", "none");

  countdown();

  return arrayQuestoes;
}

function fillQuestoes(arrayQuestoes) {
  var teste = $("#Test");
  let tam = arrayQuestoes.length;
  for(i=0; i<tam; i++) {
    $("#Test").append("<div id='Questao"+i+"' class='Quest'></div>");

    $("#Questao"+i).append("<h1 class='Questao'>"+arrayQuestoes[i].pergunta+"</h1>");
    $("#Questao"+i).css("display", "none");

    if(arrayQuestoes[i].tipo == "escolha unica") {
      for(j=0; j<4; j++) {
        $("#Questao"+i).append("<h2 id='Opcao_"+j+"' class='Opcao'>"+arrayQuestoes[i].opcoes[j]+"</h2>");
        $("#Questao"+i).children("#Opcao_"+j).bind("click", opcaoSelecionada);
      }
    }

    if(arrayQuestoes[i].tipo == "escolha multipla") {
      for(j=0; j<4; j++) {
        $("#Questao"+i).append("<h2 id='Opcao_"+j+"' class='Opcao'>"+arrayQuestoes[i].opcoes[j]+"</h2>");
        $("#Questao"+i).children("#Opcao_"+j).bind("click", opcaoSelecionada);
      }
    }

    if(arrayQuestoes[i].tipo == "V ou F") {
      for(j=0; j<2; j++) {
        $("#Questao"+i).append("<h2 id='Opcao_"+j+"' class='Opcao'>"+arrayQuestoes[i].opcoes[j]+"</h2>");
        $("#Questao"+i).children("#Opcao_"+j).bind("click", opcaoSelecionada);
      }
    }

    if(arrayQuestoes[i].tipo == "completar") {
      $("#Questao"+i).append("<input type='text' value=''>");
      $("#Questao"+i).children("input").change(checkTexto);
  }
  $("#Questao0").css("display", "block");
}
}

function checkTexto() {
  if($(this).val() == arrayQuestoes[IndexDeQuestoes].resposta) {
    if($(this).parent().attr("value") == "respondidoCorretamente") {
    }else {
      score+=5;
      $(this).parent().attr("value", "respondidoCorretamente");
    }
  }else if($(this).parent().attr("value") == "respondidoCorretamente") {
    score-=5;
    $(this).parent().attr("value", "");
  }
  return score;
}

function opcaoSelecionada() {
  if(arrayQuestoes[IndexDeQuestoes].tipo == "escolha multipla") {
    if($(this).css("background-color") == "rgb(0, 0, 0)") {
      $(this).css("background-color", "white");
      nrDeSelecionada--;
    }else if(nrDeSelecionada < 2) {
      $(this).css("background-color", "rgb(0, 0, 0)");
      nrDeSelecionada++;
    }
  }else {
    if($(this).css("background-color") == "rgb(0, 0, 0)") {
      $(this).css("background-color", "white");
    }else {
      $(".Opcao").css("backgroundColor", "white");
      $(this).css("background-color", "rgb(0, 0, 0)");
    }
  }
  var select = $(this);
  checkResposta(select);
  //alert(score);        Comando para testar se a funcao esta a contar em tempo real
  return nrDeSelecionada;
}

function perguntaAnterior() {
  $("#Questao"+IndexDeQuestoes).css("display", "none");
  IndexDeQuestoes--;
  $("#Questao"+IndexDeQuestoes).css("display", "inline");

  if(IndexDeQuestoes <= 0) {
    $("#prev").css("display", "none");
  }

  if($("#next").css("display") == "none") {
    $("#next").css("display", "inline");
  }
  return IndexDeQuestoes;
}

function perguntaSeguinte() {
  $("#Questao"+IndexDeQuestoes).children(".Opcao").unbind("click");
  $("#Questao"+IndexDeQuestoes).children(".Opcao").attr("class", "Opcoes");
  $("#Questao"+IndexDeQuestoes).children("input").attr("readonly", true);
  $("#Questao"+IndexDeQuestoes).css("display", "none");

  verifSeRespondeu();

  IndexDeQuestoes++;

  $("#Questao"+IndexDeQuestoes).css("display", "inline");

  if(IndexDeQuestoes >= arrayQuestoes.length - 1) {
    $("#next").css("display", "none");
  }

  if($("#prev").css("display") == "none") {
    $("#prev").css("display", "inline");
  }

  return IndexDeQuestoes;
}

function acabarTeste() {
  verifSeRespondeu();
  var nrDeRespondidas = 0;
  var nrDeRespostasCertas = 0;
  for(i=0; i<arrayQuestoes.length; i++) {
    if($("#Questao"+i).hasClass("respondido")) {
      nrDeRespondidas++;
    }
    if(arrayQuestoes[i].tipo == "escolha multipla") {
      for(j=0; j<4; j++) {
        if($("#Questao"+i).children("#Opcao_"+j).attr("value") == "respondidoCorretamente") {
          nrDeRespostasCertas++;
          break;
        }
      }
    }else {
      if($("#Questao"+i).attr("value") == "respondidoCorretamente") {
        nrDeRespostasCertas++;
      }
    }
  }
  var nrdeNaoRespondidas = arrayQuestoes.length - nrDeRespondidas;
  var nrDeRespostasErr = arrayQuestoes.length - nrdeNaoRespondidas - nrDeRespostasCertas;
  alert("Score: "+score+"\nNrdeNaoRespondidas "+nrdeNaoRespondidas+"\nNrDeRespostasCertas: "+nrDeRespostasCertas+"\nNrDeRespostasErradas: "+nrDeRespostasErr);
  $("#finish").css("display", "none");
}

function verifSeRespondeu() {
  if(arrayQuestoes[IndexDeQuestoes].tipo == "escolha unica" || arrayQuestoes[IndexDeQuestoes].tipo == "escolha multipla") {
    for(i=0; i<4; i++) {
      if($("#Questao"+IndexDeQuestoes).children("#Opcao_"+i).css("backgroundColor") == "rgb(0, 0, 0)") {
        $("#Questao"+IndexDeQuestoes).addClass("respondido");
      }
    }
  }else if(arrayQuestoes[IndexDeQuestoes].tipo == "V ou F") {
    for(i=0; i<2; i++) {
      if($("#Questao"+IndexDeQuestoes).children("#Opcao_"+i).css("backgroundColor") == "rgb(0, 0, 0)") {
        $("#Questao"+IndexDeQuestoes).addClass("respondido");
      }
    }
  }else if(arrayQuestoes[IndexDeQuestoes].tipo == "completar") {
    if($("#Questao"+IndexDeQuestoes).children("input").val() == "") {
    }else{
      $("#Questao"+IndexDeQuestoes).addClass("respondido");
    }
  }
}

function checkResposta(select) {
  if(arrayQuestoes[IndexDeQuestoes].tipo == "escolha unica" || arrayQuestoes[IndexDeQuestoes].tipo == "V ou F") {
    if($(select).parent().attr("value") == "respondidoCorretamente") {
        score-=5;
        $(select).parent().attr("value", "");
    }else if($(select).text() == arrayQuestoes[IndexDeQuestoes].resposta) {
      score+=5;
      $(select).parent().attr("value", "respondidoCorretamente");
    }
  }else{
      if($(select).text() == arrayQuestoes[IndexDeQuestoes].resposta[0] || $(select).text() == arrayQuestoes[IndexDeQuestoes].resposta[1]) {
        if($(select).attr("value") == "respondidoCorretamente") {
          score-=2.5;
          $(select).attr("value", "");
        }else{
          score+=2.5;
          $(select).attr("value", "respondidoCorretamente");
        }
      }
  }
  return score;
}

function countdown() {
  var time = setInterval(function () {
     if(minutos == 0 && segundos == 0) {
       alert("Acabou o tempo");
       acabarTeste();
       clearInterval(time);
     }else if(segundos > 0) {
       segundos--;
     }else{
       minutos--;
       segundos = 59;
     }
     $("#timer").html(minutos+":"+segundos);
  }, 1000);
}
