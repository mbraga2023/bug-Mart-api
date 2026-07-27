const users = require("../data/users");

function getUsers(page = 1, limit = 10) {
    page = Number(page);
    limit = Number(limit);

    const start = (page - 1) * limit;
    const end = start + limit;

    const data = users.slice(start, end);

    return {
        data,
        pagination: {
            page,
            limit,
            totalItems: users.length,
            totalPages: Math.ceil(users.length / limit),
            hasNext: end < users.length,
            hasPrevious: page > 1
        }
    };
}

function getUserById(id) {
    return users.find(user => user.id === Number(id));
}

module.exports = {
    getUsers,
    getUserById
};