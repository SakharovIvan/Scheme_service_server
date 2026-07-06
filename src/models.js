import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../config.js";
import dotenv from "dotenv";

class ToolPaths extends Model { }
class ToolSPmatNo extends Model { }

ToolPaths.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    tool_code: {
      type: DataTypes.STRING,
      unique: true,
    },
    tool_path: {
      type: DataTypes.STRING,
    },
    tool_name: {
      type: DataTypes.STRING,
      unique: true,
    },
    document_length: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      defaultValue: 1
    },
    picture_number: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
      defaultValue: 1
    }
  },
  {
    sequelize,
    createdAt: false,
    updatedAt: "updateTimestamp",
  }
);

ToolSPmatNo.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    sppicode_num: {
      type: DataTypes.INTEGER,

    },
    tool_code: {
      type: DataTypes.STRING,
    },
    spmatNo: {
      type: DataTypes.STRING,
    },
    sppiccode: {
      type: DataTypes.STRING,
    },
    spqty: {
      type: DataTypes.INTEGER,
    },
    top: {
      type: DataTypes.STRING
    },
    left: {
      type: DataTypes.STRING
    },
    diametr: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    createdAt: false,
    updatedAt: "updateTimestamp",
  }
);

export { ToolPaths, ToolSPmatNo };
