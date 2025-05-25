const endpoint = "https://jsonplaceholder.typicode.com/posts";

const loading = document.querySelector("#loading");
const containerPosts = document.querySelector("#container-posts");

// Pegar o id pela URL
const pesquisarParametro = new URLSearchParams(window.location.search);
const postId = pesquisarParametro.get("id");

const paginaPost = document.querySelector("#post");
const containerPost = document.querySelector("#post-container");
const containerComentarios = document.querySelector("#containerComentarios");

const formComentarios = document.querySelector("#formComentarios");
const email = document.querySelector("#email");
const comentario = document.querySelector("#body");

/// Função para pegar todos os posts
async function pegarPosts () {
    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error ("Não foi possível carregar todos os posts!");
        }

        const data = await response.json();

        loading.classList.add("hide");

        data.map((post) => {
            const div = document.createElement("div");
            const title = document.createElement("h2");
            const body = document.createElement("p");
            const link = document.createElement("a");

            title.innerText = post.title;
            body.innerText = post.body;
            link.innerText = 'Ler';
            link.setAttribute("href", `post.html?id=${post.id}`);

            div.appendChild(title);
            div.appendChild(body);
            div.appendChild(link);

            containerPosts.appendChild(div);

        })
    } catch (error) {
        loading.textContent = error.message;
        console.error(error.message);
    }
}

// Função para pegar cada post individual
async function pegarPost (id) {
    try {
        const [responsePost, responseComments] = await Promise.all([
            fetch(`${endpoint}/${id}`),
            fetch(`${endpoint}/${id}/comments`)
        ]);

        const dataPost = await responsePost.json();
        const dataComments = await responseComments.json();

        loading.classList.add("hide");
        paginaPost.classList.remove("hide");

        const title = document.createElement("h1");
        const body = document.createElement("p");

        title.innerText = dataPost.title;
        body.innerText = dataPost.body;

        containerPost.appendChild(title);
        containerPost.appendChild(body);

        dataComments.forEach(comment => {
            criarComentario(comment);
        });
    } catch (error) {
        loading.textContent = "Erro ao carregar o post.";
        console.error(error.message);
    }
}

// Função para criar comentario de cada post
function criarComentario (comment) {
    const div = document.createElement("div");
    const emailElem = document.createElement("h2");
    const bodyElem = document.createElement("p");

    emailElem.innerText = comment.email;
    bodyElem.innerText = comment.body;

    div.appendChild(emailElem);
    div.appendChild(bodyElem);

    containerComentarios.appendChild(div);
}

// Funcao para fazer um comentario no post
async function postComentario (comentario) {
    const response = await fetch(`${endpoint}/${postId}/comments`, {
        method: "POST", // Método utilizado para enviar para eu requisição
        body: comentario, // Conteudo
        headers: { // Qual tipo de dados eu estou me comunicando com a API
            "Content-Type": "application/json"
        }
    })

    const data = await response.json();
    criarComentario(data);
}

if (!postId) {
    pegarPosts();
    
} else {
    pegarPost(postId);

    formComentarios.addEventListener("submit", (e) => {
        e.preventDefault();

        const novoComentario = {
            email: email.value,
            body: comentario.value
        };

        postComentario(JSON.stringify(novoComentario));
        formComentarios.reset();
    });
}