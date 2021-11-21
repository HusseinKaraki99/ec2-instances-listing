import { DATA_TYPE, Connection } from 'jsstore';
/* eslint import/no-webpack-loader-syntax: off */
;
const getWorkerPath = () => {
    if (process.env.NODE_ENV === 'development') {
        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js");

    }
    else {

        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js");
    }
};

const workerPath = getWorkerPath().default;
export const idbCon = new Connection(new Worker(workerPath));
export const dbname = 'instances';

export const getDatabase = () => {
    const tblInstance = {
        name: 'Instances',
        columns: {
            id: {
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                notNull: true,
                dataType: DATA_TYPE.String
            },
            color: {
                dataType: DATA_TYPE.String,
                default: null

            },
            ram: {
                notNull: true,
                dataType: DATA_TYPE.Number
            },
            cpu: {
                notNull: false,
                dataType: DATA_TYPE.Number
            },
            pricing: {
                notNull: true,
                dataType: DATA_TYPE.Object
            },


        }
    };
    const dataBase = {
        name: dbname,
        tables: [tblInstance]
    };
    return dataBase;
};


