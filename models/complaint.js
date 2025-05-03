"use strict";
const { Model } = require("sequelize");
const turf = require("@turf/turf");
const jakartaRegions = require("../lib/jakarta.json");

module.exports = (sequelize, DataTypes) => {
  class Complaint extends Model {
    static associate(models) {
      Complaint.hasMany(models.MediaAttachment, {
        foreignKey: "ComplaintId",
      });
    }

    findRegion() {
      let result = "Di Luar Jakarta";
      if (!this.location) {
        return result;
      }
      const { longitude, latitude } = this.location;
      const point = turf.point([longitude, latitude]);

      for (const region of jakartaRegions) {
        const polygon = turf.polygon(region.geometry.coordinates);
        if (turf.booleanPointInPolygon(point, polygon)) {
          result = region.properties.name;
          break;
        }
      }

      return result;
    }
  }

  Complaint.init(
    {
      from: DataTypes.STRING,
      type: DataTypes.ENUM(
        "accident",
        "criminal",
        "environment",
        "infrastructure",
        "congestion",
        "extortion",
        "other"
      ),
      region: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      attachments: DataTypes.JSON,
      location: DataTypes.JSON,
      status: DataTypes.STRING,
      priority: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Complaint",
    }
  );

  Complaint.beforeCreate((complaint) => {
    complaint.region = complaint.findRegion();
  });

  return Complaint;
};
