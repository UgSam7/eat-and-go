import jwt from 'jsonwebtoken';

export function generateJWT(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '60d' },
            (error, token) => {
                if (error) reject(error);
                else resolve(token);
            }
        );
    });
}

export function verifyJWT(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
            if (error) reject(error);
            else resolve(payload);
        });
    });
}
