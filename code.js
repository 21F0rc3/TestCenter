var arrayQuestoes, time, resposta, text, segundos, nrDeSelecionada, score, IndexDeQuestoes, minutos;  //Criação de algumas variaveis

minutos = 1;    //Definição dos minutos do teste
segundos = 0;   //Definição dos segundos do teste

IndexDeQuestoes = nrDeSelecionada = score = 0;

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
  for(i=0; i<arrayQuestoes.length; i++) {
    $("#Test").append("<div id='Questao"+i+"'></div>");
    $("#Questao"+i).append("<h1 class='Questao'>"+arrayQuestoes[i].pergunta+"</h1>").css("display", "none");

    if(arrayQuestoes[i].tipo == "completar") {
      $("#Questao"+i).append("<input class='completar' type='text' value=''>");
      $("#Questao"+i).children("input").change(checkTexto);
    }else {
      for(j=0; j<arrayQuestoes[i].opcoes.length; j++) {
        $("#Questao"+i).append("<h2 id='Opcao_"+j+"' class='Opcao'>"+arrayQuestoes[i].opcoes[j]+"</h2>");
        $("#Questao"+i).children("#Opcao_"+j).bind("click", opcaoSelecionada);
      }
    }
  }
  $("#Questao0").css("display", "block");
}

function checkTexto() {
  if($(this).parent().attr("value") == "respondidoCorretamente") {
    if($(this).val() != arrayQuestoes[IndexDeQuestoes].resposta) {
      score-=5;
      $(this).parent().attr("value", "");
    }
  }else if($(this).val() == arrayQuestoes[IndexDeQuestoes].resposta) {
    score+=5;
    $(this).parent().attr("value", "respondidoCorretamente");
  }

  verifSeRespondeu();

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
  verifSeRespondeu();
  //alert(score);        //Comando para testar se a funcao esta a contar em tempo real
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
  $("#Questao"+IndexDeQuestoes).children("input").attr("readonly", true);
  $("#Questao"+IndexDeQuestoes).css("display", "none");

  IndexDeQuestoes++;

  $("#Questao"+IndexDeQuestoes).css("display", "inline");

  if(IndexDeQuestoes == arrayQuestoes.length - 1) {
    $("#next").css("display", "none");
  }

  if($("#prev").css("display") == "none") {
    $("#prev").css("display", "inline");
  }

  resetNrDeSelecionadas();

  return IndexDeQuestoes;
}

function resetNrDeSelecionadas() {
  nrDeSelecionada = 0;
  return nrDeSelecionada;
}

function acabarTeste() {
  clearInterval(time);
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
  var nrDeNaoRespondidas = arrayQuestoes.length - nrDeRespondidas;
  var nrDeRespostasErr = nrDeRespondidas - nrDeRespostasCertas;
  $(".modal-title").append("Resultados:");
  $(".modal-body").append("<div>Score: "+score+"/40</div>");
  $(".modal-body").append("<div>Respostas não respondidas: "+nrDeNaoRespondidas+"/8</div>");
  $(".modal-body").append("<div>Respostas certas: "+nrDeRespostasCertas+"/"+nrDeRespondidas+"</div>");
  $(".modal-body").append("<div>Respostas erradas: "+nrDeRespostasErr+"/"+nrDeRespondidas+"</div>");
  $("#finish").css("display", "none");
}

function verifSeRespondeu() {
  if(arrayQuestoes[IndexDeQuestoes].tipo == "completar") {
    if($("#Questao"+IndexDeQuestoes).children("input").val() != "") {
      $("#Questao"+IndexDeQuestoes).addClass("respondido");
    }else{
      $("#Questao"+IndexDeQuestoes).removeClass("respondido");
    }
  }else{
    for(i=0; i<arrayQuestoes[IndexDeQuestoes].opcoes.length; i++) {
      if($("#Questao"+IndexDeQuestoes).children("#Opcao_"+i).css("backgroundColor") == "rgb(0, 0, 0)") {
        $("#Questao"+IndexDeQuestoes).addClass("respondido");
        break;
      }else{
        $("#Questao"+IndexDeQuestoes).removeClass("respondido");
      }
    }
  }
}

function checkResposta(select) {
  if(arrayQuestoes[IndexDeQuestoes].tipo == "escolha multipla") {
    if($(select).text() == arrayQuestoes[IndexDeQuestoes].resposta[0] || $(select).text() == arrayQuestoes[IndexDeQuestoes].resposta[1]) {
      if($(select).attr("value") == "respondidoCorretamente") {
        score-=2.5;
        $(select).attr("value", "");
      }else{
        score+=2.5;
        $(select).attr("value", "respondidoCorretamente");
      }
    }
  }else {
    if($(select).parent().attr("value") == "respondidoCorretamente") {
      score-=5;
      $(select).parent().attr("value", "");
    }else if($(select).text() == arrayQuestoes[IndexDeQuestoes].resposta) {
      score+=5;
      $(select).parent().attr("value", "respondidoCorretamente");
    }
  }
  return score;
}

function countdown() {
  time = setInterval(function () {
     if(minutos == 0 && segundos == 0) {
       $(".modal-title").append("Acabou o tempo! ");
       acabarTeste();
       $("#acabarTeste").modal("toggle");
     }else if(segundos > 0) {
       segundos--;
     }else{
       minutos--;
       segundos = 59;
     }
     $("#timer").html(minutos+":"+segundos);
  }, 1000);
}
