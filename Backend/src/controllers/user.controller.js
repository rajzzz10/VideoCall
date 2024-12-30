import { User } from "../models/user.model.js";
import httpStatus from 'http-status';
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const register = async (req, res) => {
    let { name, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: 'User already Exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name: name,
            username: username,
            password: hashedPassword
        })
        await newUser.save();
        return res.status(httpStatus.CREATED).json({ message: 'User registered successfully' })
    } catch (error) {
        return res.json({ message: `Something went wrong ${error}` });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ message: 'Please provide both username and password' })
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'No user Found' })
        };
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (isPasswordCorrect) {
            const token = crypto.randomBytes(20).toString('hex');
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token })
        }else{
            return res.status(httpStatus.UNAUTHORIZED).json({message : 'Invalid username Or password'})
        }
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong ${error}` })
    }
}
export {login , register};