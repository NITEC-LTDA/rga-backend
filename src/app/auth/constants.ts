// TODO: USE ENV VARIABLES
console.log('AT_SECRET', process.env.AT_SECRET)
console.log('RT_SECRET', process.env.RT_SECRET)
export const jwtConstants = {
  atSecret: process.env.AT_SECRET,

  rtSecret: process.env.RT_SECRET,
}
