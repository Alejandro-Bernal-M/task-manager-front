const api= {
  login: `${process.env.NEXT_PUBLIC_API}/login`,
  createUser: `${process.env.NEXT_PUBLIC_API}/users`,
  loadTasks: (user_id : string) => `${process.env.NEXT_PUBLIC_API}/users/${user_id}/tasks`,
}

export default api