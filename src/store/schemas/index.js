import { schema } from 'normalizr';

export const sprintSchema = new schema.Entity('sprints')
export const taskSchema = new schema.Entity('tasks')
export const supportTaskSchema = new schema.Entity('supportTasks')

export const projectSchema = new schema.Entity('projects', {
    sprints: [sprintSchema],
    tasks: [taskSchema],
    supportTasks: [supportTaskSchema]
})

export const customersSchema = new schema.Entity('customers', {
    projects: [projectSchema]
});
