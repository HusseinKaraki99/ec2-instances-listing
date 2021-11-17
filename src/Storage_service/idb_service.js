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

const getDatabase = () => {
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
                default: "white"

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

export const initJsStore = (data) => {

    const dataBase = getDatabase();
    idbCon.initDb(dataBase).then(isCreated => {
        if (isCreated) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                if (JSON.stringify(element.pricing) !== '{}') {
                    const instance = {
                        name: element.pretty_name,
                        ram: element.memory,
                        cpu: element.vCPU,
                        pricing: element.pricing,
                        color: "white",
                    }
                    idbCon.insert({
                        into: "Instances",
                        values: [instance],
                        return: true
                    })
                }
            }
        }
        else {
            console.log("db opened");
        }
    })
        .catch((err) => console.log(err))

}