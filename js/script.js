const endpoint = "https://jsonplaceholder.typicode.com/posts";

const loading = document.querySelector("#loading");
const containerPosts = document.querySelector("#container-posts");

// Pegar o id pela URL
const pesquisarParametro = new URLSearchParams(window.location.search);
const postId = pesquisarParametro.get("id");

const paginaPost = document.querySelector("#post");
const containerPost = document.querySelector("#post-container");
const containerComentarios = document.querySelector("#containerComentarios");

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

            title.innerHTML = post.title;
            body.innerHTML = post.body;
            link.innerHTML = 'Ler';
            link.setAttribute("href", `post.html?id=${post.id}`);

            div.appendChild(title);
            div.appendChild(body);
            div.appendChild(link);

            containerPosts.appendChild(div);

        })
    } catch (error) {
        loading.textContent = error.message;
        console.error(error)
    }
}