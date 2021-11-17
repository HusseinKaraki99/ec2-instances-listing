import {
    BaseService
} from "./base_service";

export class IntanceService extends BaseService {

    constructor() {
        super();
        this.tableName = "Instances";
    }

    getInstances() {
        return this.connection.select({
            from: this.tableName,
        })
    }

    addInstances(instance) {
        return this.connection.insert({
            into: this.tableName,
            values: [instance],
            return: true
        })
    }

    getIntanceById(id) {
        return this.connection.select({
            from: this.tableName,
            where: {
                id: id
            }
        })
    }

    updateInstanceById(id, updateData) {
        return this.connection.update({
            in: this.tableName,
            set: updateData,
            where: {
                id: id
            }
        })
    }
}