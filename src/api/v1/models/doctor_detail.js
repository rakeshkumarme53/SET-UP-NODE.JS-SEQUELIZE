const { Model } = require('sequelize');
module.exports = function (sequelize, DataTypes) {

    class DoctorDetail extends Model {
        static associate({User }) {
            // this.belongsTo(User, { foreignKey: 'user_id' });
            // this.belongsTo(User,{foreignKey: 'user_id'});
        }
    }
    
    DoctorDetail.init({
        headline: {
            type: DataTypes.STRING,
            allowNull: false
        },
        degree: {
            type: DataTypes.STRING,
        },
        college_name: {
            type: DataTypes.STRING,
        },
        year_of_completion: {
            type: DataTypes.STRING,
        },
        year_of_experience: {
            type: DataTypes.STRING,
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: true
        },
        qualification: {
            type: DataTypes.STRING,
            allowNull: false
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        consultation_fees: {
            type: DataTypes.DOUBLE,
            allowNull: true
        }, followup_fees: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        document_type: {
            type: DataTypes.STRING
        },
        identity: {
            type: DataTypes.TEXT
        },
        medical_registration: {
            type: DataTypes.TEXT
        },
        signature: {
            type: DataTypes.TEXT,
            allowNull:true
        },
        establishment_proof: {
            type: DataTypes.TEXT
        },
        video_consult: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        completed_step:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:1
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
        {
            sequelize,
            tableName: 'doctor_detail',
            modelName: 'DoctorDetail',
            underscored: true
        }
    );
    return DoctorDetail;
}