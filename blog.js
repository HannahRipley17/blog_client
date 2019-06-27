

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
        server_url: "https://blog-hripley.herokuapp.com",
	},

    created: function () {
        this.getPosts();
    },

	methods: {
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
        }
	},
})