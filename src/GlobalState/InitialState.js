// admin side 
export const InitialState = {
    isUserLogin : false,
    currentUser : {},
    organizations:[],
    OrgGoals:[],
    filterGoals:[],
    orgUsers:[],
    categories:[],
    categorySelected:[],
    withoutOrgGoals:[],
    withoutOrgUser:[],
    allSubmitGoals:[],
    withoutOrgSubmitGoals:[],
    withourOrgApprovedGoals:[],
    withourOrgDeclineGoals:[],
    allOrgApprovedGoals:[],
    allDeclineOrgGoals:[],
    reportGoals:[],
    fakeGoals:[],
    withoutOrgfakeGoal:[]
}

//  for user side 
export const InitiaUserSideState ={
    allGoalsOfOrg:[],
    allUserOrgOrWithoutOrg:[],
    selectedGoals:[],
    currentUserOrgId:'',
    submittedGoals:[],
    approvedGoals:[],
    declineGoals:[],
    pendingGoals:[],
    currentUserOfOrganization:[],
    feedGoals : [],
    reportGoals:[],
    postLikes:[],
    comments:[],
    allUsers:[]


}