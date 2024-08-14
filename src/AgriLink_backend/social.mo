// social.mo
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Types "types";

module {

    public type CreatePostData = {
        content : Text;
        projectId : ?Text;
    };

    public type CreateCommentData = {
        postId : Text;
        content : Text;
    };

    public class Social() {
        private var postMap = TrieMap.TrieMap<Text, Types.Post>(Text.equal, Text.hash);
        private var nextPostId : Nat = 0;

        // Create a new post
        public func createPost(caller:Principal, data: CreatePostData) : async Result.Result<Text, Text> {
            let postId = "post_" # Nat.toText(nextPostId);
            nextPostId += 1;

            let newPost : Types.Post = {
                id = postId;
                author = caller;
                content = data.content;
                projectId = data.projectId;
                likes = 0;
                comments = [];
                timestamp = Time.now();
            };

            postMap.put(postId, newPost);
            #ok("Post created successfully with ID: " # postId)
        };

        // Get a specific post
        public func getPost(postId: Text) : async Result.Result<Types.Post, Text> {
            switch (postMap.get(postId)) {
                case (?post) { #ok(post) };
                case null { #err("Post not found") };
            };
        };

        // Add a comment to a post
        public func addComment(caller: Principal, data: CreateCommentData) : async Result.Result<Text, Text> {
            switch (postMap.get(data.postId)) {
                case (?post) {
                    let newComment : Types.Comment = {
                        id = "comment_" # Nat.toText(post.comments.size());
                        author = caller;
                        content = data.content;
                        timestamp = Time.now();
                    };
                    let updatedPost : Types.Post = {
                        id = post.id;
                        author = post.author;
                        content = post.content;
                        projectId = post.projectId;
                        likes = post.likes;
                        comments = Array.append(post.comments, [newComment]);
                        timestamp = post.timestamp;
                    };
                    postMap.put(data.postId, updatedPost);
                    #ok("Comment added successfully")
                };
                case null { #err("Post not found") };
            };
        };

        // Like a post
        public func likePost(postId: Text) : async Result.Result<Nat, Text> {
            switch (postMap.get(postId)) {
                case (?post) {
                    let updatedPost : Types.Post = {
                        id = post.id;
                        author = post.author;
                        content = post.content;
                        projectId = post.projectId;
                        likes = post.likes + 1;
                        comments = post.comments;
                        timestamp = post.timestamp;
                    };
                    postMap.put(postId, updatedPost);
                    #ok(updatedPost.likes)
                };
                case null { #err("Post not found") };
            };
        };

        // Get all posts (feed)
        public func getAllPosts() : async [Types.Post] {
            Iter.toArray(postMap.vals())
        };

        // Get posts for a specific project
        public func getProjectPosts(projectId: Text) : async [Types.Post] {
            Array.filter(Iter.toArray(postMap.vals()), func (post: Types.Post) : Bool {
                switch (post.projectId) {
                    case (?id) { id == projectId };
                    case null { false };
                }
            })
        };

        // Get posts by a specific user
        public func getUserPosts(userId: Principal) : async [Types.Post] {
            Array.filter(Iter.toArray(postMap.vals()), func (post: Types.Post) : Bool {
                post.author == userId
            })
        };

        // Search posts by content
        public func searchPosts(search: Text) : async [Types.Post] {
            Array.filter(Iter.toArray(postMap.vals()), func (post: Types.Post) : Bool {
                Text.contains(post.content, #text search)
            })
        };

        // For upgrade persistence
        var postEntries : [(Text, Types.Post)] = [];

        public func preupgrade() {
            postEntries := Iter.toArray(postMap.entries());
        };

        public func postupgrade() {
            postMap := TrieMap.fromEntries(postEntries.vals(), Text.equal, Text.hash);
        };
    };
}