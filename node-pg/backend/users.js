const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER||'postgres',
    host: process.env.PG_HOST||'localhost',
    database: process.env.PG_DATABASE||'gamestore',
    password: process.env.PG_PASSWORD||'123',
    port: process.env.PG_PORT||5432,
});


const getAllUsers = async()=>{
    try {
        return await new Promise(function(resolve, reject) {
            pool.query('SELECT * FROM users', (error, results) => {
                if(error){
                    reject(error);
                }
                if(results&&results.rows){
                    resolve(results.rows);
                }else{
                    reject(new Error('No results found'));
                }
            });
        });
    }catch (error_1) {
        console.error(error_1);
        throw new Error("Internal Serwer Error");
    }
};

module.exports ={
    getAllUsers
}