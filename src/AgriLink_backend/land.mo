// land.mo NFT
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Types "types";

module {

    public type CreateLandNFTData = {
            owner : Principal;
            location : Types.Location;
            size : Nat;
        };

        public type UpdateLandNFTData = {
            owner : ?Principal;
            location : ?Types.Location;
            size : ?Nat;
            status : ?Types.LandStatus;
        };
    public class LandNFTs() {
        private var nftMap = TrieMap.TrieMap<Text, Types.LandParcel>(Text.equal, Text.hash);
        private var nextNftId : Nat = 0;

        

        // Create a new LandNFT
        public func createLandNFT(data: CreateLandNFTData) : async Result.Result<Text, Text> {
            let nftId = "land_" # Nat.toText(nextNftId);
            nextNftId += 1;

            let newLandNFT : Types.LandParcel = {
                id = nftId;
                owner = data.owner;
                location = data.location;
                size = data.size;
                status = #Available;
            };

            nftMap.put(nftId, newLandNFT);
            #ok("LandNFT created successfully with ID: " # nftId)
        };

        // Get details of a specific LandNFT
        public   func getLandNFT(nftId: Text) : async Result.Result<Types.LandParcel, Text> {
            switch (nftMap.get(nftId)) {
                case (?landNFT) { #ok(landNFT) };
                case null { #err("LandNFT not found") };
            };
        };

        // Update LandNFT details
        public shared(msg) func updateLandNFT(nftId: Text, data: UpdateLandNFTData) : async Result.Result<Text, Text> {
            switch (nftMap.get(nftId)) {
                case (?landNFT) {
                    if (landNFT.owner != msg.caller) {
                        #err("You are not the owner of this LandNFT")
                    } else {
                        let updatedLandNFT : Types.LandParcel = {
                            id = landNFT.id;
                            owner = switch (data.owner) { case (?o) { o }; case null { landNFT.owner } };
                            location = switch (data.location) { case (?l) { l }; case null { landNFT.location } };
                            size = switch (data.size) { case (?s) { s }; case null { landNFT.size } };
                            status = switch (data.status) { case (?st) { st }; case null { landNFT.status } };
                        };
                        nftMap.put(nftId, updatedLandNFT);
                        #ok("LandNFT updated successfully")
                    }
                };
                case null { #err("LandNFT not found") };
            };
        };

        // Transfer LandNFT ownership
        public shared(msg) func transferLandNFT(nftId: Text, newOwner: Principal) : async Result.Result<Text, Text> {
            switch (nftMap.get(nftId)) {
                case (?landNFT) {
                    if (landNFT.owner != msg.caller) {
                        #err("You are not the owner of this LandNFT")
                    } else {
                        let updatedLandNFT : Types.LandParcel = {
                            id = landNFT.id;
                            owner = newOwner;
                            location = landNFT.location;
                            size = landNFT.size;
                            status = landNFT.status;
                        };
                        nftMap.put(nftId, updatedLandNFT);
                        #ok("LandNFT transferred successfully to " # Principal.toText(newOwner))
                    }
                };
                case null { #err("LandNFT not found") };
            };
        };

        // Get all LandNFTs owned by a specific user
        public query func getUserLandNFTs(userId: Principal) : async [Types.LandParcel] {
            Iter.toArray(Iter.filter(nftMap.vals(), func (landNFT: Types.LandParcel) : Bool {
                landNFT.owner == userId
            }))
        };

        // Get all LandNFTs
        public query func getAllLandNFTs() : async [Types.LandParcel] {
            Iter.toArray(nftMap.vals())
        };

        // For upgrade persistence
        var nftEntries : [(Text, Types.LandParcel)] = [];

        public func preupgrade() {
            nftEntries := Iter.toArray(nftMap.entries());
        };

        public func postupgrade() {
            nftMap := TrieMap.fromEntries(nftEntries.vals(), Text.equal, Text.hash);
        };
    };
};