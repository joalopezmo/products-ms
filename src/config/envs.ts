import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  // NODE_ENV: string;
  PORT: number;
  // MONGO_URI: string;
}

const envsSchema = joi
  .object({
    // NODE_ENV: joi.string().valid('development', 'production', 'test').required(),
    PORT: joi.number().required(),
    // MONGO_URI: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
};
