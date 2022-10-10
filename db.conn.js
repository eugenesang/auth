const {createPool}=require("mysql");
const {DB_PORT, DB_HOST, DB_USER, DB_PWD, MYSQL_DB}=process.env;
const pool=createPool({
    port:DB_PORT,
    host:DB_HOST,
    user:DB_USER,
    password:DB_PWD,
    database:MYSQL_DB,
    connectionLimit:10
});


function createUser({name, email, dateOfBirth, password, phone, id}, callback){
    pool.query(
        `insert into register(Name, email, DOB, password, phoneNumber, joined, id) values(?, ?, ?, ?, ?, ?, ?)`,
        [
            name, email, dateOfBirth, password, phone, new Date().toDateString(), id
        ],
        (err, result, fields)=>{
            if(err) return callback(err);
            return callback(null, result);
        }
    )
}

function getUsers(callback){
    pool.query(
        `select * from register`, 
        [],
        (err, result, fields)=>{
            if(err) return callback(err);
            return callback(null, result);
        }
    )
}


function getUserById(id, callback){
    pool.query(
        `select * from register where id = ?`,
        [id],
        (err, result)=>{
            if(err) return callback(err);
            return callback(null, result[0]);
        }
    )
}

function getUserByEmail(email, callback){
    pool.query(
        `select * from register where email = ?`,
        [email],
        (err, result)=>{
            if(err) return callback(err);
            return callback(null, result[0]);
        }
    )
}

function getUserByPhone(phone, callback){
    pool.query(
        `select * from register where phoneNumber = ?`,
        [phone],
        (err, result)=>{
            if(err) return callback(err);
            return callback(null, result[0]);
        }
    )
}
function updateUser({userName, email, password, profilePicture, id}, callback){
    pool.query(
        `update register set name = ?, email = ?, password = ?, profilePicture = ? where id = ?`,
        [
            userName, email, password, profilePicture, id
        ],
        (err, result)=>{
            if(err) return callback(err);
            return callback(null, result[0]);
        }
    )
}

function updateSpecificUserInfo({id, info, value}, callback){
    pool.query(
        `update register set ${info} = ? where id = ?`,
        [
            value,
            id
        ],
        (err, result )=>{
            if (err) return callback(err);
            return callback(null, result[0]);
        }
    )
}


function changePwd({id, pwd}, callback){
    pool.query(
        `update register set password = ? where id = ?`,
        [
            pwd,
            id
        ],
        (err, result )=>{
            if (err) return callback(err);
            return callback(null, result[0]);
        }
    )
}

function filterUsers({sieveKey, sieveValue}, callback){
    pool.query(
        `select * from register where ${sieveKey} = ?`,
        [
            sieveValue
        ],
        (err, result)=>{
            if(err) return callback(err);
            return callback(null, result);
        }
    )
}

function deleteUser(id, callback){
    pool.query(
        `delete from register where id = ?`,
        [
            id
        ],
        (err, result)=>{
            if(err) return callback(err);
            return callback(null, result);
        }
    )
}

function lastUid(callback){
    pool.query(
        `select lastId from stats`,
        [],
        (err, result)=>{
            if(err) return callback(err);
            //console.log(result[0]);
            return callback(null, result[0].lastId);
        }
    )
}
function updateId(id){
    pool.query(
        `update stats set lastId = ?`,
        [id],
        (err, result)=>{
            if(err) console.error(err);
        }
    )
}
function getUserDp(id, callback){
    pool.query(
        `select profilePicture from register where id = ?`,
        [id],
        (err, result)=>{
            if(err) return callback(err);
            return callback(null, result[0]);
        }
    )
}
module.exports={
    createUser, getUsers, updateUser, updateSpecificUserInfo, 
    changePwd, filterUsers, deleteUser, getUserById, lastUid, 
    updateId, getUserDp, getUserByEmail, getUserByPhone
}