import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Types "types";
import UsersModule "users";
import InvestmentsModule "investments";
import SocialModule "social";
import ProjectsModule "project";
import LandNFTsModule "land";

actor class AgriLink() = this {
    private let users = UsersModule.Users();
    private let investments = InvestmentsModule.Investments();
    private let social = SocialModule.Social();
    private let projects = ProjectsModule.Projects();
    private let landNFTs = LandNFTsModule.LandNFTs();

    // User Management
    public shared(msg) func createUser(name: Text, email: Text, role: Types.UserRole) : async Result.Result<Text, Text> {
        await users.createUser(name, email, role)
    };

    public shared(msg) func getUser() : async Result.Result<Types.ShareableUser, Text> {
        await users.getUser()
    };

    public shared(msg) func updateUser(data: UsersModule.UpdateUserData) : async Result.Result<Text, Text> {
        await users.updateUser(data)
    };

    public shared(msg) func deposit(amount: Nat) : async Result.Result<Nat, Text> {
        await users.deposit(amount)
    };

    public shared(msg) func withdraw(amount: Nat) : async Result.Result<Nat, Text> {
        await users.withdraw(amount)
    };

    public shared(msg) func getBalance() : async Result.Result<Nat, Text> {
        await users.getBalance()
    };

    public func getAllUsers() : async [Types.ShareableUser] {
        await users.getAllUsers()
    };

    public shared(msg) func loginWithII() : async Result.Result<Types.ShareableUser, Text> {
        await users.loginWithII()
    };

    // Investment Management
    public shared(msg) func invest(data: InvestmentsModule.InvestmentData) : async Result.Result<Text, Text> {
        await investments.invest(data)
    };

    public func getInvestment(investmentId: Text) : async Result.Result<Types.Investment, Text> {
        await investments.getInvestment(investmentId)
    };

    public func getProjectInvestments(projectId: Text) : async [Types.Investment] {
        await investments.getProjectInvestments(projectId)
    };

    public func getUserInvestments(userId: Principal) : async [Types.Investment] {
        await investments.getUserInvestments(userId)
    };

    public func distributeProfits(projectId: Text, totalProfit: Nat) : async Result.Result<InvestmentsModule.ProfitDistribution, Text> {
        await investments.distributeProfits(projectId, totalProfit)
    };

    public func returnCapital(projectId: Text) : async Result.Result<Text, Text> {
        await investments.returnCapital(projectId)
    };

    public func calculateTotalInvestment(projectId: Text) : async Nat {
        await investments.calculateTotalInvestment(projectId)
    };

    // Social Features
    public shared(msg) func createPost(data: SocialModule.CreatePostData) : async Result.Result<Text, Text> {
        await social.createPost(data)
    };

    public func getPost(postId: Text) : async Result.Result<Types.Post, Text> {
        await social.getPost(postId)
    };

    public func getAllPosts() : async [Types.Post] {
        await social.getAllPosts()
    };

    public func getProjectPosts(projectId: Text) : async [Types.Post] {
        await social.getProjectPosts(projectId)
    };

    public func getUserPosts(userId: Principal) : async [Types.Post] {
        await social.getUserPosts(userId)
    };

    public func searchPosts(search: Text) : async [Types.Post] {
        await social.searchPosts(search)
    };

    // Project Management
    public shared(msg) func createProject(name: Text, description: Text, fundingGoal: Nat, startDate: Time.Time, endDate: Time.Time) : async Result.Result<Text, Text> {
        await projects.createProject(name, description, fundingGoal, startDate, endDate)
    };

    public shared(msg) func getProject(projectId: Text) : async Result.Result<ProjectsModule.ShareableProject, Text> {
        await projects.getProject(projectId)
    };

    public shared(msg) func updateProject(projectId: Text, data: ProjectsModule.UpdateProjectData) : async Result.Result<Text, Text> {
        await projects.updateProject(projectId, data)
    };

    public shared(msg) func addProjectUpdate(projectId: Text, content: Text) : async Result.Result<Text, Text> {
        await projects.addProjectUpdate(projectId, content)
    };

    public shared(msg) func fundProject(projectId: Text, amount: Nat) : async Result.Result<Nat, Text> {
        await projects.fundProject(projectId, amount)
    };

    public func getAllProjects() : async [ProjectsModule.ShareableProject] {
        await projects.getAllProjects()
    };

    public func getUserProjects(userId: Principal) : async [ProjectsModule.ShareableProject] {
        await projects.getUserProjects(userId)
    };

    // LandNFT Management
    public func createLandNFT(data: LandNFTsModule.CreateLandNFTData) : async Result.Result<Text, Text> {
        await landNFTs.createLandNFT(data)
    };

    public func getLandNFT(nftId: Text) : async Result.Result<Types.LandParcel, Text> {
        await landNFTs.getLandNFT(nftId)
    };

    public shared(msg) func updateLandNFT(nftId: Text, data: LandNFTsModule.UpdateLandNFTData) : async Result.Result<Text, Text> {
        await landNFTs.updateLandNFT(nftId, data)
    };

    public shared(msg) func transferLandNFT(nftId: Text, newOwner: Principal) : async Result.Result<Text, Text> {
        await landNFTs.transferLandNFT(nftId, newOwner)
    };

    public func getUserLandNFTs(userId: Principal) : async [Types.LandParcel] {
        await landNFTs.getUserLandNFTs(userId)
    };

    public func getAllLandNFTs() : async [Types.LandParcel] {
        await landNFTs.getAllLandNFTs()
    };

    // System Upgrade
    system func preupgrade() {
        users.preupgrade();
        investments.preupgrade();
        social.preupgrade();
        projects.preupgrade();
        landNFTs.preupgrade();
    };

    system func postupgrade() {
        users.postupgrade();
        investments.postupgrade();
        social.postupgrade();
        projects.postupgrade();
        landNFTs.postupgrade();
    };
};