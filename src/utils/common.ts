const api= {
  login: `${process.env.NEXT_PUBLIC_API}/login`,
  createUser: `${process.env.NEXT_PUBLIC_API}/users`,
  Tasks: (user_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/tasks`, // GET for all tasks, POST for create task
}

export default api