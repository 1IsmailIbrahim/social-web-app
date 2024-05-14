document.title = "Profile"

let locationHref = location.href,
    matchResult = locationHref.match(/userid=(\d+)/),
    profileId;

if (matchResult && matchResult[1]) {
    profileId = Number(matchResult[1]);
}

function detailsCard() {
    axios.get(`https://tarmeezacademy.com/api/v1/users/${profileId}`).then(resp => {
        let card = resp.data.data;
        let img = document.getElementById('main-info-image')
        document.getElementById('main-info-name').innerHTML = card.name;
        document.getElementById('main-info-username').innerHTML = `@${card.username}`;
        document.getElementById('posts-count').innerHTML = card.posts_count;
        document.getElementById('comments-count').innerHTML = card.comments_count;
        img.src = `${typeof card.profile_image === "object" ? '/images/profile.jpg' : card.profile_image}`;
    })
}

detailsCard()

function getPost(reload = true) {
    if (reload) {
        document.querySelector(".user-own-posts").innerHTML = "";
    }
    axios.get(`https://tarmeezacademy.com/api/v1/users/${profileId}/posts`).then(resp => {
        let posts = resp.data.data;
        posts.reverse();
        for (let post of posts) {
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

            let content = `    
            <div class="post-container container my-5">
            <div class="d-flex justify-content-center">
                <div class="col-12 col-lg-9">
                    <div class="card">
                        <div class="card-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="user-info">
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
                                            type="button" data-bs-toggle="dropdown">...
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li><a onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')" class="dropdown-item delete-btn" href="#">Delete</a></li>
                                            <li><a onclick="editePost('${encodeURIComponent(JSON.stringify(post))}')" class="dropdown-item update-btn" href="#">Update</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body" id="${post.id}">
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
                                <span id="post-tags-${post.id}"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
            document.querySelector(".user-own-posts").innerHTML += content;
            let currentTags = `post-tags-${post.id}`
            // To Show Tags
            document.getElementById(currentTags).innerHTML = "";
            for (let tag of post.tags) {
                let tagsContent = `<span class="btn btn-secondary rounded-5 btn-sm">${tag.name}</span>`
                document.getElementById(currentTags).innerHTML += tagsContent;
            }
            let user = JSON.parse(localStorage.getItem("user"))
            if (profileId == user.id) {
                document.querySelector(".add-post-container-profile").classList.remove("d-none")
                document.querySelectorAll(".btn-group").forEach(e => {
                    e.classList.remove("d-none")
                })
            }
        }
    })
}

// Initial fetch
getPost();

// To View Post Details Page
document.addEventListener("click", (e) => {
    let cardBody = e.target.closest(".card-body");
    if (cardBody) {
        e.stopPropagation();
        window.location = `Post.html?PostId=${cardBody.id}`;
    }
});