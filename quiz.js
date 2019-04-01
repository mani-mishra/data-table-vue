// https://engineering-application.britecore.com/in/frontend-developer
[
  104,
  116,
  116,
  112,
  115,
  58,
  47,
  47,
  101,
  110,
  103,
  105,
  110,
  101,
  101,
  114,
  105,
  110,
  103,
  45,
  97,
  112,
  112,
  108,
  105,
  99,
  97,
  116,
  105,
  111,
  110,
  46,
  98,
  114,
  105,
  116,
  101,
  99,
  111,
  114,
  101,
  46,
  99,
  111,
  109,
  47,
  113,
  117,
  105,
  122,
  47,
  115,
  97,
  97,
  115,
  100,
  97,
  115,
  100,
  108,
  102,
  108,
  102,
  108,
  115
]
  .map(el => String.fromCharCode(el))
  .join("");

// https://engineering-application.britecore.com/quiz/saasdasdlflfls

// Debugging Quiz
// Assuming you have already done "npm install fernet"
const fernet = require("./fernet");
const secret = new fernet.Secret(
  "TluxwB3fV_GWuLkR1_BzGs1Zk90TYAuhNMZP_0q4WyM="
);
// Oh no! The code is going over the edge! What are you going to do?
const token =
  "gAAAAABcon_hcc-Uz_3UozkX-xEOSU9Yt9ABRd40CVjTxSxXlf_YgcO7RDE4G6aStwBqUBwmD_mCU9pH6vhsCqffOPRFd0wiPY721wWmNqELG0q80oXKBy9uC_kQQvaoY71vGrS2DuBgGRneJeJmj-UtkX8v-u3Rb6dtc4m50EDfW-rExSUHLg-X0TzyHHOmle8HYWDCQBU4";
const fernetToken = new fernet.Token({ secret, token, ttl: 0 });
fernetToken.decode();

// Output is
// https://engineering-application.britecore.com/e/t1e119s3t/testMidLevelFrontendDeveloper
