import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    file(): any // Define the method signature here
  }
}
