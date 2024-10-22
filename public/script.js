function validateForm() {
    var url = document.getElementById("inputUrl").value;
    var titulo = document.getElementById("inputTitulo").value;
    var descricao = document.getElementById("inputDescricao").value;

    if (url == "") {
        alert("URL é obrigatória");
        return false;
    }

    if (titulo == "") {
        alert("Título é obrigatório");
        return false;
    }

    if (descricao == "") {
        alert("Descrição é obrigatória");
        return false;
    }

    return true;
}

function showData() {
    fetch('/videoList.json') // Obter o arquivo JSON do servidor
        .then(response => response.json())
        .then(videoList => {
            var html = "";

            videoList.forEach(function (element, index) {
                html += "<tr>";
                html += '<td><a href="'+ element.url +'" target="_blank" class="link-style"rel="noopener noreferrer"> '+ element.url +'</a></td>';
                html += "<td>" + element.titulo + "</td>";
                html += "<td>" + element.descricao + "</td>";
                html += '<td><button onclick="deleteData(' + index + ')" class="btn btn-danger">Deletar</button></td>';
                html += '<td><button onclick="updateData(' + index + ')" class="btn btn-warning">Editar</button></td>';
                html += "</tr>";
            });

            document.querySelector("#crudTable tbody").innerHTML = html;
        })
        .catch(error => console.error('Erro ao carregar dados:', error));
}

document.onload = showData();

function addData() {
    if (validateForm() == true) {
        var url = document.getElementById("inputUrl").value;
        var titulo = document.getElementById("inputTitulo").value;
        var descricao = document.getElementById("inputDescricao").value;

        var newVideo = {
            url: url,
            titulo: titulo,
            descricao: descricao
        };

        fetch('/addVideo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newVideo)
        })
            .then(response => response.text())
            .then(data => {
                alert(data); // Mensagem de sucesso
                showData(); // Atualizar a tabela
                clearForm(); // Limpar os campos do formulário
            })
            .catch(error => console.error('Erro:', error));
    }
}

function deleteData(index) {
    fetch('/deleteVideo', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index: index }) // Enviando o índice do vídeo a ser deletado
    })
        .then(response => response.text())
        .then(data => {
            alert(data); // Mensagem de confirmação
            showData(); // Atualizar a tabela
        })
        .catch(error => console.error('Erro ao deletar vídeo:', error));
}

function updateData(index) {
    document.getElementById("Submit").style.display = "none";
    document.getElementById("Update").style.display = "block";

    fetch('/videoList.json') // Obter a lista de vídeos
        .then(response => response.json())
        .then(videoList => {
            document.getElementById("inputUrl").value = videoList[index].url;
            document.getElementById("inputTitulo").value = videoList[index].titulo;
            document.getElementById("inputDescricao").value = videoList[index].descricao;

            document.querySelector("#Update").onclick = function () {
                if (validateForm() == true) {
                    const updatedVideo = {
                        url: document.getElementById("inputUrl").value,
                        titulo: document.getElementById("inputTitulo").value,
                        descricao: document.getElementById("inputDescricao").value
                    };

                    fetch('/updateVideo', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ index: index, video: updatedVideo })
                    })
                        .then(response => response.text())
                        .then(data => {
                            alert(data); // Mensagem de confirmação
                            showData(); // Atualizar a tabela
                            clearForm(); // Limpar os campos
                        })
                        .catch(error => console.error('Erro ao atualizar vídeo:', error));
                }
            };
        })
        .catch(error => console.error('Erro ao carregar dados para edição:', error));
}

function clearForm() {
    document.getElementById("inputUrl").value = "";
    document.getElementById("inputTitulo").value = "";
    document.getElementById("inputDescricao").value = "";
    document.getElementById("Submit").style.display = "block";
    document.getElementById("Update").style.display = "none";
}
