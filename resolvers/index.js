const { GraphQLDateTime } = require('graphql-iso-date');

const userResolver = require('./task')
const taskResolver = require('./user')

const customDateScalarResolver = {
    Date: GraphQLDateTime
}

module.exports = [
    userResolver,
    taskResolver,
    customDateScalarResolver
]