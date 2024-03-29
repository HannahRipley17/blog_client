

var app = new Vue ({
	el: "#app",

	data: {
        page: "blog", // still need the empty post list to attach all the new posts from data.js
        drawer: false,
        categories: [
            "all",
            "clothing",
            "hunting",
            "shoes",
            "books",
            "cards",
            "coins",
            "keychains",
            "comic books",
            "misc."
        ],
        posts: [],
        selected_category: "all",
        new_post_title: "",
        new_post_author: "",
        new_post_category: "all",
        new_post_image: "",
        new_post_text: "",
        
        secret_keycode: "",
        server_url: "http://localhost:3000",
        // server_url: "https://blog-hripley.herokuapp.com",

        editing_post: "",
        update_title: "",
        update_author: "",
        update_category: "",
        update_image: "",
        update_text: "",
	},

    created: function () {
        this.getPosts();
        window.addEventListener("keyup", this.keyEvents);
    },

	methods: {
        keyEvents: function(event) {
            console.log(event.which);
            if (event.which == 68) {
                if (this.secret_keycode == "") {
                    this.secret_keycode = "D";
                } else {
                    this.secret_keycode = "";
                }
            } else if (event.which == 69) {
                if (this.secret_keycode == "D") {
                    this.secret_keycode = "DE";
                } else {
                    this.secret_keycode = "";
                }
            } else if (event.which == 76) {
                if (this.secret_keycode == "DE") {
                    this.secret_keycode = "DEL";
                } 
            }
            else {
                this.secret_keycode = "";
            }
            console.log(this.secret_keycode);
        },

        startEditing: function(post) {
            this.page = "edit";
            this.editing_post = post;
            this.update_title = post.title;
            this.update_author = post.author;
            this.update_category = post.category;
            this.update_image = post.image;
            this.update_text = post.text;
        },

        getPosts: function () {
            fetch(this.server_url+"/posts").then(function(res){
                res.json().then(function(data) {
                    console.log(data);
                    app.posts = data.posts;
                });
            });
        },

        newPost: function() {
            var new_post = {
                title: this.new_post_title,
                author: this.new_post_author,
                category: this.new_post_category,
                date: new Date(),
                image: this.new_post_image,
                text: this.new_post_text
            };
            fetch(this.server_url+"/posts", {
                method: "POST",
                headers: {"Content-type":"application/json"},
                body: JSON.stringify(new_post)
            }).then(function() {
                app.new_post_title = "";
                app.new_post_author = "";
                app.new_post_category = "all";
                app.new_post_image = "";
                app.new_post_text = "";
                app.getPosts();
                app.page = "blog";
            });
        },

        deletePost: function(post) {
            console.log(post.title);
            console.log(post._id);
            fetch(`${this.server_url}/posts/${post._id}`, {
                method: "DELETE"
            }).then(function(response) {
                if (response.status == 204) {
                    console.log("it worked");
                    app.getPosts();
                } else if (response.status == 400) {
                    response.json().then(function(data) {
                        alert(data.msg);
                    })
                }
            });
        },

        editPost: function (post) {
            var new_post = {
                title: this.update_title,
                author: this.update_author,
                category: this.update_category,
                date: new Date(),
                image: this.update_image,
                text: this.update_text
            };
            fetch(`${this.server_url}/posts/${post._id}`, {
                method: "PUT",
                headers: {"Content-type":"application/json"},
                body: JSON.stringify(new_post)
            }).then(function() {
                app.update_title = "";
                app.update_author = "";
                app.update_category = "all";
                app.update_image = "";
                app.update_text = "";
                app.getPosts();
                app.page = "blog";
            });
        },

	},

	computed: {
        sortedPosts: function() {
            if (this.selected_category == "all") {
                return this.posts;
            } else {
                var sorted_posts = this.posts.filter(function (post) {
                    return post.category == app.selected_category;
                });
                return sorted_posts;
            }
        },

        show_delete: function() {
            return this.secret_keycode == "DEL";
        },
	},
})

//when you click edit it vmodels the post text (index probably) and sets the new input things to the vmodel