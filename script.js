const urlBase = 'https://jsonplaceholder.typicode.com/posts';
let posts = [];

function getData() {
    fetch(urlBase)
        .then(res => res.json())
        .then(data => {
            posts = data;
            console.log(posts);
            renderPostList();
        })
        .catch(error => console.error("Error al llamar a la API. " + error));
}

getData();

function renderPostList() {
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const postItem = document.createElement('li');
        postItem.classList.add('postItem');
        postItem.innerHTML = `
            <strong>${post.title}</strong>
            <p>${post.body}</p>
            <button onclick="editPost(${post.id})">Editar</button>
            <button onclick="deletePost(${post.id})">Eliminar</button>
            <div id="editForm-${post.id}" class="editForm" style="display: none;">
                <label for="editTitle">Título</label>
                <input type="text" id="editTitle-${post.id}" value="${post.title}">
                <label for="editBody">Contenido</label>
                <textarea id="editBody-${post.id}">${post.body}</textarea>
                <button onclick="updatePost(${post.id})">Guardar</button>
            </div>
        `
        postList.appendChild(postItem);
    });
}

function postData() {
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    if (postTitle.trim() === '' || postBody.trim() === '') {
        alert('Por favor, rellena todos los campos');
        return;
    }

    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((res) => res.json())
        .then(data => {
            posts.unshift(data);
            renderPostList();
            postTitleInput.value = '';
            postBodyInput.value = '';
        })
        .catch(error => console.error("Error al crear el post. " + error));
}

function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none';
}

function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`);
    const editBody = document.getElementById(`editBody-${id}`);

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: 1,
            title: editTitle.value,
            body: editBody.value,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            const index = posts.findIndex((post) => post.id === data.id);
            if(index != -1) {
                posts[index] = data;
            } else {
                alert('Hubo un error al actualizar la información del post.');
            }
            renderPostList();
        })
        .catch(error => console.error("Error al actualizar el post. " + error));
}

function deletePost(id) {
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE',
    })
    .then(res => {
        if(res.ok) {
            posts = posts.filter(post => post.id != id);
            renderPostList();
        } else {
            alert("Hubo un error al eliminar el post.")
        }
    })
    .catch(error => console.error("Error al eliminar el post. " + error));
}