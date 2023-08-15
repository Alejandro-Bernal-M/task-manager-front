const api= {
  login: `${process.env.NEXT_PUBLIC_API}/login`,
  createUser: `${process.env.NEXT_PUBLIC_API}/users`,
  Tasks: (user_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/tasks`, // GET for all tasks, POST for create task
  Task: (user_id : string, task_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/tasks/${task_id}`, // DELETE for delete task and PATCH for update task
  Groups: (user_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/groups`, // GET for all groups, POST for create group
  SpecificGroup: (user_id : string, group_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/groups/${group_id}`, // DELETE for delete group and PATCH for update group
}

export default api