import jwt from "jsonwebtoken";

export const genToken = (userId) => {
    try {
        const token = jwt.sign({ userId}, process.env.JWT_SECRET_KEY, {
            expiresIn: "27d",
        });
        //console.log(token)
        return token;
    } catch (error) {
        console.log("Token generation error:", error.message);
        return null;
    }
};

export const genToken1 = (email) => {
    try {
        const token = jwt.sign({email}, process.env.JWT_SECRET_KEY, {
            expiresIn: "27d",
        });
        //console.log(token)
        return token;
    } catch (error) {
        console.log("Token generation error:", error.message);
        return null;
    }
};