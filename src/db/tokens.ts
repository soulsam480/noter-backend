import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from "../seql"

class Token extends Model {
    tokenId: string;
    userId: string
}

Token.init({
    tokenId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "tokens",
    sequelize
})

Token.sync().then(() => {
    console.log("token is ready!!");
}).catch((err => {
    console.log(err);
}))

export default Token