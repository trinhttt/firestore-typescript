import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import firebase from 'firebase'
// import * as serviceAccount from 'serviceAccount.json'
// const serviceAccount = require('./serviceAccount')
var firebaseConfig = {
  apiKey: "AIzaSyBD_xxSRdgGhx_IB0x00Rj7Zv2B2xDtShY",
  authDomain: "vietnam-api-demo.firebaseapp.com",
  projectId: "vietnam-api-demo",
  storageBucket: "vietnam-api-demo.appspot.com",
  messagingSenderId: "527901777370",
  appId: "1:527901777370:web:1bf0aff72852825172f4e3",
  measurementId: "G-W8PMH70B80"
}
// var serviceAccount = {
//   "type": "service_account",
//   "project_id": "",
//   "private_key_id": "",
//   "private_key": "-----BEGIN PRIVATE KEY-----\n\n-----END PRIVATE KEY-----\n",
//   "client_email": "",
//   "client_id": "",
//   "auth_uri": "",
//   "token_uri": "",
//   "auth_provider_x509_cert_url": "",
//   "client_x509_cert_url": ""
// }

firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDVRiyryEzBPniW\n/vgVmNTVXb/yXwMcJS4ZZF0flN3EFlrhqIwUA+NTOPFGf2WLAZQ+qqI5tSmPho7l\nXQOnBfaBz5i6o/560Y9BQFAGlXcBHcODve0qDZ1kXvmIGFSd36vI0vFbf5REoD1Q\niHKAeN6vH5aAyLoWcxjfbuc+BX/y5tfFY3A21r1vmms+ZM8PcqzQBXfjL+5rexA3\nps6VtwhIACOZ8EXqok+jJopp0Y1kfb5Wcr/0x4Tgdap/97nm3o+n8s+ZBHJAX/y/\nBlUN9lLFQuK+qnp527nzVFtpL0iw5o8IBi7skfFDjTOLdLpPSn5GD9rueNeW8zVx\naNS/MGL/AgMBAAECggEAATIpCvePEqBWjcY1Pu3B98ZUTrggrNY6iXLqIMS1b6WO\nceh/jJcu/ab6l2IcgCiMm8NaMIenCYKAJ6IbZKLgbH7tBNLpmOe27W8+Y6MP7UYs\n8/6rJ0q3QLpVnOFCDDaWYIRqTRCMlMvvPBXfyn+jBAlhzywQ+xI/J/WXv13Jh2Oo\nXgVWm/FQi2M0910Mb9bF1dDCTrSuD0TnhWhMtfY1aKbhwL67+nej1s2Iy7qF/D/1\n9+wsn8V+L+WFPKW0zkUOvixfA6oC9NiB2s+yPGjDaj7haiH/J2BUw+5DhTiRBjDP\n3Ul6YmMczk1YQROSbfh94zNds65JHT/FkYOSguLQ2QKBgQD9YsRF6/LqUqTtQRgo\nvZj2pRg2rY3/bTopx9TdBTtJgipp7TaYMjyJmUi11XglouDl1jV+zNe+NMT8F7UI\n1PZRLS8pa7O8iBqrD2rjqLwemDNKKXdXYw90n+mpaA2p0wT4QZjifQzjZ1myI0zp\nBprCLXi3kK5hLnt6EN7GEy7btwKBgQDXeXdeV3tYBcvMTsqGWsKaPgSBUjOvo19Z\nKIsoELayrfKzUSGqGMtDd1IX92Rm3o8cJvmm5a2gyHRVIDO/Xe6BMTGUvMvsgJF0\n/Zc6/LzwQFwcOw1SMqwg65pyRrsMwAqmYS58Pxu7uJHa+YR1//Jb1Nf9Xn8GO0So\nt91IhMTC+QKBgQCNP2J0K9xk3R8NFs1V4KMFUvDVghf2/DeBFOFHN+RdzM7B77cQ\nTmjKt4T9v/rS2CIQXUHC5oOZhycL9Fc5jiWlCNASgfRWs3RSSSznrab4UxW8ULMz\nJoh2FbKWeeer9HL/xOlp0BXAKluo3t6/w6u/dMOnaGKcz+GLIR5eQlFLrwKBgCwS\nx0y/vhXyEY53q0sx804TU16UTsglNZKKDXSjfosrs1HkTWt6aNEi7eLDEoFMEp+i\nhTwTDKGvfsQOsyb4cplwU4Dl4Rw97AKvACjrm0XVFEId/gqLHNQa/NtVBluESGlh\nxV1alzSdew/8K5DrSkpoTcmgc4D1zIRqH1P+/DQZAoGAD7rkq8QorbO1YRr6Ueao\n/f2/a3wHPa8N8sKhgOK9MoZ9vKsbwjY2MBXgkmlgvgn21eyCkxO/8zv4sMnEm/BC\nq569OpH/KFOFt4hPhoTeBAatFI5kGEtxAjph6No3Z4txCTzwjCbTE4mKd9LVCA41\nG+j82fxWbMLb1yuM3PAdBEE=\n-----END PRIVATE KEY-----\n',//avoid invalid PEM format
    projectId: functions.config().project.id,
    clientEmail: functions.config().client.email
  }),
  databaseURL: 'https://vietnam-api-demo.firebaseio.com'
})

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as object),
//   databaseURL: 'https://vietnam-api-demo.firebaseio.com'
// });

const db = admin.firestore()
export { admin, db, firebase }