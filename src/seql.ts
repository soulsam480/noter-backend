import { Sequelize } from "sequelize"


const sequelize = new Sequelize('postgresql://sambit:sambit@localhost:5432/nodecrud')



export default sequelize

