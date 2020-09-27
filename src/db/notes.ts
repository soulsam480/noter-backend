import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from "../seql"

class Note extends Model {
    public id!: string;
    public name!: string;
    public data!: object;
}
Note.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    tableName: 'notes',
    sequelize
})
export default Note