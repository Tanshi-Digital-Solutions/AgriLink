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
        public shared(msg) func createPost(data: CreatePostData) : async Result.Result<Text, Text> {
            let postId = "post_" # Nat.toText(nextPostId);
            nextPostId += 1;

            let newPost : Types.Post = {
                id = postId;
                author = msg.caller;
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
        public query func getPost(postId: Text) : async Result.Result<Types.Post, Text> {
            switch (postMap.get(postId)) {
                case (?post) { #ok(post) };
                case null { #err("Post not found") };
            };
        };

        // Add a comment to a post
        /*public shared(msg) func addComment(data: CreateCommentData) : async Result.Result<Text, Text> {
            switch (postMap.get(data.postId)) {
                case (?post) {
                    let newComment : Types.Comment = {
                        id = "comment_" # Nat.toText(post.comments.size());
                        author = msg.caller;
                        content = data.content;
                        timestamp = Time.now();
                    };
                    post.comments := Array.append(post.comments, [newComment]);
                    postMap.put(data.postId, post);
                    #ok("Comment added successfully")
                };
                case null { #err("Post not found") };
            };
        };*/

        // Like a post
        /*public shared(msg) func likePost(postId: Text) : async Result.Result<Nat, Text> {
            switch (postMap.get(postId)) {
                case (?post) {
                    post.likes += 1;
                    postMap.put(postId, post);
                    #ok(post.likes)
                };
                case null { #err("Post not found") };
            };
        };*/

        // Get all posts (feed)
        public query func getAllPosts() : async [Types.Post] {
            Iter.toArray(postMap.vals())
        };

        // Get posts for a specific project
        public query func getProjectPosts(projectId: Text) : async [Types.Post] {
            Array.filter(Iter.toArray(postMap.vals()), func (post: Types.Post) : Bool {
                switch (post.projectId) {
                    case (?id) { id == projectId };
                    case null { false };
                }
            })
        };

        // Get posts by a specific user
        public query func getUserPosts(userId: Principal) : async [Types.Post] {
            Array.filter(Iter.toArray(postMap.vals()), func (post: Types.Post) : Bool {
                post.author == userId
            })
        };

        // Search posts by content
        public query func searchPosts(search: Text) : async [Types.Post] {
            Array.filter(Iter.toArray(postMap.vals()), func (post: Types.Post) : Bool {
                Text.contains(post.content, #text search)
            })
        };

        // Get trending posts (based on likes and recency)
        /*public query func getTrendingPosts(limit: Nat) : async [Types.Post] {
            let allPosts = Iter.toArray(postMap.vals());
            let sortedPosts = Array.sort(allPosts, func (a: Types.Post, b: Types.Post) : Order {
                let scoreA = a.likes + (Time.now() - a.timestamp) / (1000000000 * 3600); // 1 hour in nanoseconds
                let scoreB = b.likes + (Time.now() - b.timestamp) / (1000000000 * 3600);
                if (scoreA > scoreB) { #less } else if (scoreA < scoreB) { #greater } else { #equal }
            });
            Array.slice(sortedPosts, 0, limit)
        };*/

        // For upgrade persistence
        var postEntries : [(Text, Types.Post)] = [];

        public func preupgrade() {
            postEntries := Iter.toArray(postMap.entries());
        };

        public func postupgrade() {
            postMap := TrieMap.fromEntries(postEntries.vals(), Text.equal, Text.hash);
        };
    };
};