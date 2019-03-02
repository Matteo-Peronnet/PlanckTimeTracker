
export const getProjectById = (state, id) =>
    state.task.list.find((project) => project.projectId === parseInt(id))

export const getProjectName = (customer, projectId) =>
    customer.projects.find((project) => project.id === parseInt(projectId)).name
