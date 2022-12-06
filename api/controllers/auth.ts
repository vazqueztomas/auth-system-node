import { NextFunction } from "express";

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { v4: uuid } = require('uuid');

const PORT = 8080;

const handleSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(400).json('El nombre, email y contraseña son obligatorios.');
  const duplicate = await User.findOne({ email });
  if (duplicate) return res.status(409).json('El registro ya existe.');

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationString = uuid();

    const viewHtml = `<!DOCTYPE html>
		<html lang="es">
			<head>
				<meta charset="utf-8">
				<title>HTML</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				</head>
				<body>
				<h3>¡Hola ${name}! Gracias por registrarte.</h3>
				<h2>Para verificar tu cuenta presioná el link: 
					<a href='https://localhost:${PORT}/verificar-email/${verificationString}'>Verificar cuenta</a>
				</h2>
				</body>
			</html>`;

    await sendEmail({
      to: email,
      from: {
        email: `${process.env.SENDING_EMAIL}`,
        name: ''
      },
      subject: 'Verificación de cuenta',
      html: viewHtml
    });

    const newUser = await User.create({ name, email, password: hashedPassword, verificationString });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json('No se pudo realizar el registro.');
  }
};


const handleVerify = async (req, res, next: NextFunction) => {
  try {
    const { email, verificationString } = req.body;
    let user = await User.findOne({ email });
    if (verificationString === user.verificationString) {
      user.isVerified = true;
      user = await user.save();
      return res.json(user);
    } else throw new Error();
  } catch (error) {
    console.error(error.message);
    return res.sendStatus(500);
  }
};


const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json('El email y la contraseña son obligatorios.');

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.status(401).json('No se encontró el usuario.');

  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);

    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "id": foundUser._id,
          "name": foundUser.name,
          "email": foundUser.email,
          "roles": roles
        }
      },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: '240s' }
    );

    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

    // Send authorization roles and access token to user
    const { id, name, email, isVerified, favorites } = foundUser;
    res.json({ userInfo: { id, name, email, isVerified, favorites, roles, accessToken } });

  } else {
    return res.status(401).json('No autorizado.');
  }
};


const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = '';
  await foundUser.save();

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  return res.sendStatus(204);
};


const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden 
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": decoded.username,
            "roles": roles
          }
        },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
      );
      return res.json({ userInfo: { email: foundUser.username, roles }, accessToken });
    }
  );
};


module.exports = { handleSignup, handleVerify, handleLogin, handleLogout, handleRefreshToken };