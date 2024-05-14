document.title = "Home"

// Infinite Scroll
let page = 1; // Initial page number
const limit = 3; // Limit per page
let lastPage = 1; // Last Page

// https://tarmeezacademy.com/api/v1/posts?page=${page}&limit=${limit}
function getPost(reload = true, page = 1) {
    axios.get(`https://tarmeezacademy.com/api/v1/posts?page=${page}&limit=${limit}`).then(resp => {
        let posts = resp.data.data;
        lastPage = resp.data.meta.last_page
        if (reload) {
            document.querySelector(".posts").innerHTML = "";
        }
        for (let post of posts) {
            // console.log("Rendering post:", post);
            let author = post.author
            let optionBtns = ``
            if (user != null) {
                isMyPost = user.id != null && author.id == user.id
                document.querySelector(".add-post-img").dataset.userid = user.id
                document.querySelector(".target-profile").dataset.userid = user.id
                if (isMyPost) {
                    optionBtns = `
                    <button class="badge border-0 dropdown-toggle bg-transparent text-black fs-4 mb-2"
                        type="button" data-bs-toggle="dropdown">...
                    </button>
                    <ul class="dropdown-menu">
                        <li><a onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')" class="dropdown-item delete-btn" href="#">Delete</a></li>
                        <li><a onclick="editePost('${encodeURIComponent(JSON.stringify(post))}')" class="dropdown-item update-btn" href="#">Update</a></li>
                    </ul>`
                }
            } else {}

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
                                <div class="user-info target-profile" id="user-info" data-userId=${post.author.id}>
                                    <img src="${profileImage}" alt="Profile Picture" class="rounded-circle target-profile"
                                        style="width: 40px; height: 40px;">
                                    <span class="ml-2 ms-2 fw-bold">${author.name}</span>
                                </div>
                                <div class="d-flex align-items-center justify-content-center">
                                    <div class="timeCreated">
                                        <small>Posted <span>${post.created_at}</span></small>
                                    </div>
                                    <div class="btn-group">
                                        ${optionBtns}
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
            document.querySelector(".posts").innerHTML += content;
            let currentTags = `post-tags-${post.id}`
            document.getElementById(currentTags).innerHTML = "";
            for (let tag of post.tags) {
                let tagsContent = `<span class="btn btn-secondary rounded-5 btn-sm">${tag.name}</span>`
                document.getElementById(currentTags).innerHTML += tagsContent;
            }
        }
    })
}
// To handle Infinite Scroll Function
function handleScroll() {
    const {
        scrollTop,
        clientHeight,
        scrollHeight
    } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        if (page < lastPage) {
            page++; // Increment page number for the next request
        }
        getPost(false, page); // Pass the current page number
    }
}
// Initial fetch
getPost();
// Event listener for scrolling
window.addEventListener('scroll', handleScroll);

// To View Post Details Page
document.addEventListener("click", (e) => {
    let cardBody = e.target.closest(".card-body");
    if (cardBody) {
        e.stopPropagation();
        window.location = `Post.html?PostId=${cardBody.id}`;
    }
});

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