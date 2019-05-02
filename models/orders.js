module.exports = (sequelize, Sequelize) => {
    const Stocks = sequelize.define('Stocks', {
          id: {
              type: Sequelize.INTEGER(11),
              autoIncrement: true,
              primaryKey: true,
              allowNull: false,
              unique: true,
          },
          sku: {
              type: Sequelize.STRING(255),
              field: 'sku'
          },
          price: {
              type: Sequelize.INTEGER(11),
              field: 'price'
          },
          stock: {
              type: Sequelize.INTEGER(11),
              field: 'stock'
          },
          createdAt: {
              type: 'TIMESTAMP',
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
              field: 'created_at'
          },
          updatedAt: {
              type: 'TIMESTAMP',
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
              field: 'updated_at'
          }
      }, {
          freezeTableName: true,
          underscored: true,
          tableName: 'stocks'
      });
    
      return Stocks;
  };