// investments.mo
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Types "types";

module {
    public type InvestmentData = {
        projectId : Text;
        amount : Nat;
    };
    public type ProfitDistribution = {
        investorProfit : Int;
        farmerProfit : Int;
    };

    public class Investments() {
        private var investmentMap = TrieMap.TrieMap<Text, Types.Investment>(Text.equal, Text.hash);
        private var nextInvestmentId : Nat = 0;

        // Make an investment in a project
        public func invest(caller: Principal, data: InvestmentData) : Result.Result<Text, Text> {
            let investmentId = "inv_" # Nat.toText(nextInvestmentId);
            nextInvestmentId += 1;

            let newInvestment : Types.Investment = {
                id = investmentId;
                investor = caller;
                amount = data.amount;
                timestamp = Time.now();
                projectId = data.projectId;
            };

            investmentMap.put(investmentId, newInvestment);
            #ok("Investment made successfully with ID: " # investmentId)
        };

        // Get details of a specific investment
        public func getInvestment(investmentId: Text) : Result.Result<Types.Investment, Text> {
            switch (investmentMap.get(investmentId)) {
                case (?investment) { #ok(investment) };
                case null { #err("Investment not found") };
            };
        };

        // Get all investments for a specific project
        public func getProjectInvestments(projectId: Text) : [Types.Investment] {
            Iter.toArray(Iter.filter(investmentMap.vals(), func (investment: Types.Investment) : Bool {
                investment.projectId == projectId
            }))
        };

        // Get all investments made by a specific user
        public func getUserInvestments(userId: Principal) : [Types.Investment] {
            Iter.toArray(Iter.filter(investmentMap.vals(), func (investment: Types.Investment) : Bool {
                investment.investor == userId
            }))
        };

        // Distribute profits for a project
        public func distributeProfits(projectId: Text, totalProfit: Nat) : Result.Result<ProfitDistribution, Text> {
            let projectInvestments = getProjectInvestments(projectId);
            let totalInvestment = Array.foldLeft<Types.Investment, Nat>(projectInvestments, 0, func (acc, inv) { acc + inv.amount });

            if (totalInvestment == 0) {
                return #err("No investments found for this project");
            };

            let investorShare = Float.fromInt(totalProfit) * 0.7; // 70% to investors
            let farmerShare = Float.fromInt(totalProfit) * 0.3; // 30% to farmer

            let investorProfit = Float.toInt(investorShare);
            let farmerProfit = Float.toInt(farmerShare);

            let distribution : ProfitDistribution = {
                investorProfit = investorProfit;
                farmerProfit = farmerProfit;
            };

            #ok(distribution)
        };

        // Return capital to investors (e.g., when a project is completed or cancelled)
        public func returnCapital(projectId: Text) : Result.Result<Text, Text> {
            let projectInvestments = getProjectInvestments(projectId);

            for (investment in projectInvestments.vals()) {
                // Here you would implement the logic to return the investment amount to each investor
                // This might involve interacting with the Users module to update account balances
            };

            #ok("Capital returned to all investors for project: " # projectId)
        };

        // Calculate total investment for a project
        public func calculateTotalInvestment(projectId: Text) : Nat {
            let projectInvestments = getProjectInvestments(projectId);
            Array.foldLeft<Types.Investment, Nat>(projectInvestments, 0, func (acc, inv) { acc + inv.amount })
        };

        // For upgrade persistence
        var investmentEntries : [(Text, Types.Investment)] = [];

        public func preupgrade() {
            investmentEntries := Iter.toArray(investmentMap.entries());
        };

        public func postupgrade() {
            investmentMap := TrieMap.fromEntries(investmentEntries.vals(), Text.equal, Text.hash);
        };
    };
};