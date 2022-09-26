
const url = "http://localhost:3000";

var uperfil = '';
var ulogado = false;
var uusuario = 0;
var umatricula = '';
var unome = '';
var uhorario = null;

var inicio = 0;
const delta = 10;
var pagina = 1;
var fonte = null;
var modulo = null;

var perfis = null;

function get(caminho) {
    const _url = url + '/' + caminho;
    let request = new XMLHttpRequest();
    request.open("GET", _url, false);
    request.setRequestHeader('Content-type','application/json; charset=utf-8');
    request.send();
    return request.responseText;
}

function put(caminho, dado) {

}

function post(caminho, dado) {
    if (modulo == "usuario") usuarios_.push(dado);
    else
    if (modulo == "acao") acoes_.push(dado);
}

// ----- BD Usuário

function usuarioGetAll() {
    return usuarios_;
}

function usuarioGetId(id) {
    return usuarios_[id - 1]
}

function usuarioGetMatricula(id) {
    return usuarios_[0];
}

function validaUsuario(id, sh) {
    data = get("usuario/valida/" + id + "/" + sh);
    retorno = JSON.parse(data);
    return retorno[0];
}

function perfilGetAll() {
    return perfis_;
}

function valida(texto) {
    var retorno = '';
    const v = 'A!B@C#D$F%H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6Y';
    const w = '/.,-*=$!$&(:?).#*!/)&*$)*@!.<>:;/=*-$#!-_+&';
    var j = 0;
    for(var i = 0; i < texto.length; i++) {
        j = texto.charCodeAt(i) + v.charCodeAt(i) + w.charCodeAt(i);
        retorno = retorno + String.fromCharCode(j);
    }
    return retorno;
}

function efetuarLogin(usuario1, matricula1, 
    nome1, perfil1) {
    uusuario = usuario1;
    umatricula = matricula1;
    unome = nome1;
    uperfil = perfil1;
    ulogado = true;
    uhorario = new Date();
}

function efetuarLogoff() {
    uusuario = 0;
    umatricula = '';
    unome = '';
    uperfil = '';
    ulogado = false;
    uhorario = null;
}

// ----- BD Ação

function acaoGetAll() {
    return acoes_;
}

function acaoGetId(id) {
    return acoes_[id - 1];
}

// Métodos comuns

function limparTabela() {
    let tabela = document.getElementById("tabela");
    if(tabela){
        var child = tabela.lastElementChild;
        while (child) {
            tabela.removeChild(child);
            child = tabela.lastElementChild;
        }
    }
    document.getElementById("paginador").style.visibility = "hidden";
}

function stringSubstituirCaracter(texto, posicao, novoCaracter) {
    return texto.substring(0,posicao) + 
            novoCaracter + 
                texto.substring(posicao + 1, texto.length);
}

function inicializar() {
    perfis = perfilGetAll();
    habilitarLogin();
    document.getElementById("selPerfis").style.visibility = "hidden";
    document.getElementById("paginador").style.visibility = "hidden";
}

function mensagemLogin(texto) {
    document.getElementById("mensagemlogin").innerHTML = texto;
}

function horarioAtual(opcao) {
    const data = new Date();
    const dia  = data.getDate().toString().padStart(2, '0');
    const mes  = (data.getMonth()+1).toString().padStart(2, '0'); 
    const ano  = data.getFullYear();
    
    const hora = data.getHours().toString().padStart(2, '0');          // 0-23
    const min  = data.getMinutes().toString().padStart(2, '0');        // 0-59
    const seg  = data.getSeconds().toString().padStart(2, '0');        // 0-59

    if (opcao == 'd')
        return dia+"/"+mes+"/"+ano;
    else if (opcao == 'h')
        return hora+":"+min+":"+seg;
    else
        return dia+"/"+mes+"/"+ano+" "+hora+":"+min+":"+seg;
}

function formataHorario(_data, opcao) {
    var data = new Date(_data);
    const dia  = data.getDate().toString().padStart(2, '0');
    const mes  = (data.getMonth()+1).toString().padStart(2, '0'); 
    const ano  = data.getFullYear();
    
    const hora = data.getHours().toString().padStart(2, '0');          // 0-23
    const min  = data.getMinutes().toString().padStart(2, '0');        // 0-59
    const seg  = data.getSeconds().toString().padStart(2, '0');        // 0-59

    if (opcao == 'd')
        return dia+"/"+mes+"/"+ano;
    else if (opcao == 'h')
        return hora+":"+min+":"+seg;
    else
        return dia+"/"+mes+"/"+ano+" "+hora+":"+min+":"+seg;
}

function dadosUsuario() {
    return uusuario + ' - ' + umatricula + ' - ' + unome;
}

function habilitarLogin() {
    mensagemLogin('');
    document.getElementById('matriculaLogin').value = "";
    document.getElementById('senhaLogin').value = "";
    const habilitar = !ulogado;
    if(!habilitar) {
      document.getElementById('loginusuario').style.visibility = "hidden";
      document.getElementById('habilitarLogoff').style.visibility = 'visible';
      document.getElementById('btnUsuario').style.visibility = 'visible';
      document.getElementById('btnAcao').style.visibility = 'visible';
      document.getElementById("botoes").style.visibility = "visible";
    }
    else {
      document.getElementById('loginusuario').style.visibility = "visible";
      document.getElementById('habilitarLogoff').style.visibility = 'hidden';
      document.getElementById('btnUsuario').style.visibility = 'hidden';
      document.getElementById('btnAcao').style.visibility = 'hidden';
      document.getElementById("botoes").style.visibility = "hidden";
    }
    if (!habilitar)
    {
      var dados = dadosUsuario();
      dados = dados + ' - Logado desde: ' + formataHorario(uhorario, '');
      document.getElementById('dadosUsuario').innerHTML = 'Usuário: ' + dados;
    }
}

function usuarioHtml() {
    location.ref = "usuario.html";
}

function login() {
    var _matricula = document.getElementById('matriculaLogin').value.toUpperCase();
    var _senha = document.getElementById('senhaLogin').value;
    var usuario = usuarioGetMatricula(_matricula);
    var senhaok = false;

    if (usuario) {
   //     const _valida = validaUsuario(usuario.id, valida(_senha));
   //     if (_valida)
            senhaok = (_senha == usuario.senha);
    }
    else {
        mensagemLogin("Usuário não encontrado!");
        return;
    }
  
    if (senhaok) 
    {
        mensagemLogin("Login efetuado com sucesso!");
        efetuarLogin(usuario.id, usuario.matricula,
            usuario.nome, usuario.perfil);
        habilitarLogin();
        mensagemLogin("");
        habilitarLogin();
    } else {
        if (!usuario)
            mensagemLogin("Matrícula e/ou a senha está(ão) errado(s)!"); 
        else
            mensagemLogin("Senha incorreta!"); 
    }
}

function logoff() {
  efetuarLogoff();
  habilitarLogin();
  limparTabela();
  usuarioLimparInfo();
  document.getElementById('dadosUsuario').innerHTML = '';
  document.getElementById("btnAcao").disabled = false;
  document.getElementById("btnUsuario").disabled = false;
}

function limparInfo() {
    var info = document.getElementById("info");
    if(info) {
        var child = info.lastElementChild;
        while (child) {
            info.removeChild(child);
            child = info.lastElementChild;
        }
    }
}

function paginaPrimeira() {
    if (inicio == 0) return;
    inicio = 0;
    pagina = 1;

    if (modulo == "usuario") {
        usuarioListar();
        usuarioLimparInfo();
    }
    else
    if (modulo == "acao") {
        acaoListar();
        acaoLimparInfo();
    }
}

function paginaAnterior() {
    if (inicio == 0) return;
    inicio = inicio - delta;
    pagina--;

    if (modulo == "usuario") {
        usuarioListar();
        usuarioLimparInfo();
    }
    else
    if (modulo == "acao") {
        acaoListar();
        acaoLimparInfo();
    }
}

function paginaProxima() {
    if (inicio >= fonte.length - delta) return;
    inicio = inicio + delta;
    pagina++;

    if (modulo == "usuario") {
        usuarioListar();
        usuarioLimparInfo();
    }
    else
    if (modulo == "acao") {
        acaoListar();
        acaoLimparInfo();
    }
}

function paginaUltima() {
    if (inicio >= fonte.length - delta) return;
    const dd = fonte.length / delta;
    var paginas = 1 * dd.toFixed(0);
    if (fonte.length % delta != 0 && paginas * delta < fonte.length) paginas++;
    pagina = paginas;

    inicio = delta * (pagina - 1);

    if (modulo == "usuario") {
        usuarioListar();
        usuarioLimparInfo();
    }
    else
    if (modulo == "acao") {
        acaoListar();
        acaoLimparInfo();
    }

}

function paginacao () {
    document.getElementById("paginador").style.visibility = "visible";
    const dd = fonte.length / delta;
    var paginas = 1 * dd.toFixed(0);
    if (fonte.length % delta != 0 && paginas * delta < fonte.length) paginas++;
    document.getElementById("pager").innerHTML = pagina.toString() + "/" + paginas;
}

function inserir() {
    if (modulo == "usuario") usuarioInserir();
    else if (modulo == "acao") acaoInserir();
}

// ----- Métodos Usuário

function usuarioLimparInfo() {
    limparInfo();

    var _perfis = document.getElementById("selPerfis");
    if(_perfis) {
        var child = _perfis.lastElementChild;
        while (child) {
            _perfis.removeChild(child);
            child = _perfis.lastElementChild;
        }
    }

    _perfis.style.visibility = "hidden";
}

function usuarioSituacao(situacao) {
    var retorno = "Ativo";
    if (situacao == "1") retorno = "Bloqueado";
    else
    if (situacao == "2") retorno = "Baixado";
    return retorno;
}

function usuarioInfo(id) {
    usuarioLimparInfo();
    var info = document.getElementById("info");

    var usuario = usuarioGetId(id);

    var btnSalvar = document.createElement("button");
    btnSalvar.innerHTML = "Salvar";
    btnSalvar.onclick = function () {usuarioSalvar(id)};
    btnSalvar.style.marginRight = "10px";

    var label = document.createElement("label");
    var inputMatricula = document.createElement("input");
    var inputNome = document.createElement("input");
    var br = document.createElement("br");

    inputMatricula.setAttribute("type", "text");
    inputMatricula.setAttribute("id", "matricula");
    inputMatricula.setAttribute("size", "20");
    inputMatricula.setAttribute("maxlength", "15");
    inputMatricula.style.textTransform = "uppercase";
    inputMatricula.setAttribute("value", usuario.matricula);

    inputNome.setAttribute("type", "text");
    inputNome.setAttribute("id", "nome");
    inputNome.setAttribute("size", "60");
    inputNome.setAttribute("maxlength", "50");
    inputNome.style.textTransform = "uppercase";
    inputNome.setAttribute("value", usuario.nome);

    info.appendChild(btnSalvar);
    label.innerHTML = "** Dados do usuário: [" + usuario.id + "] **";
    label.style.backgroundColor = "silver";
    label.style.fontWeight = "bold";
    info.appendChild(label);

    br = document.createElement("br");
    info.appendChild(br);
    br = document.createElement("br");
    info.appendChild(br);
    label = document.createElement("label");
    label.innerHTML = "Matrícula: ";
    info.appendChild(label);
    br = document.createElement("br");
    info.appendChild(br);
    info.appendChild(inputMatricula);

    br = document.createElement("br");
    info.appendChild(br);
    br = document.createElement("br");
    info.appendChild(br);
    label = document.createElement("label");
    label.innerHTML = "Nome:";
    info.appendChild(label);
    br = document.createElement("br");
    info.appendChild(br);
    info.appendChild(inputNome);

    preencherPerfis(usuario.perfil);
}

function usuarioCriarCabecario() {
    let linha = document.createElement("tr");
    let tdId = document.createElement("td");
    let tdMatricula = document.createElement("td");
    let tdNome = document.createElement("td");
    let tdSituacao = document.createElement("td");
    let tdPerfil = document.createElement("td");
    let tdEdicao = document.createElement("td");
    tdId.innerHTML = "Id";
    tdId.style.width = "6ch";
    tdMatricula.innerHTML = "Matrícula";
    tdMatricula.style.width = "15ch";
    tdNome.innerHTML = "Nome";
    tdNome.style.width = "40ch";
    tdSituacao.innerHTML = "Situacao";
    tdSituacao.style.width = "10ch";
    tdPerfil.innerHTML = "Perfil";
    tdPerfil.style.width = "25ch";
    tdEdicao.innerHTML = "";

    linha.appendChild(tdId);
    linha.appendChild(tdMatricula);
    linha.appendChild(tdNome);
    linha.appendChild(tdSituacao);
    linha.appendChild(tdPerfil);
    linha.appendChild(tdEdicao);

    return linha;
}

function usuarioCriarLinha(usuario) {
    let linha = document.createElement("tr");
    let tdId = document.createElement("td");
    let tdMatricula = document.createElement("td");
    let tdNome = document.createElement("td");
    let tdSituacao = document.createElement("td");
    let tdPerfil = document.createElement("td");
    let tdEditar = document.createElement("button");
    tdEditar.innerHTML = "Editar";
    tdEditar.onclick = function () {usuarioInfo(usuario.id)};

    tdId.innerHTML = usuario.id;
    tdId.style.textAlign = "right";
    tdMatricula.innerHTML = usuario.matricula;
    tdNome.innerHTML = usuario.nome;
    tdSituacao.innerHTML = usuarioSituacao(usuario.situacao);
    tdPerfil.innerHTML = usuario.perfil;


    //linha.setAttribute("class","border-topo");
    linha.appendChild(tdId);
    linha.appendChild(tdMatricula);
    linha.appendChild(tdNome);
    linha.appendChild(tdSituacao);
    linha.appendChild(tdPerfil);
    linha.appendChild(tdEditar);
    linha.onclick = function () {usuarioInfo(usuario.id)};
    
    return linha;
}

function usuarioListar() {
    var usuarios = null;
    if (fonte) usuarios = fonte;
    else {
        usuarios = usuarioGetAll();
        fonte = usuarios;
    }
    limparTabela();   
    let tabela = document.getElementById("tabela");

    document.getElementById("paginador").style.visibility = "visible";
    paginacao();

    var i = 0;
    var k = 0;
    
    let cabecario = usuarioCriarCabecario();
    cabecario.style.backgroundColor = "black";
    cabecario.style.color = "white";

    tabela.appendChild(cabecario);

    for(i = inicio; i < inicio + delta; i++) {
        if (i < usuarios.length) {
            element = usuarios[i];
            let linha = usuarioCriarLinha(element);
            if(k % 2 == 1)
                linha.style.backgroundColor = "silver";
            tabela.appendChild(linha);
            k++;
        }
    };
}

class Usuario {
    constructor(id, matricula, nome, senha, situacao, perfil, modificador) {
      this.id = id;
      this.matricula = matricula;
      this.nome = nome;
      this.senha = senha;
      this.situacao = situacao;
      this.perfil = perfil;
      this.modificador = modificador;    
    }
};

class Perfil {
    constructor(id, descricao) {
      this.id = id;
      this.descricao = descricao;
      this.auxiliar = false;
    }
};

function usuarioSalvar(id) {
    var _matricula = document.getElementById("matricula");
    var _nome = document.getElementById("nome");
    var matricula = String(_matricula.value);
    var nome = String(_nome.value);
    
    var usuario = usuarioGetId(id);
    usuario.matricula = matricula.toUpperCase();
    usuario.nome = nome.toUpperCase();
    usuario.perfil = verificarPerfil();

    const resp = put("usuario/" + id, usuario);
    alert(resp);
    fonte = null;
    usuarioListar();
    usuarioInfo(id);
}

function verificarPerfil() {
    var selecao = document.getElementsByName('selPerfil');
    var n = 0;
    var novoPerfil = ''.padEnd(25, '0');
    for(let i=0; i < selecao.length; i++) {
      var sel = selecao[i];
      n = parseFloat(sel.value);
      console.log(n, sel.selected);
      if (sel.selected) 
        novoPerfil = stringSubstituirCaracter(novoPerfil, n, '1');
      else
        novoPerfil = stringSubstituirCaracter(novoPerfil, n, '0');
    }
    console.log(novoPerfil);
    return novoPerfil;
}

function usuarioInserir() {
    usuarioLimparInfo();
    var info = document.getElementById("info");

    var btnSalvar = document.createElement("button");
    btnSalvar.innerHTML = "Salvar";
    btnSalvar.onclick = function () {usuarioCriar()};
    btnSalvar.style.marginRight = "10px";

    var label = document.createElement("label");
    var inputMatricula = document.createElement("input");
    var inputNome = document.createElement("input");
    var br = document.createElement("br");

    inputMatricula.setAttribute("type", "text");
    inputMatricula.setAttribute("id", "matricula");
    inputMatricula.setAttribute("size", "20");
    inputMatricula.setAttribute("maxlength", "15");
    inputMatricula.style.textTransform = "uppercase";

    inputNome.setAttribute("type", "text");
    inputNome.setAttribute("id", "nome");
    inputNome.setAttribute("size", "60");
    inputNome.setAttribute("maxlength", "50");
    inputNome.style.textTransform = "uppercase";

    info.appendChild(btnSalvar);
    label.innerHTML = "** Novo usuário **";
    label.style.backgroundColor = "silver";
    label.style.fontWeight = "bold";
    info.appendChild(label);


    br = document.createElement("br");
    info.appendChild(br);
    br = document.createElement("br");
    info.appendChild(br);
    label = document.createElement("label");
    label.innerHTML = "Matrícula: ";
    info.appendChild(label);
    br = document.createElement("br");
    info.appendChild(br);
    info.appendChild(inputMatricula);

    br = document.createElement("br");
    info.appendChild(br);
    br = document.createElement("br");
    info.appendChild(br);
    label = document.createElement("label");
    label.innerHTML = "Nome:";
    info.appendChild(label);
    br = document.createElement("br");
    info.appendChild(br);
    info.appendChild(inputNome);

    preencherPerfis('');
}

function usuarioCriar() {
    var _matricula = document.getElementById("matricula");
    var _nome = document.getElementById("nome");
    var matricula = String(_matricula.value).toUpperCase();
    var nome = String(_nome.value).toUpperCase();

    var usuario = new Usuario(fonte.length, matricula, nome, "padrao12345", "0", 
            verificarPerfil(),  uusuario);

    const resp = post("usuario", usuario);
    alert("Usuário inserido!");
    fonte = null;
    usuarioListar();
    usuarioLimparInfo();
}

function preencherPerfis(perfil) {
    var selecao = document.getElementById("selPerfis");
    selecao.style.visibility = "visible";
    var sel = false;
    var i = 0;
    perfis.forEach(element => {
        var option = document.createElement("option");
        option.setAttribute("name", "selPerfil");
        option.value = element.id;
        option.innerHTML = element.descricao;
        if (perfil != '') {
            i = element.id;
            if ((perfil.substring(i, i + 1) == "1")) sel = true; else sel = false;
            option.selected = sel;
        }
        selecao.appendChild(option);
    });

    //<option name="selPerfilUsuarioC" *ngFor='let perfil of perfis' [value]="perfil.id" >{{perfil.descricao}}</option>
}

function varrerPerfil(perfil) {
    var perfil = '';
    for(let i=0; i<perfis.length; i++) {
      let j = this.perfis[i].id;
      perfis[i].auxiliar = perfil[j] == '1';
    }
};

function usuarioInicializar() {
    modulo = "usuario";
    document.getElementById("btnAcao").disabled = false;
    document.getElementById("btnUsuario").disabled =true;
    fonte = null;
    pagina = 1;
    inicio = 0;
    usuarioLimparInfo();
    usuarioListar();
}

// ----- Métodos Ação

function acaoLimparInfo() {
    limparInfo();
}

function acaoInfo(id) {
    acaoLimparInfo();
    var info = document.getElementById("info");

    var acao = acaoGetId(id);

    var btnSalvar = document.createElement("button");
    btnSalvar.innerHTML = "Salvar";
    btnSalvar.onclick = function () {acaoSalvar(id)};
    btnSalvar.style.marginRight = "10px";

    var label = document.createElement("label");
    var inputDescricao = document.createElement("input");
    var inputObservacao = document.createElement("input");
    var br = document.createElement("br");

    inputDescricao.setAttribute("type", "text");
    inputDescricao.setAttribute("id", "descricao");
    inputDescricao.setAttribute("size", "100");
    inputDescricao.setAttribute("maxlength", "100");
    inputDescricao.setAttribute("value", acao.descricao);
    inputDescricao.style.textTransform = "uppercase";

    inputObservacao.setAttribute("type", "text");
    inputObservacao.setAttribute("id", "observacao");
    inputObservacao.setAttribute("size", "100");
    inputObservacao.setAttribute("maxlength", "500");
    inputObservacao.setAttribute("value", acao.observacao);

    info.appendChild(btnSalvar);
    label.innerHTML = "** Dados da ação: [" + acao.id + "] **";
    label.style.backgroundColor = "silver";
    label.style.fontWeight = "bold";
    info.appendChild(label);

    br = document.createElement("br");
    info.appendChild(br);
    br = document.createElement("br");
    info.appendChild(br);
    label = document.createElement("label");
    label.innerHTML = "Descrição: ";
    info.appendChild(label);
    br = document.createElement("br");
    info.appendChild(br);
    info.appendChild(inputDescricao);

    br = document.createElement("br");
    info.appendChild(br);
    br = document.createElement("br");
    info.appendChild(br);
    label = document.createElement("label");
    label.innerHTML = "Observação:";
    info.appendChild(label);
    br = document.createElement("br");
    info.appendChild(br);
    info.appendChild(inputObservacao);
}

function acaoCriarCabecario() {
    let linha = document.createElement("tr");
    let tdId = document.createElement("td");
    let tdData = document.createElement("td");
    let tdUsuario = document.createElement("td");
    let tdDescricao = document.createElement("td");
    let tdObservacao = document.createElement("td");
    let tdSituacao = document.createElement("td");
    let tdEdicao = document.createElement("td");
    tdId.innerHTML = "Id";
    tdId.style.width = "6ch";
    tdData.innerHTML = "Data";
    tdData.style.width = "20ch";
    tdUsuario.innerHTML = "Usuário";
    tdUsuario.style.width = "15ch";
    tdDescricao.innerHTML = "Descrição";
    tdDescricao.style.width = "50ch";
    tdObservacao.innerHTML = "Observação";
    tdObservacao.style.width = "50ch";
    tdSituacao.innerHTML = "Situação";
    tdSituacao.style.width = "15ch";
    tdEdicao.innerHTML = "";

    linha.appendChild(tdId);
    linha.appendChild(tdData);
    linha.appendChild(tdUsuario);
    linha.appendChild(tdDescricao);
    linha.appendChild(tdObservacao);
    linha.appendChild(tdSituacao);
    linha.appendChild(tdEdicao);

    return linha;
}

function acaoSituacao(situacao) {
    var retorno = "Em aberto";
    if (situacao == "1") retorno = "Finalizado";
    else
    if (situacao == "2") retorno = "Cancelado";
    else
    if (situacao == "3") retorno = "Reaberto";
    return retorno;
}

function acaoCriarLinha(acao) {
    let linha = document.createElement("tr");
    let tdId = document.createElement("td");
    let tdData = document.createElement("td");
    let tdUsuario = document.createElement("td");
    let tdDescricao = document.createElement("td");
    let tdObservacao = document.createElement("td");
    let tdSituacao = document.createElement("td");
    let tdEditar = document.createElement("button");
    tdEditar.innerHTML = "Editar";
    tdEditar.onclick = function () {acaoInfo(acao.id)};

    tdId.innerHTML = acao.id;
    tdId.style.textAlign = "right";
    tdData.innerHTML = formataHorario(acao.data,'');
    tdUsuario.innerHTML = acao.matricula;
    tdDescricao.innerHTML = acao.descricao;
    tdObservacao.innerHTML = acao.observacao;
    tdSituacao.innerHTML = acaoSituacao(acao.situacao);

    linha.appendChild(tdId);
    linha.appendChild(tdData);
    linha.appendChild(tdUsuario);
    linha.appendChild(tdDescricao);
    linha.appendChild(tdObservacao);
    linha.appendChild(tdSituacao);
    linha.appendChild(tdEditar);
    linha.onclick = function () {acaoInfo(acao.id)};
    
    return linha;
}

function acaoListar() {
    var acoes = null;
    if (fonte) acoes = fonte;
    else {
        acoes = acaoGetAll();
        fonte = acoes;
    }
    limparTabela();   
    let tabela = document.getElementById("tabela");

    paginacao();

    var i = 0;
    var k = 0;
    
    let cabecario = acaoCriarCabecario();
    cabecario.style.backgroundColor = "black";
    cabecario.style.color = "white";

    tabela.appendChild(cabecario);

    for(i = inicio; i < inicio + delta; i++) {
        if (i < acoes.length) {
            element = acoes[i];
            let linha = acaoCriarLinha(element);
            if(k % 2 == 1)
                linha.style.backgroundColor = "silver";
            tabela.appendChild(linha);
            k++;
        }
    };
}

class Acao {
    constructor(id, data, usuario, descricao, observacao, situacao, modificador, matricula, nome) {
      this.id = id;
      this.data = data;
      this.usuario = usuario;
      this.descricao = descricao;
      this.observacao = observacao;
      this.situacao = situacao;
      this.modificador = modificador;    
      this.matricula = matricula;
      this.nome = nome;
    }
};

function acaoSalvar(id) {
    var _descricao = document.getElementById("descricao");
    var _observacao = document.getElementById("observacao");
    var descricao = String(_descricao.value);
    var observacao = String(_observacao.value);
    
    var acao = acaoGetId(id);
    acao.modificador = uusuario;
    acao.descricao = descricao.toLocaleUpperCase();
    acao.observacao = observacao;

    const resp = put("acao/" + id, acao);
    alert(resp);
    fonte = null;
    acaoListar();
    acaoInfo(id);
}

function acaoInserir() {
    acaoLimparInfo();
    var info = document.getElementById("info");

    var btnSalvar = document.createElement("button");
    btnSalvar.innerHTML = "Salvar";
    btnSalvar.onclick = function () {acaoCriar()};
    btnSalvar.style.marginRight = "10px";

    var label = document.createElement("label");
    var inputDescricao = document.createElement("input");
    var inputObservacao = document.createElement("input");
    var br = document.createElement("br");

    inputDescricao.setAttribute("type", "text");
    inputDescricao.setAttribute("id", "descricao");
    inputDescricao.setAttribute("size", "100");
    inputDescricao.setAttribute("maxlength", "100");
    inputDescricao.style.textTransform = "uppercase";

    inputObservacao.setAttribute("type", "text");
    inputObservacao.setAttribute("id", "observacao");
    inputObservacao.setAttribute("size", "100");
    inputObservacao.setAttribute("maxlength", "500");
 
    info.appendChild(btnSalvar);
    label.innerHTML = "** Nova ação **";
    label.style.backgroundColor = "silver";
    label.style.fontWeight = "bold";
    info.appendChild(label);

    br = document.createElement("br");
    info.appendChild(br);
    br = document.createElement("br");
    info.appendChild(br);
    label = document.createElement("label");
    label.innerHTML = "Descrição: ";
    info.appendChild(label);
    br = document.createElement("br");
    info.appendChild(br);
    info.appendChild(inputDescricao);

    br = document.createElement("br");
    info.appendChild(br);
    br = document.createElement("br");
    info.appendChild(br);
    label = document.createElement("label");
    label.innerHTML = "Observação:";
    info.appendChild(label);
    br = document.createElement("br");
    info.appendChild(br);
    info.appendChild(inputObservacao);
}

function acaoCriar() {
    var _descricao = document.getElementById("descricao");
    var _observacao = document.getElementById("observacao");
    var descricao = String(_descricao.value).toUpperCase();
    var observacao = String(_observacao.value);
    
    var acao = new Acao(fonte.length, new Date(), uusuario, descricao, observacao,
                        "0", uusuario, umatricula, unome);

    const resp = post("acao", acao);
    alert("Ação criada!");
    fonte = null;
    acaoListar();
    acaoLimparInfo();
}

function acaoInicializar() {
    modulo = "acao";
    document.getElementById("btnAcao").disabled = true;
    document.getElementById("btnUsuario").disabled = false;
    fonte = null;
    pagina = 1;
    inicio = 0;
    usuarioLimparInfo();
    acaoListar();
}

var usuarios_ = [];
var acoes_ = [];
var perfis_ = [];

usuarios_.push(new Usuario(1,'ADMIM', 'ADMIN', '123456', '0', '1111100000000000000000000',1));
usuarios_.push(new Usuario(2,'ADMIM2', 'ADMIN2', '123456', '0', '1111100000000000000000000',1));

acoes_.push(new Acao(1, '09/25/2022 21:05:10', 1, 'TESTE', 'TESTE', '0', 1, 'ADMIM', 'ADMIN'));
acoes_.push(new Acao(2, '09/25/2022 21:15:38', 1, 'TESTE2', 'TESTE2', '0', 1, 'ADMIM', 'ADMIN'));

perfis_.push(new Perfil(0, 'Administrador'));
perfis_.push(new Perfil(1, 'Perfil 1'));
perfis_.push(new Perfil(2, 'Perfil 2'));
perfis_.push(new Perfil(3, 'Perfil 3'));
perfis_.push(new Perfil(4, 'Perfil 4'));

inicializar();
