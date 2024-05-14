let baseUrl = "https://tarmeezacademy.com/api/v1"
let loginBtn = document.querySelector(".login-btn")
let regBtn = document.querySelector(".reg-btn");
let logoutBtn = document.querySelector(".logout-btn");
let comments = document.querySelector("comment-input");
let afterSignDiv = document.querySelector(".after-sign")
let afterSignImg = document.querySelector(".after-sign img")
let afterSignName = document.querySelector(".after-sign span")

setupUI()

loginBtn.addEventListener("click", login)

function login() {
    var username = document.getElementById("login-user-name").value;
    var password = document.getElementById("login-password").value;
    axios.post(`https://tarmeezacademy.com/api/v1/login`, {
        "username": username,
        "password": password
    }).then(res => {
        let token = res.data.token;
        let user = JSON.stringify(res.data.user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", user);
        // Close Modal after Login
        bootstrap.Modal.getInstance(document.getElementById("login-modal")).hide()
        showAlert("Hello, Logged in Successfully")
        setupUI()
    }).catch(err => showAlert(err.response.data.message))
}

regBtn.addEventListener("click", register)

function register() {
    var name = document.getElementById("reg-name").value;
    var username = document.getElementById("reg-user-name").value;
    var password = document.getElementById("reg-password").value;
    var img = document.getElementById("profile-image").files[0];
    let regUrl = 'https://tarmeezacademy.com/api/v1/register'

    var bodyFormData = new FormData();
    bodyFormData.append('username', username);
    bodyFormData.append('password', password);
    bodyFormData.append('name', name);
    bodyFormData.append('image', img);

    axios.post(regUrl, bodyFormData).then(res => {
        let token = res.data.token;
        let user = JSON.stringify(res.data.user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", user);
        // Close Modal after Register
        bootstrap.Modal.getInstance(document.getElementById("register-modal")).hide()
        showAlert("Hello, A New User Registered Successfully")
        setupUI()
    }).catch(err => showAlert(err.response.data.message))
}
let user = JSON.parse(localStorage.getItem("user"))

logoutBtn.addEventListener("click", logout);

function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.reload()
}

// Some Customize After [Login + Register]
function setupUI() {
    let token = localStorage.getItem("token")
    if (token) {
        // Add Class [display: none] to hide [Logiin + Register] Btns after Sign[In-Up]
        document.querySelector(".form-btns").classList.add("d-none")
        // Remove Class [display: none] to View Log-Out Btn
        logoutBtn.classList.remove("d-none")
        // Remove Class [display: none] to View Add Post Btn
        if (document.querySelector(".add-post-btn")) {
            document.querySelector(".add-post-btn").classList.remove("d-none")
        }
        // To Show User [Username + Pic] after Sign[In-Up]
        afterSign()
        // To allow to User Open Profile page
        document.querySelector(".profile-page-link").onclick = function () {
            window.location = `profile.html?userid=${user.id}`;
            return true
        }
        // To display 
        if (document.title === "Home") {
            document.querySelector(".add-post-container").classList.remove("d-none")
        }
        // To Prevent Guest Open Profile page
    } else if (token == null) {
        document.querySelector(".add-post-container").classList.add("d-none")
        document.querySelector(".profile-page-link").onclick = function (e) {
            e.preventDefault();
            showAlert("You are a Guest")
        }
    }
}

function showAlert(alertMessage) {
    let toast = `
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <strong class="me-auto">ELIMR Social App</strong>
            <small class="text-body-secondary">just now</small>
        </div>
        <div class="toast-body">
            ${alertMessage}
        </div>
    </div>
    `
    document.querySelector(".success-toast").innerHTML = toast
    document.querySelector(".toast").classList.add('show')
    setTimeout(() => {
        document.querySelector(".toast").classList.remove('show');
    }, 3000);
}

function afterSign() {
    afterSignDiv.classList.remove("d-none")
    let user = JSON.parse(localStorage.getItem("user"))
    afterSignName.innerHTML = `@${user["username"]}`
    afterSignImg.src = `${typeof user["profile_image"] === "object" ? "/images/profile.jpg" : user["profile_image"]}`
    if (user != null) {
        document.querySelector(".add-post-img").src = `${typeof user["profile_image"] === "object" ? "/images/profile.jpg" : user["profile_image"]}`
    }
}

if (user != null) {
    document.querySelector(".add-post-img").src = `${typeof user["profile_image"] === "object" ? "/images/profile.jpg" : user["profile_image"]}`
}

// To Send Data After Press Enter
document.querySelector("#login-password").onkeydown = function (e) {
    if (e.key === "Enter") {
        login()
    }
}
document.querySelector("#register-modal").onkeydown = function (e) {
    if (e.key === "Enter") {
        register()
    }
}

// Scroll To Up Btn
let up = document.querySelector(".scroll-btn");
window.onscroll = function () {
    this.scrollY >= 800 ? up.classList.remove("d-none") : up.classList.add("d-none")
}
up.onclick = function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}



// Create Post Btn 
let createPostBtn = document.querySelector(".create-post-btn")
createPostBtn.addEventListener("click", createPost)

// Create Post Function 
function createPost() {
    let postId = document.getElementById("post-id-input").value;
    let isCreate = postId == null || postId == ""

    var postTitle = document.getElementById("post-title").value;
    var postBody = document.getElementById("post-body").value;
    var postImg = document.getElementById("post-image").files[0];
    let token = localStorage.getItem("token");

    var bodyFormData = new FormData();
    bodyFormData.append('body', postBody);
    bodyFormData.append('title', postTitle);
    bodyFormData.append('image', postImg);

    let postUrl = ``;
    if (isCreate == true) {
        postUrl = `https://tarmeezacademy.com/api/v1/posts`
    } else {
        bodyFormData.append('_method', "put")
        postUrl = `https://tarmeezacademy.com/api/v1/posts/${postId}`
    }
    axios.post(postUrl, bodyFormData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => {
        // Close Modal after Add Post
        bootstrap.Modal.getInstance(document.getElementById("add-post-modal")).hide()
        // Show alert to the user that his post [Added || Edit] successfully
        isCreate == true ? showAlert("Your Post Created successfully") : showAlert("Edit Post Is Done")
        getPost()
    }).catch(err => showAlert(err.response.data.message))

}

// Create New Post
let addPostBtn = document.querySelector(".add-post-btn")
if (addPostBtn) {
    addPostBtn.addEventListener("click", createPostBtnFunction)
}

function createPostBtnFunction() {
    document.getElementById("post-id-input").value = ""

    document.getElementById("post-modal-title").innerHTML = "Create Post"
    document.querySelector(".create-post-btn").innerHTML = "Create"
    document.getElementById("post-title").value = ""
    document.getElementById("post-body").value = ""
    let postModal = new bootstrap.Modal(document.getElementById("add-post-modal"), {})
    postModal.toggle()
}

// Edite Your Post
function editePost(postObject) {
    let post = JSON.parse(decodeURIComponent(postObject))
    document.getElementById("post-id-input").value = post.id

    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.querySelector(".create-post-btn").innerHTML = "Update"
    document.getElementById("post-title").value = post.title
    document.getElementById("post-body").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("add-post-modal"), {})
    postModal.toggle()
}

// Delete Your Post
function deletePost(postObject) {
    let post = JSON.parse(decodeURIComponent(postObject))
    document.getElementById("delete-id-input").value = post.id

    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    postModal.toggle()
}

let deletePostBtn = document.querySelector(".delete-post-btn")
if (deletePostBtn) {
    deletePostBtn.addEventListener("click", confirmDelete)
}

function confirmDelete() {
    let postId = document.getElementById("delete-id-input").value;
    let token = localStorage.getItem("token");

    var bodyFormData = new FormData();
    bodyFormData.append('_method', "delete")
    postUrl = `https://tarmeezacademy.com/api/v1/posts/${postId}`
    axios.post(postUrl, bodyFormData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => {
        // Close Modal after Add Post
        bootstrap.Modal.getInstance(document.getElementById("delete-post-modal")).hide()
        // Show alert to the user that his post Added successfully
        showAlert("Your Post Deleted successfully")
        getPost()
    }).catch(err => showAlert(err.response.data.message))
}