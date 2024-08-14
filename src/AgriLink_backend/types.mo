//types.mo AgriLink
import Time "mo:base/Time";
import Principal "mo:base/Principal";

module {
  public type User = {
    var id: Principal;
    var name: Text;
    var email: Text;
    var bio: Text;
    var profileImage: ?Text;
    var role: UserRole;
    var createdAt: Time.Time;
    var updatedAt: Time.Time;
    var accountBalance: Nat;
    var investments: ?[Text];
    var landNFTs: ?[Text];
  };

  public type ShareableUser = {
    id : Principal;
    name : Text;
    email : Text;
    accountBalance : Nat;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    bio : Text;
    profileImage : ?Text;
    role : UserRole;
    investments: ?[Text];
    landNFTs: ?[Text];
  };

  public type UserRole = {
    #Farmer;
    #Investor;
    #Admin;
    #Guest;
  };

  public type Project = {
    var id: Text;
    var name: Text;
    var description: Text;
    var owner: Principal;
    var fundingGoal: Nat;
    var currentFunding: Nat;
    var startDate: Time.Time;
    var endDate: Time.Time;
    var status: ProjectStatus;
    var updates: [ProjectUpdate];
    var investors: [Investment];
  };

  public type ProjectStatus = {
    #Draft;
    #Active;
    #Funded;
    #Completed;
    #Cancelled;
  };

  public type ProjectUpdate = {
    id: Text;
    content: Text;
    timestamp: Time.Time;
  };

  public type Investment = {
    id: Text;
    projectId: Text;
    investor: Principal;
    amount: Nat;
    timestamp: Time.Time;
  };

  public type Post = {
    id: Text;
    author: Principal;
    content: Text;
    projectId: ?Text;
    likes: Nat;
    comments: [Comment];
    timestamp: Time.Time;
  };
  public type Comment = {
    id: Text;
    author: Principal;
    content: Text;
    timestamp: Time.Time;
  };

  public type LandParcel = {
    id: Text;
    owner: Principal;
    location: Location;
    size: Nat;
    status: LandStatus;
  };

  public type Location = {
    latitude: Float;
    longitude: Float;
  };

  public type LandStatus = {
    #Available;
    #InUse;
    #Reserved;
  };

  public type Statistics = {
    totalUsers: Nat;
    totalProjects: Nat;
    totalInvestments: Nat;
    totalFundingRaised: Nat;
    successfulProjects: Nat;
    averageProjectFunding: Nat;
  };
};