import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../config.js";
import dotenv from "dotenv";

class ToolPaths extends Model { }
class ToolSPmatNo extends Model { }
class Tool_Files extends Model { }
class New_ToolSPmatNo extends Model { }
class Tools extends Model { }
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


Tools.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    tool_code: {
      type: DataTypes.STRING,
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    current_version: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    tool_name: {
      type: DataTypes.STRING,
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
    createdAt: true,
    updatedAt: "updateTimestamp",
  }
);

New_ToolSPmatNo.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    tool_code: {
      type: DataTypes.STRING,
    },
    version: {
      type: DataTypes.INTEGER,
    },
    list_num: {
      type: DataTypes.INTEGER,
    },
    sppicode_num: {
      type: DataTypes.INTEGER,

    },
    sppiccode: {
      type: DataTypes.STRING,
    },
    spmatNo: {
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
    createdAt: true,
    updatedAt: "updateTimestamp",
  }
);

Tool_Files.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    tool_code: {
      type: DataTypes.STRING,
    },
    version: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
    },
    list_num: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    createdAt: true,
    updatedAt: "updateTimestamp",
  }
);





export { ToolPaths, ToolSPmatNo, Tool_Files, New_ToolSPmatNo, Tools };
