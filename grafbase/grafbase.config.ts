import { g, auth, config } from '@grafbase/sdk'

const User = g.model('User', {
  name: g.string().length({min: 2, max: 20}),
  email: g.string().unique(),
  avatarUrl: g.url(),
  description: g.string().optional(),
  githubUrl: g.url().optional(),
  LinkedInUrl: g.url().optional(),
  projects: g.relation(() => Project).list().optional(),
  // projects: g.relation(() => Project).optional(),  
  //.optional allows a user to sign up without error, also NO list, because list allows for multiple"projects"
})

const Project = g.model('Project',{
  title: g.string().length({min:3}),
  description: g.string(),
  image: g.url(),
  liveSiteUrl: g.url(),
  githubUrl: g.url().optional(),
  category: g.string().search(),
  createdBy: g.relation(() => User),
} )


export default config({
  schema: g

})
