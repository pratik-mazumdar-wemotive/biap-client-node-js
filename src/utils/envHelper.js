import dotenv from 'dotenv';
import path from 'path';

const loadEnvVariables = () => {    
    console.log("development mode!!!!")
    dotenv.config({ path: path.resolve(process.cwd(), `.env`) });
}

export default loadEnvVariables;