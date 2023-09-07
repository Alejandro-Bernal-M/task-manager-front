const api= {
  login: `${process.env.NEXT_PUBLIC_API}/login`,
  users: `${process.env.NEXT_PUBLIC_API}/users`, // GET for all users, POST for create user
  user: (user_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}`, // GET for user, DELETE for delete user and PATCH for update user
  Tasks: (user_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/tasks`, // GET for all tasks, POST for create task
  Task: (user_id : string, task_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/tasks/${task_id}`, // DELETE for delete task and PATCH for update task
  groups: (user_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/groups`, // GET for all groups, POST for create group
  specificGroup: (user_id : string, group_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/groups/${group_id}`, // DELETE for delete group and PATCH for update group
  subGroups: (user_id : string, group_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/groups/${group_id}/subgroups`, // GET for all subgroups, POST for create subgroup
  specificSubgroup: (user_id : string, group_id : string, subgroup_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/groups/${group_id}/subgroups/${subgroup_id}`, // DELETE for delete subgroup and PATCH for update subgroup
  userGroups: (user_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/usergroups`, // GET for all userGroups, POST for create userGroup
  specificUserGroups: (user_id : string, assignation_id: number) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/usergroups/${assignation_id}`, // DELETE for deleting assignation
  invitations:(user_id :string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/invitations`, // GET for all invitations, POST for create invitation
  specificInvitation: (user_id:string, invitation_id: string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/invitations/${invitation_id}`, // PUT and DELETE
  assignments:(user_id:string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/assignments`, // GET for all the assingments, POST for create Assingments
  specificAssignment: (user_id: string, assignment_id: number) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/assignments/${assignment_id}` // DELETE for delete the assingment
}

export default api