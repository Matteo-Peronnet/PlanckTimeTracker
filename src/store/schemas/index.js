import { schema } from 'normalizr';

export const usTaskSchema = new schema.Entity('usTasks')
export const taskSchema = new schema.Entity('tasks')
export const supportTaskSchema = new schema.Entity('supportTasks')

export const userStorySchema = new schema.Entity('userStories', {
    tasks: [usTaskSchema]
})
export const sprintSchema = new schema.Entity('sprints', {
    userStories: [userStorySchema]
})

export const projectSchema = new schema.Entity('projects', {
    sprints: [sprintSchema],
    tasks: [taskSchema],
    supportTasks: [supportTaskSchema]
})

export const customersSchema = new schema.Entity('customers', {
    projects: [projectSchema]
});
