const users = [
    {
        id: "1",
        name: "John"
    },
    {
        id: "2",
        name: "Alice"
    }
];

const getUsers = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users
    });
};

const getUserById = (req, res) => {
    // const id = Number(req.params.id);
    const id = req.params.id;

    // const user = users.find(user => user.id === id);
    const user = users.find((user)=>{
        return user.id ===id;
    })

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user
    });
};

module.exports = {
    getUsers,
    getUserById
};