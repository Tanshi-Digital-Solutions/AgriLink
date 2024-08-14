// users.mo
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Types "types";

module {
    public type UpdateUserData = {
            name : ?Text;
            email : ?Text;
            bio : ?Text;
            profileImage : ?Text;
        };
    public class Users() {
        private var userMap = TrieMap.TrieMap<Principal, Types.User>(Principal.equal, Principal.hash);

        public type UpdateUserData = {
            name : ?Text;
            email : ?Text;
            bio : ?Text;
            profileImage : ?Text;
        };

        public shared(msg) func createUser(name: Text, email: Text, role: Types.UserRole) : async Result.Result<Text, Text> {
            let principal = msg.caller;
            switch (userMap.get(principal)) {
                case (?_) { #err("User already exists") };
                case null {
                    let newUser : Types.User = {
                        var id = principal;
                        var name = name;
                        var email = email;
                        var accountBalance = 0;
                        var createdAt = Time.now();
                        var updatedAt = Time.now();
                        var bio = "";
                        var profileImage = null;
                        var role = role;
                        var investments = ?[];
                        var landNFTs = ?[];
                    };
                    userMap.put(principal, newUser);
                    #ok("User created successfully")
                };
            };
        };

        public shared(msg) func getUser() : async Result.Result<Types.ShareableUser, Text> {
            switch (userMap.get(msg.caller)) {
                case (?user) { 
                    #ok(toShareableUser(user))
                };
                case null { #err("User not found") };
            };
        };

        public shared(msg) func updateUser(data: UpdateUserData) : async Result.Result<Text, Text> {
            switch (userMap.get(msg.caller)) {
                case (?user) {
                    user.name := switch (data.name) { case (?n) { n }; case null { user.name } };
                    user.email := switch (data.email) { case (?e) { e }; case null { user.email } };
                    user.bio := switch (data.bio) { case (?b) { b }; case null { user.bio } };
                    user.profileImage := switch (data.profileImage) { case (?p) { ?p }; case null { user.profileImage } };
                    user.updatedAt := Time.now();
                    userMap.put(msg.caller, user);
                    #ok("User updated successfully")
                };
                case null { #err("User not found") };
            };
        };

        public shared(msg) func deposit(amount: Nat) : async Result.Result<Nat, Text> {
            switch (userMap.get(msg.caller)) {
                case (?user) {
                    user.accountBalance += amount;
                    user.updatedAt := Time.now();
                    userMap.put(msg.caller, user);
                    #ok(user.accountBalance)
                };
                case null { #err("User not found") };
            };
        };

        public shared(msg) func withdraw(amount: Nat) : async Result.Result<Nat, Text> {
            switch (userMap.get(msg.caller)) {
                case (?user) {
                    if (user.accountBalance < amount) {
                        #err("Insufficient balance")
                    } else {
                        user.accountBalance -= amount;
                        user.updatedAt := Time.now();
                        userMap.put(msg.caller, user);
                        #ok(user.accountBalance)
                    }
                };
                case null { #err("User not found") };
            };
        };

        public shared(msg) func getBalance() : async Result.Result<Nat, Text> {
            switch (userMap.get(msg.caller)) {
                case (?user) { #ok(user.accountBalance) };
                case null { #err("User not found") };
            };
        };

        public query func getAllUsers() : async [Types.ShareableUser] {
            Iter.toArray(Iter.map(userMap.vals(), toShareableUser))
        };

        public shared(msg) func loginWithII() : async Result.Result<Types.ShareableUser, Text> {
            switch (userMap.get(msg.caller)) {
                case (?user) {
                    #ok(toShareableUser(user))
                };
                case null {
                    #err("User not found. Please create an account first.")
                };
            };
        };

        private func toShareableUser(user: Types.User) : Types.ShareableUser {
            {
                id = user.id;
                name = user.name;
                email = user.email;
                accountBalance = user.accountBalance;
                createdAt = user.createdAt;
                updatedAt = user.updatedAt;
                bio = user.bio;
                profileImage = user.profileImage;
                role = user.role;
                investments = user.investments;
                landNFTs = user.landNFTs;
            }
        };

        // For upgrade persistence
        var userEntries : [(Principal, Types.User)] = [];

        public func preupgrade() {
            userEntries := Iter.toArray(userMap.entries());
        };

        public func postupgrade() {
            userMap := TrieMap.fromEntries(userEntries.vals(), Principal.equal, Principal.hash);
        };
    };
};