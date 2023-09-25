import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    file(): any // Define the method signature here
    user?: any // Replace 'any' with the actual type of your user object
  }
}
