const UserModel = require('../Models/user');

exports.register = async (req, res) => {
    try {
        const { name, email, photoUrl } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        let userExist = await UserModel.findOne({ email: email });
        if (!userExist) {
            userExist = await UserModel.create({
                name: name || "User",
                email: email,
                photoUrl: photoUrl || ""
            });
            return res.status(201).json({
                message: "User registered successfully",
                user: userExist
            });
        }

        return res.status(200).json({
            message: "Welcome Back",
            user: userExist
        });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};
