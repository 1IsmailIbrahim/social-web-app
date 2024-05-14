let locationHref = location.href,
    matchResult = locationHref.match(/PostId=(\d+)/),
    postId;

if (matchResult && matchResult[1]) {
    postId = matchResult[1];
}

function getClickedPost() {
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${postId}`).then(resp => {
        document.querySelector(".postDetails").innerHTML = "";
        let post = resp.data.data;
        let author = post.author
        
        let postTitle = post.title
        if (post.title == null) {
            postTitle = ""
        }
        let postImage = ''
        if (post.image !== null) {
            postImage = post.image
        }
        let profileImage = ''
        if (typeof author.profile_image === 'object') {
            profileImage = '/images/profile.jpg'
        } else {
            profileImage = author.profile_image
        }

        let content =
            `
                <div class="post-container container my-5">
                    <div class="d-flex justify-content-center">
                    <div class="col-12 col-lg-9">
                        <h1 class=""><span>${author.name}'s</span> Post</h1>
                            <div class="card shadow-lg" id="${post.id}">
                                <div class="card-header">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="user-info" id="user-info" data-userId=${post.author.id}>
                                            <img src="${profileImage}" alt="Profile Picture" class="rounded-circle"
                                                style="width: 40px; height: 40px;">
                                            <span class="ml-2 ms-2 fw-bold">${author.name}</span>
                                        </div>
                                        <div class="d-flex align-items-center justify-content-center">
                                            <div class="timeCreated">
                                                <small>Posted <span>${post.created_at}</span></small>
                                            </div>
                                            <div class="btn-group d-none">
                                                <button class="badge border-0 dropdown-toggle bg-transparent text-black fs-4 mb-2"
                                                    type="button" data-bs-toggle="dropdown">...</button>
                                                <ul class="dropdown-menu">
                                                    <li><a class="dropdown-item" href="#">Delete</a></li>
                                                    <li><a class="dropdown-item" href="#">Update</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <img class="card-img w-100 " src="${postImage}" alt="">
                                    <div class="my-3">
                                        <h5>${postTitle}</h5>
                                        <p class="text-secondary">${post.body}</p>
                                    </div>
                                    <hr>
                                    <div class="comments-section d-flex align-items-center">
                                        <div>
                                            <i class="fa-regular fa-comment me-2"></i>
                                        </div>
                                        <span class="me-2">${post.comments_count} Comments:</span>
                                        <span id="post-tags-${post.id}">
                                        </span>
                                    </div>
                                    <div class="comments-box"></div>
                                    <div id="comment-input" class="comment-input d-none d-flex gap-3 my-2 py-2 flex-row">
                                        <input id="comment-body" class="ps-2 rounded border-0" placeholder="Enter Comment">
                                        <button id="comment-btn" class="btn btn-primary border-0 d-flex justify-content-center align-items-center fw-bold fs-5">Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        document.querySelector(".postDetails").innerHTML += content;
        // To View Post Tags
        let currentTags = `post-tags-${post.id}`
        document.getElementById(currentTags).innerHTML = "";
        for (let tag of post.tags) {
            let tagsContent = `<span class="btn btn-secondary rounded-5 btn-sm mx-1">${tag.name}</span>`
            document.getElementById(currentTags).innerHTML += tagsContent;
        }
        // To View Post Comments
        document.querySelector(".comments-box").innerHTML = "";
        for (let comment of post.comments) {
            let commentContent = `
            <div class="comment-area p-3 my-3 rounded">
                <div class="d-flex align-items-center">
                    <img src="${typeof comment.author.profile_image === "object" ? "/images/profile.jpg" : comment.author.profile_image}" alt="Profile Picture" class="rounded-circle me-2"
                        style="width: 40px; height: 40px;">
                    <span class="ml-2 ms-2 fw-bold">${comment.author.name}</span>
                </div>
                <p class="p-2 fs-5 my-2 border border-light-subtle rounded">${comment.body}</p>
            </div>
            `
            document.querySelector(".comments-box").innerHTML += commentContent;
        }

        // Event listener setup for clicking the comment button
        let commentBtn = document.getElementById("comment-btn");
        if (commentBtn != null) {
            commentBtn.addEventListener("click", function () {
                createComment();
            });
        }
        // Event listener setup for pressing Enter in the comment input
        let commentInput = document.getElementById("comment-body");
        if (commentInput != null) {
            commentInput.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    createComment();
                }
            });
        }
        let token = localStorage.getItem("token");
        let comment = document.getElementById("comment-input");
        if (token != null) {
            comment.classList.remove("d-none")
        }
    });
}

function createComment() {
    let commentUrl = `https://tarmeezacademy.com/api/v1/posts/${postId}/comments`
    let commentInput = document.getElementById("comment-body").value
    let token = localStorage.getItem("token");
    let params = {
        "body": commentInput,
    }
    axios.post(commentUrl, params, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(resp => {
        // Clear the input field after successful submission
        document.getElementById("comment-body").value = "";
        showAlert("Your Comment added successfully");
        getClickedPost();
    }).catch(err => showAlert(err.response.data.message))
}

// Initial execution
getClickedPost();


// Redirect to the profile page with the user ID
document.addEventListener("click", (e) => {
    let clickedElement = e.target;
    // Check if the clicked element or any of its ancestors has the "profIdAndImg" id
    while (clickedElement && !clickedElement.id.includes("user-info")) {
        clickedElement = clickedElement.parentElement;
    }
    if (clickedElement) {
        let userId = clickedElement.dataset.userid;
        window.location = `profile.html?userid=${userId}`;
    }
});