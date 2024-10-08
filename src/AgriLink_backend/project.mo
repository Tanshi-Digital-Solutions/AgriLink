import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Types "types";

module {
    public type UpdateProjectData = {
        name : ?Text;
        description : ?Text;
        fundingGoal : ?Nat;
        startDate : ?Time.Time;
        endDate : ?Time.Time;
        status : ?Types.ProjectStatus;
    };

    public type ShareableProject = {
        id : Text;
        name : Text;
        description : Text;
        owner : Principal;
        fundingGoal : Nat;
        currentFunding : Nat;
        startDate : Time.Time;
        endDate : Time.Time;
        status : Types.ProjectStatus;
        updates : [Types.ProjectUpdate];
        investors : [Types.Investment];
    };

    public class Projects() {
        private var projectMap = TrieMap.TrieMap<Text, Types.Project>(Text.equal, Text.hash);
        private var nextProjectId : Nat = 0;

        public func createProject(caller: Principal, name: Text, description: Text, fundingGoal: Nat, startDate: Time.Time, endDate: Time.Time) : async Result.Result<Text, Text> {
            let owner = caller;
            let projectId = "proj_" # Nat.toText(nextProjectId);
            nextProjectId += 1;

            let newProject : Types.Project = {
                var id = projectId;
                var name = name;
                var description = description;
                var owner = owner;
                var fundingGoal = fundingGoal;
                var currentFunding = 0;
                var startDate = startDate;
                var endDate = endDate;
                var status = #Draft;
                var updates = [];
                var investors = [];
            };

            projectMap.put(projectId, newProject);
            #ok("Project created successfully with ID: " # projectId)
        };

        public func getProject(projectId: Text) : async Result.Result<ShareableProject, Text> {
            switch (projectMap.get(projectId)) {
                case (?project) {
                    let shareableProject : ShareableProject = {
                        id = project.id;
                        name = project.name;
                        description = project.description;
                        owner = project.owner;
                        fundingGoal = project.fundingGoal;
                        currentFunding = project.currentFunding;
                        startDate = project.startDate;
                        endDate = project.endDate;
                        status = project.status;
                        updates = project.updates;
                        investors = project.investors;
                    };
                    #ok(shareableProject)
                };
                case null { #err("Project not found") };
            }
        };

        public func updateProject(caller: Principal, projectId: Text, data: UpdateProjectData) : async Result.Result<Text, Text> {
            switch (projectMap.get(projectId)) {
                case (?project) {
                    if (project.owner != caller) {
                        #err("You are not the owner of this project")
                    } else {
                        project.name := switch (data.name) { case (?n) { n }; case null { project.name } };
                        project.description := switch (data.description) { case (?d) { d }; case null { project.description } };
                        project.fundingGoal := switch (data.fundingGoal) { case (?f) { f }; case null { project.fundingGoal } };
                        project.startDate := switch (data.startDate) { case (?s) { s }; case null { project.startDate } };
                        project.endDate := switch (data.endDate) { case (?e) { e }; case null { project.endDate } };
                        project.status := switch (data.status) { case (?st) { st }; case null { project.status } };
                        projectMap.put(projectId, project);
                        #ok("Project updated successfully")
                    }
                };
                case null { #err("Project not found") };
            }
        };

        public func addProjectUpdate(caller: Principal, projectId: Text, content: Text) : async Result.Result<Text, Text> {
            switch (projectMap.get(projectId)) {
                case (?project) {
                    if (project.owner != caller) {
                        #err("You are not the owner of this project")
                    } else {
                        let newUpdate : Types.ProjectUpdate = {
                            id = "upd_" # Int.toText(Time.now());
                            content = content;
                            timestamp = Time.now();
                        };
                        project.updates := Array.append([newUpdate], project.updates);
                        projectMap.put(projectId, project);
                        #ok("Update added successfully")
                    }
                };
                case null { #err("Project not found") };
            }
        };

        public func fundProject(caller: Principal, projectId: Text, amount: Nat) : async Result.Result<Nat, Text> {
            switch (projectMap.get(projectId)) {
                case (?project) {
                    let investor = caller;
                    project.currentFunding += amount;

                    let newInvestment : Types.Investment = {
                        id = "inv_" # Int.toText(Time.now());
                        investor = investor;
                        amount = amount;
                        timestamp = Time.now();
                        projectId = project.id
                    };

                    project.investors := Array.append([newInvestment], project.investors);
                    projectMap.put(projectId, project);
                    #ok(project.currentFunding)
                };
                case null { #err("Project not found") };
            }
        };

        public func getAllProjects() : async [ShareableProject] {
            Iter.toArray(Iter.map(projectMap.vals(), func (project: Types.Project) : ShareableProject {
                {
                    id = project.id;
                    name = project.name;
                    description = project.description;
                    owner = project.owner;
                    fundingGoal = project.fundingGoal;
                    currentFunding = project.currentFunding;
                    startDate = project.startDate;
                    endDate = project.endDate;
                    status = project.status;
                    updates = project.updates;
                    investors = project.investors;
                }
            }))
        };

        public func getUserProjects(userId: Principal) : async [ShareableProject] {
            Array.map(
                Array.filter(Iter.toArray(projectMap.vals()), func (project: Types.Project) : Bool {
                    project.owner == userId
                }),
                func (project: Types.Project) : ShareableProject {
                    {
                        id = project.id;
                        name = project.name;
                        description = project.description;
                        owner = project.owner;
                        fundingGoal = project.fundingGoal;
                        currentFunding = project.currentFunding;
                        startDate = project.startDate;
                        endDate = project.endDate;
                        status = project.status;
                        updates = project.updates;
                        investors = project.investors;
                    }
                }
            )
        };

        // For upgrade persistence
        var projectEntries : [(Text, Types.Project)] = [];

        public func preupgrade() {
            projectEntries := Iter.toArray(projectMap.entries());
        };

        public func postupgrade() {
            projectMap := TrieMap.fromEntries(projectEntries.vals(), Text.equal, Text.hash);
        };
    };
};