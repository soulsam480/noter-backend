import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from "../seql"
import Note from './notes';
class User extends Model {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string
}
User.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "users",
    sequelize
})

User.hasMany(Note);
Note.belongsTo(User);

(async () => {
    await Note.sync().then(() => {
        User.sync().then(() => console.log("user ready")
        ).catch(err => console.log(err)
        )
    }).catch(err => console.log(err)
    )
})()
export default User